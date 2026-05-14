
module.exports = {
  site: 'api.stvr.sk',
  maxConnections: 5,
  request: {
    timeout: 9000, //
    delay: 3000, // 3 seconds
    cache: {
      ttl: 60 * 60 * 1000 // 1 hour
    },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "sk,en-US;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Site": "cross-site",
      "X-API-KEY": "2454b377-72d1-4b4a-8e34-d693cd5f787b"
    },
  },
  url: function ({ date, channel }) {
    const day = date.format('YYYY-MM-DD') // date.format('YYYY-MM-DDTHH:mm:ssZZ')
    return `https://api.stvr.sk/json/broadcast/v1.1.4/tv/program?datemode=future&channel=${channel.site_id}&limit=300&offset=0`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let items = parseItems(content, channel).filter(item => item.air_datetimestart.includes(date.format('YYYY-MM-DD[T]')));
    if (!items.length) return programs
    for (let item of items) {

      const sub = parseLength(item).sub_length ? parseLength(item).sub_length : parseLength(item).synopsis_length;
      const des = parseLength(item).des_length ? parseLength(item).des_length : parseLength(item).synopsis_length;
      const boolean_length = Boolean(sub == des); // Check if sub_title and description are the same

      programs.push({
        title: item.name,
        start: new Date((item.air_datetimestart).padEnd(24, "0")).setSeconds("0"), // dayjs((item.air_datetimestart) + ":00").format('YYYY-MM-DDTHH:mm:[00]ZZ')
        stop: new Date((item.air_datetimestop).padEnd(24, "0")).setSeconds("0"),
        icon: item.media.images ? (item.media.images)[0].url : [],
        sub_title: ((boolean_length ? [] : sub) + "  " + (parseTags(item).filteredIkonkyString ? parseTags(item).filteredIkonkyString : [])).trim(), // If the lengths are the same, sub_title is an empty string
        description: des, // Always include description
        audio: { stereo: (item.quality ? item.quality.audio : []) },
        video: { quality: (item.quality ? item.quality.video : []) },

      })
    }
    return programs
  }
}

function parseItems(content, channel, date) {
  const json = JSON.parse(content)
  return json.data
}

function parseLength(item) {
  const sub_length = String(item.subtitle ? item.subtitle : []).trim()
  const des_length = String(item.description ? item.description : []).trim()
  const synopsis_length = (item.synopsis ? item.synopsis : [])
  return { des_length, synopsis_length, sub_length }
}

function parseTags(item) {
  const filteredIkonky = Object.fromEntries(Object.entries(item.quality).filter(([key, value]) => value !== null && (Object.keys(value).length != 0) && (String(key) != "string")));
  const filteredIkonkyString = (Object.fromEntries(Object.entries(item.quality).filter(([key, value]) => value !== null && (Object.keys(value).length != 0) && (String(key) === "string")))).string;
  return { filteredIkonky, filteredIkonkyString }
}
