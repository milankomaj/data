const dayjs = require('dayjs')


module.exports = {
    site: 'paramountnetwork.cz',
    maxConnections: 5,
    request: {
        timeout: 9000, //
        delay: 3000, // 3 seconds
        cache: {
            ttl: 60 * 60 * 1000 // 1 hour
        }
    },
    url: function ({ date }) {
        const day = date.format('YYYYMMDD')
        // console.log("👉 day:", day)
        return `https://www.paramountnetwork.cz/api/more/tvschedule/${day}`
    },
    async parser({ content }) {
        let programs = []
        let items = JSON.parse(content).tvSchedules
        // console.log("👉 JSON", JSON.parse(content))
        // console.log("👉 items", items)
        // console.log("👉 items.length", !items.length)

        if (!items.length) return programs

        for (let item of items) {
            programs.push({
                title: item.seriesTitle,
                sub_title: (item.episodeTitle ? item.episodeTitle : []) + " " + (item.meta.descriptors[0] ? item.meta.descriptors[0] : []),
                description: item.meta.description || [],
                season: Number(String(item.meta.descriptors[0].split(" ")[0]).valueOf().match(/\d+/g)) || [], // season number (optional)
                episode: Number(String(item.meta.descriptors[0].split(" ")[1]).valueOf().match(/\d+/g)) || [], // episode number (optional)
                start: dayjs(item.airTime).toJSON(),
                stop: (dayjs(item.airTime).add(item.duration, 'minute')).toJSON(),
                length: item.duration,
            })
        }
        // console.log("👉 programs:", programs)
        return programs
    }
}
