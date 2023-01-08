const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const convert = require('xml-js')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

module.exports = {
  site: 'mujtvprogram.cz',
  url({ channel, date }) {
    const diff = date.diff(dayjs.utc().startOf('d'), 'd')
    console.log("diff",diff)
    return `https://services.mujtvprogram.cz/tvprogram2services/services/tvprogrammelist_mobile.php?channel_cid=${channel.site_id}&day=${diff}`
  },
  parser({ content }) {
    let programs = []
    const items = parseItems(content)
    //console.log("items",items)
    items.forEach(item => {
      console.log("item",item)
      programs.push({
        title: item.name._text,
        start: parseTime(item.startDate._text),
        stop: parseTime(item.endDate._text),
        description: parseDescription(item),
        category: parseCategory(item),
        date: item.year._text || null,
        director: parseList(item.directors),
        actor: parseList(item.actors),
        sub_title: parseSub(item)
      })
    })
    return programs
  }
}

function parseItems(content) {
  try {
    const data = convert.xml2js(content, {
      compact: true,
      ignoreDeclaration: true,
      ignoreAttributes: true
    })
    if (!data) return []
    //console.log("data",data)
    const programmes = data['tv-program-programmes'].programme
    return programmes && Array.isArray(programmes) ? programmes : []
  } catch (err) {
    return []
  }
}
function parseDescription(item) {
  if (item.longDescription._text) { return item.longDescription._text }
  else if ((!item.longDescription._text && item.shortDescription._text)) { return item.shortDescription._text }
  else { return [] }
}
function parseSub(item) {
  if (item.shortDescription) return item.shortDescription._text
  return null
}
function parseList(list) {
  if (!list) return []
  if (!list._text) return []
  return typeof list._text === 'string' ? list._text.split(', ') : []
}
function parseTime(time) {
  return dayjs.tz(time, 'DD.MM.YYYY HH.mm', 'Europe/Prague')
}

function parseCategory(item) {
  if (!item['programme-type']) return null
  return item['programme-type'].name._text
}
