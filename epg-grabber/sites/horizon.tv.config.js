const axios = require('axios')
const dayjs = require('dayjs')
const API_ENDPOINT = `https://legacy-static.oesp.horizon.tv/oesp/v4`
const API_PROD_ENDPOINT = `https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/listings/`
module.exports = {
  site: 'horizon.tv',
  url: function ({ date, channel }) {
    const [country, lang] = channel.site_id.split('#')
    return `${API_ENDPOINT}/${country}/${lang}/web/programschedules/${date.format('YYYYMMDD')}/1`
  },
  async parser({ content, channel, date }) {
    const [country, lang] = channel.site_id.split('#')
    let programs = []
    let items = parseItems(content, channel)
    if (!items.length) return programs
    const d = date.format('YYYYMMDD')
    const promises = [
      axios.get(`${API_ENDPOINT}/${country}/${lang}/web/programschedules/${d}/2`),
      axios.get(`${API_ENDPOINT}/${country}/${lang}/web/programschedules/${d}/3`),
      axios.get(`${API_ENDPOINT}/${country}/${lang}/web/programschedules/${d}/4`)
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
      const detail = await loadProgramDetails(item)
      programs.push({
        title: item.t,
        description: parseDescription(detail),
        start: parseStart(item),
        stop: parseStop(item),
        category: parseCategory(detail),
        icon: parseIcon(detail)
      })
    }
    return programs
  },
  async channels({ country, lang }) {
    const langs = { deu: 'de', slk: 'sk' }
    const data = await axios
      .get(`https://legacy-dynamic.oesp.horizon.tv/oesp/v4/SK/slk/web/channels`)
      .then(r => r.data)
      .catch(console.log)
    return data.channels.map(item => {
      return {
        lang: langs[lang],
        site_id: `${country}#${lang}#${item.stationSchedules[0].station.id}`,
        name: item.title
      }
    })
  }
}
async function loadProgramDetails(item, channel) {
  if (!item.i) return {}
  const url = `${API_PROD_ENDPOINT}` + `${parseI(item)}`
  const data = await axios
    .get(url)
    .then(r => r.data)
    .catch(console.log)
  //  console.log(url)
  // console.log(data)
  return data || {}
}
function parseI(item) {
  return item.i
}
function parseStart(item) {
  return dayjs(item.s)
}
function parseStop(item) {
  return dayjs(item.e)
}
/*
function parsestartT(item) {
  return item.s
}
function parsestopP(item) {
  return item.e
}
*/
function parseItems(content, channel) {
  if (!content) return []
  const [_, __, channelId] = channel.site_id.split('#')
  const data = typeof content === 'string' ? JSON.parse(content) : content
  if (!data || !Array.isArray(data.entries)) return []
  const entity = data.entries.find(e => e.o === channelId)
  if (!entity) return []
  //console.log("bbbbb",entity.o)
  return entity ? entity.l : []
}
function parseDescription(detail) {
  //console.log(detail.listings[0].program.description)
  if (!detail.program.longDescription) return null
  return detail.program.longDescription
}
function parseCategory(detail) {
  //console.log(detail.listings[0].program.categories)
  let categories = []
  detail.program.categories.forEach(category => {
    categories.push(category.title)
  });
  return categories
}
function parseIcon(detail) {
  if (!detail.program.images) return null
  return detail.program.images[3].url
}