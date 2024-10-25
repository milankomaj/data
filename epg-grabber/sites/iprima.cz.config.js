// const dayjs = require('dayjs')

module.exports = {
    site: 'iprima.cz',
    maxConnections: 5,
    url: 'https://gateway-api.prod.iprima.cz/json-rpc/',
    request: {
        method: 'POST',
        delay: 3000, // 3 seconds
        timeout: 9000, //
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
            "Content-Type": "application/json",
            "Alt-Used": "gateway-api.prod.iprima.cz",
        },
        data: function ({ channel, date }) {

            // console.log("date 👉:", date.format('YYYY-MM-DD'))
            return {
                "id": "web-1",
                "jsonrpc": "2.0",
                "method": "epg.program.bulk.list",
                "params":
                {
                    "date": { "date": date.format('YYYY-MM-DD') },
                    "channelIds": [channel.site_id]
                }
            }
        }
    },

    async parser(content) {
        let programs = []
        let items = parseItems(content).items
        // console.log("items.length 👉:", items.length)

        for (let item of items) {

            programs.push({
                title: item.title,
                start: item.programStartTime,
                stop: item.programEndTime,
                sub_title: (item.episodeTitle ? item.episodeTitle : (item.originalEpisodeTitle || [])) + " " + (item.year || []),
                description: item.description || [],
                category: item.genres,
                date: item.year ? item.year : [],
                icon: parseIcon(item) || [],
                season: item.seasonNumber ? item.seasonNumber : [], // season number (optional)
                episode: item.episodeNumber ? item.episodeNumber : [], // episode number (optional),
                length: item.duration,
                country: item.countries
            })
        }
        // console.log("programs 👉:", programs)
        return programs
    }
}

function parseItems(content) {
    const rpc = (content).content
    // console.log("rpc 👉:", rpc)
    const json = JSON.parse(rpc).result
    return json.data["0"]
}

function parseIcon(item) {
    const poster = String(item.parentImages ? item.parentImages["16x9"] : [])
    const images = String(item.images ? item.images["16x9"] : [])
    if (String(images) == "null" && String(poster) == "null") return []
    if (String(images) != "null") {
        return images
    } else {
        return poster
    }
}