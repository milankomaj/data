const csv = require('csvtojson');

function csvToJson(fileName, callback) {
  return csv()
    .fromFile(fileName)
    .then((value) => callback(null, value))
    .catch((err) => callback(err));
}

module.exports = { csvToJson };
