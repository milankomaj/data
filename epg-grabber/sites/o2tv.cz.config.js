const axios = require('axios')
//const dayjs = require('dayjs')
module.exports = {
  site: 'o2tv.cz',
  request: {
    headers: function () {
      return {
        'Referer': 'https://api.o2tv.cz',
        'Host': 'api.o2tv.cz',
        'Accept': 'application/json,*/*',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36'
      }
    }
  },
  url: function ({ date, channel }) {
    const id = encodeURIComponent(channel.site_id)
    //console.log("id", id)
    const d = date.valueOf()
    //const g = dayjs(date).add(1, 'day').valueOf()
    //console.log("d,g", d, g)
    return `https://api.o2tv.cz/unity/api/v1/epg/depr/?forceLimit=true&limit=500&channelKey=${id}&from=${d}`
    //return `https://api.o2tv.cz/unity/api/v1/epg/depr/?forceLimit=true&limit=500&channelKey=${id}&from=${f}&to=${g}`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let items = parseItems(content, channel)
    if (!items.length) return programs
    //console.log("items.length", items.length)

    // items.forEach(item => {
    for (let item of items) {
      // console.log("item",item)
      const detail = await loadProgramDetails(item)
      programs.push({
        title: item.name,
        start: parsestartT(item),
        stop: parsestopP(item),
        description: parseDescription(detail),
        category: parseCategory(detail),
        icon: parseIcon(detail),
        sub_title: parseSub(detail) + parseYear(detail) + parseSeason(detail) + parseEpisode(detail)
      })
    }
    //)
    return programs
  },


}
async function loadProgramDetails(item, channel) {
  if (!item.epgId) return []
  //console.log("item", String(item).length)
  const url = `https://api.o2tv.cz/unity/api/v1/programs/${parseI(item)}/`
  const data = await axios
    .get(url)
    .then(r => r.data)
    .catch(console.log)
  //console.log(url)
  // console.log(data)
  return data || {}
}
function parseItems(content, channel) {
  try {
    const data = JSON.parse(content)
    const id = channel.site_id
    //const id = encodeURIComponent(channel.site_id)
    const channelData = data.epg.items.find(i => i.channel.channelKey == id)
    return channelData.programs && Array.isArray(channelData.programs) ? channelData.programs : []
  } catch (err) {
    return []
  }
}
function parseDescription(detail) {
  if (detail.longDescription) { return detail.longDescription }
  else if (!detail.longDescription && detail.shortDescription) { return detail.shortDescription }
  else { return [] }
}
function parsestartT(item) {
  //console.log("item.start",item.start)
  return item.start
}
function parsestopP(item) {
  //console.log("item.end",item.end)
  return item.end
}
function parseI(item) {
  return item.epgId
}
function parseCategory(detail) {
  if (!detail.genreInfo) return []
  //console.log("detail.map",detail.genreInfo.genres.map((genres) => genres.name).join(', '))
  return detail.genreInfo.genres.map((genres) => genres.name).join(', ')
}
function parseIcon(detail) {
  if (!detail.images) return []
  //console.log("parseIcon", "https://api.o2tv.cz" + detail.images[0].coverMini)
  return "https://api.o2tv.cz" + detail.images[0].coverMini
}
function parseSub(detail) {
  if (!detail.contentType) return []
  return detail.contentType
}
function parseYear(detail) {
  if (!detail.origin) return []
  //console.log("year.length",String(detail.origin.year).length)
  if (String(detail.origin.year).length < 2) return []
  if (String(detail.origin.year).length > 4) return []
  return [
    " R:" + detail.origin.year
  ]
}
function parseEpisode(detail) {
  if (!detail.seriesInfo) return []
  if (String(detail.seriesInfo.episodeNumber).length > 3) return []
  return [
    " E:" + detail.seriesInfo.episodeNumber
  ]
}
function parseSeason(detail) {
  if (!detail.seriesInfo) return []
  if (String(detail.seriesInfo.seasonNumber).length > 2) return []
  return [
    " S:" + detail.seriesInfo.seasonNumber
  ]
}
