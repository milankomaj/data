const dayjs = require('dayjs')
module.exports = {
  site: 'ceskatelevize.cz',
  maxConnections: 5,
  request: {
    timeout: 20000, //
    delay: 6000, // 3 seconds
    cache: {
      ttl: 60 * 60 * 1000 // 1 hour
    }
  },
  url: function ({ date, channel }) {
    const day = date.format('DD.MM.YYYY')
    return `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=test&date=${day}&channel=${channel.site_id}&regiony=1&json=1`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let items = parseItems(content, channel)
    if (!items.length) return programs
    for (let item of items) {
      programs.push({
        title: item.nazvy.nazev,
        sub_title: (String((item.nazvy.nazev_casti)).replace({}, "") + "  " + parseTags(item).formedIkonky).trim(),
        start: dayjs(item.datum + item.cas).toJSON(),
        stop: (dayjs(item.datum + item.cas).add(item.stopaz.split(":")[0], 'minute')).toJSON(),
        description: item.noticka || [],
        category: item.zanr ? item.zanr : [],
        icon: item.obrazky ? item.obrazky.nahled : item.obrazky.tv_program,
        season: Number(parseEpisode(item)[0]) || [],
        episode: Number(parseEpisode(item)[1]) || [],
        url: item.linky.program ? item.linky.program : [],
        length: { units: 'minutes', value: Number(String(item.stopaz).split(':')[0]) } || [], //
        audio: { stereo: parseTags(item).zvuk }, //
        video: { aspect: parseTags(item).pomer, colour: parseTags(item).cb, quality: parseTags(item).hd },
        premiere: parseTags(item).premiera,
      })
    }
    return programs
  }
}
function parseItems(content, channel) {
  const Jdata = JSON.parse(content).porad
  return Jdata
}
function parseEpisode(item) {
  if (String(item.dil).split('/').length == "1") return []
  const str = String(item.dil).split('/')
  return str
}
const zvukMap = {
  M: 'Mono',
  S: 'Stereo',
  D: 'Duálny zvuk',
  E: 'Dolby',
  B: 'Dolby Surround',
}
const tagMap = {
  ad: ['Zvukový popis', 'yes', 'no'],
  hd: ['HD', 'yes', 'no'],
  skryte_titulky: ['Skryté titulky', 'yes', 'no'],
  neslysici: ['Znaková reč', 'yes', 'no'],
  live: ['Priamy prenos', 'yes', 'no'],
  premiera: ['Premiéra', 'yes', 'no'],
  cb: ['Čiernobiely', 'yes', 'no'],
  hvezdicka: ['Nevhodný pre mládež', 'yes', 'no'],
  puvodni_zneni: ['Pôvodné znenie', 'yes', 'no']
};
function parseTags(item) {
  const filteredIkonky = Object.fromEntries(Object.entries(item.ikonky).filter(([key, value]) => (Object.keys(value).length != 0)));
  // console.table((filteredIkonky))
  const zerofree = Object.fromEntries(Object.entries(filteredIkonky).filter(([key, value]) => value !== "0"))
  if (zerofree.zvuk) { zerofree.zvuk = zvukMap[zerofree.zvuk] || zerofree.zvuk }
  const formedIkonky = Object.entries(zerofree).map(([key, value]) => {
    // Check if the key is in tagMap and use its label
    if (tagMap[key]) {
      return tagMap[key][0];  // Use the label from tagMap (only the first value in the array)
    } else {
      return value;  // For other values, return them unchanged (e.g., "15+" or "16:9-CS")
    }
  }).sort().reverse();
  const zvuk = filteredIkonky.zvuk ? zvukMap[filteredIkonky.zvuk] : ""
  const labeling = filteredIkonky.labeling ? filteredIkonky.labeling : ""
  const pomer = filteredIkonky.pomer ? filteredIkonky.pomer : ""
  const skryte_titulky = filteredIkonky.skryte_titulky === "1" ? tagMap["skryte_titulky"][1] : tagMap["skryte_titulky"][2];
  const cb = filteredIkonky.cb === "0" ? tagMap["cb"][1] : tagMap["cb"][2];
  const hd = filteredIkonky.hd === "1" ? tagMap["hd"][0] : "SD";
  const premiera = filteredIkonky.premiera == "1" ? tagMap["premiera"][0] : "";
  return { zvuk, labeling, pomer, skryte_titulky, cb, hd, premiera, formedIkonky }
}
