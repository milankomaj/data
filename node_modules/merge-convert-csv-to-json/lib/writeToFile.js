const fs = require('fs');

const writeToFile = (fileName) => (data, callback) => {
  const jsonStringifiedData = JSON.stringify(data, null, 2);
  return fs
    .writeFile(fileName, jsonStringifiedData, callback);
};

module.exports = { writeToFile };
