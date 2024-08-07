const axios = require('axios')
const dayjs = require('dayjs')
const API_ENDPOINT = `https://legacy-static.oesp.horizon.tv/oesp/v4`
const API_PROD_ENDPOINT = `https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/listings/`
module.exports = {
  site: 'horizon.tv',
  maxConnections: 5,
  url: function ({ date, channel }) {
    //const [country, lang] = channel.site_id.split('#')
    return `${API_ENDPOINT}/SK/slk/web/programschedules/${date.format('YYYYMMDD')}/1`
  },
  async parser({ content, channel, date }) {
    //const [country, lang] = channel.site_id.split('#')
    let programs = []
    let items = parseItems(content, channel)
    if (!items.length) return programs
    const d = date.format('YYYYMMDD')
    const promises = [
      axios.get(`${API_ENDPOINT}/SK/slk/web/programschedules/${d}/2`),
      axios.get(`${API_ENDPOINT}/SK/slk/web/programschedules/${d}/3`),
      axios.get(`${API_ENDPOINT}/SK/slk/web/programschedules/${d}/4`)
    ]
    await Promise.allSettled(promises)
      .then(results => {
        results.forEach(r => {
          if (r.status === 'fulfilled') {
            const parsed = parseItems(r.value.data, channel)
            items = items.concat(parsed)
          }
        })
      })
      .catch(console.error)
    for (let item of items) {
      if (!item.t) return []
      const detail = await loadProgramDetails(item) || []
      programs.push({
        title: item.t,
        description: parseDescription(detail) || [],
        start: dayjs(item.s).toJSON(),
        stop: dayjs(item.e).toJSON(),
        category: parseCategory(detail) || [],
        icon: parseIcon(detail) || [],
        sub_title: (parseSub(detail) + parseYear(detail) + parseSeason(detail) + parseEpisode(detail)) || [],
        //director: parseDirector(detail),
        //season: parseSeason(detail),
        //episode: parseEpisode(detail)
      })
    }
    // console.log("programs:", programs)
    return programs
  }
}
async function loadProgramDetails(item, channel) {
  if (!item.i) return {}
  // console.log("item",item)
  const url = `${API_PROD_ENDPOINT}` + item.i
  const data = await axios
    .get(url)
    .then(r => r.data)
    .catch(console.log)
  // console.log(url)
  // console.log(data)
  return data || {}
}


function parseItems(content, channel) {
  if (!content) return []
  const channelId = String(channel.site_id)
  //console.log("channel.site_id",String(channel.site_id))
  const data = typeof content === 'string' ? JSON.parse(content) : content
  if (!data || !Array.isArray(data.entries)) return []
  const entity = data.entries.find(e => e.o === channelId)
  return entity ? entity.l : []
}
function parseDescription(detail) {
  //console.log(detail.listings[0].program.description)
  let catUa = (detail.program.description == "undefined")
  if (catUa == true) return []
  if (detail.program.longDescription) { return detail.program.longDescription }
  else if (!detail.program.longDescription && detail.program.description) { return detail.program.description }
  else { return [] }
}
function parseCategory(detail) {
  //console.log(detail.listings[0].program.categories)
  if (!detail.program.categories) return []
  let catUb = detail.program.categories.map((category) => category.title).join(', ')
  let catUa = (catUb == "Neklasifikované")
  if (catUa == true) return []
  return catUb
}
function parseIcon(detail) {
  if (!detail.program.images) return []
  return detail.program.images[3].url
}
function parseSub(detail) {
  if (!detail.program.secondaryTitle) return []
  return detail.program.secondaryTitle
}
function parseYear(detail) {
  if (!detail.program.year) return []
  return [
    " R:" + detail.program.year
  ]
}
function parseEpisode(detail) {
  //console.log("seriesEpisodeNumber",String(detail.program.seriesEpisodeNumber).length)
  if (!detail.program.seriesEpisodeNumber) return []
  if (String(detail.program.seriesEpisodeNumber).length > 3) return []
  return [
    " E:" + detail.program.seriesEpisodeNumber
  ]
}
function parseSeason(detail) {
  //console.log("seriesNumber",String(detail.program.seriesNumber).length)
  if (!detail.program.seriesNumber) return []
  if (String(detail.program.seriesNumber).length > 2) return []
  return [
    " S:" + detail.program.seriesNumber
  ]
}
