const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'short' });

const getLogger = (loggerName) => bunyan.createLogger({ name: loggerName, stream: formatOut });

module.exports = { getLogger };
