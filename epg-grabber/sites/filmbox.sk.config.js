//const axios = require('axios')
const dayjs = require('dayjs')

module.exports = {
  site: 'sledujfilmbox.sk',
  maxConnections: 5,
  request: {
    timeout: 9000, //
    delay: 3000, // 3 seconds
    cache: {
      ttl: 60 * 60 * 1000 // 1 hour
    }
  },
  url: function ({ date, channel }) {
    const day = date.format('YYYY-MM-DD')
    return `https://www.sledujfilmbox.sk/epg/data/?date=${day}`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let items = parseItems(content, channel)
    if (!items.length) return programs


    for (let item of items) {

      programs.push({
        title: item.nazev,
        sub_title: (item.zeme ? item.zeme : []) + (parseYear(item) || []),
        description: parseDescription(item) || [],
        //description: parseLeng(item).dlouhypopis || parseLeng(item).kratkypopis || parseLeng(item).popisek,
        category: item.typprg ? item.typprg : [],
        actors: item.hraji ? item.hraji : [],
        directors: item.rezie ? item.rezie : [],
        date: item.rok ? item.rok : [],
        start: dayjs(item.od).toJSON(),
        stop: dayjs(item.do).toJSON(),
        icon: item.obrazek ? item.obrazek : []
      })
    }
    return programs
  }
}


function parseItems(content, channel) {
  const Jdata = JSON.parse(content).data
  const channelId = channel.site_id
  return Jdata[channelId].data
}

function parseYear(item) {
  if (!item.rok) return []
  return [
    " R:" + item.rok
  ]
}

function parseDescription(item) {
  const popisek = String(item.popisek ? item.popisek : [])
  const kratkypopis = String(item.kratkypopis ? item.kratkypopis : [])
  const dlouhypopis = String(item.dlouhypopis ? item.dlouhypopis : [])
  // console.log(" (item).length 👉", dlouhypopis.length, kratkypopis.length, popisek.length)
  if (popisek.length > dlouhypopis.length) return popisek ? popisek : dlouhypopis
  return dlouhypopis || kratkypopis || popisek
}
