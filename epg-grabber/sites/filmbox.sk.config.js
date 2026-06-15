const dayjs = require('dayjs')

module.exports = {
  site: 'filmboxplus.eu',
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
    //console.log("👉 day:", day)
    return `https://filmboxplus.eu/epg-json/schedule-grid?market=CZ&day=${day}`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let channel_items = parseItems(content, channel).filter(item => item.name.includes(channel.name));
    //console.log("👉 channel_items", channel_items)

    let channel_slots = channel_items[0].slots
    //console.log("👉 channel_slots", (channel_slots))

    let items = (channel_slots)


    if (!items.length) return programs


    for (let item of items) {
      const detail = await loadProgramDetails(item, channel)
      programs.push({
        title: item.program.title,
        sub_title: item.program.synopsisShort ? item.program.synopsisShort : [],
        description: item.program.synopsisLong ? item.program.synopsisLong : [],
        category: item.program.genres ? item.program.genres : [],
        actors: item.program.cast ? item.program.cast : [],
        directors: item.program.directors ? item.program.directors : [],
        date: item.program.year ? item.program.year : [],
        start: dayjs(item.startsAt).toJSON(),
        stop: dayjs(item.endsAt).toJSON(),
        icon: parseIcon(detail),
        length: { units: 'minutes', value: Number(String(item.program.durationMinutes)) } || [],
        country: item.program.countries ? item.program.countries : [],
        season: Number(item.program.seasonNumber) || [],
        episode: Number(item.program.episodeNumber) || [],
      })
    }
    //console.log("👉 programs:", programs)
    return programs
  }
}


function parseItems(content, channel) {
  const Jdata = JSON.parse(content).data
  //console.log("Jdata 👉", Jdata)
  const channelId = channel.site_id
  //console.log("channel.name 👉", String(channel.name))
  // console.log("Jdata.channelId 👉",(Jdata.channels))
  return Jdata.channels
}

function parseIcon(detail) {
  if (!detail.data) return []
  const data = detail.data
  // console.log("data.channel 👉", data.imageUrl)
  return data.imageUrl
}


async function loadProgramDetails(item, channel) {
  if (!item.id) return {}
  const url = `https://filmboxplus.eu/cz/wp-admin/admin-ajax.php?action=filmbox_program_card&slot_id=${item.id}`
  const data = await axios
    .get(url)
    .then(r => r.data)
    .catch(console.log)

  return data || {}
}
