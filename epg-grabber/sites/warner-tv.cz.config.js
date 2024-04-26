const dayjs = require('dayjs')

module.exports = {
  site: 'warner-tv.cz',
  maxConnections: 5,
  url: function ({ date, channel }) {
    const day = date.format('YYYY/M/DD')

    return `https://warner-tv.cz/api/tv-schedule/date/${day}`
  },
  async parser({ content, channel, date }) {
    let programs = []
    let items = parseItems(content)
    if (!items.length) return programs

    const images = items.items_images

    // console.log("👉 jsondate:", items.date)

    const hour = items.items.map((xx) => xx.program_hour)
    const iterator1 = hour.entries();
    const current = String(iterator1.next().value).split(",")[1]



    items.items.forEach(item => {
      const nexthour = String(iterator1.next().value).split(",")[1]

      function parseStart(item) {
        const half = String(item.program_hour).split(":")[0]
        // console.log("👉 half:", half, (half == "00" || half == "01" || half == "02" || half == "03" || half == "04" || half == "04" || half == "05"))
        if (["00", "01", "02", "03", "04", "05"].includes(half)) return date.add(1, 'day').format('YYYY/MM/DD')
        return date.format('YYYY/MM/DD')
      }
      function parseStop() {
        const half = String(nexthour).split(":")[0]
        // console.log("👉 half:", half, (half == "undefined" || half == "00" || half == "01" || half == "02" || half == "03" || half == "04" || half == "04" || half == "05"))
        if (["undefined", "00", "01", "02", "03", "04", "05"].includes(half)) return date.add(1, 'day').format('YYYY/MM/DD')
        return date.format('YYYY/MM/DD')
      }



      programs.push({
        title: item.program_title,
        sub_title: parseYear(item) + parseSeason(item) + parseEpisode(item) || [],
        start: dayjs(parseStart(item) + item.program_hour).toJSON(), //date.format(`YYYY/M/DD${item.program_hour}`),
        stop: dayjs(parseStop() + (nexthour || current)).toJSON(),
        description: item.description || [],
        season: item.season_number || [], // season number (optional)
        episode: item.episode_number || [], // episode number (optional)
        actor: item.actors || [],
        icon: images[item.tv_program_id] || []
      })
    })
    return programs
  }
}

function parseItems(content) {
  return JSON.parse(content)
}

function parseYear(item) {
  if (!item.release_year) return []
  return [
    " R:" + item.release_year
  ]
}

function parseEpisode(item) {
  if (String(item.episode_number).length == 0) return []
  if (String(item.episode_number_format).length > 3) return []
  return [
    " E:" + item.episode_number_format
  ]
}

function parseSeason(item) {
  if (String(item.season_number).length == 0) return []
  if (String(item.season_number_format).length > 2) return []
  return [
    " S:" + item.season_number_format
  ]
}
