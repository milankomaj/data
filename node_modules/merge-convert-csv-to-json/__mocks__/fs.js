const fs = jest.genMockFromModule('fs');

const inMemoryFiles = {};

const writeFile = (fileName, data, callback) => {
  inMemoryFiles[fileName] = data;
  callback(null);
};

const writeFileSync = (fileName, data) => {
  inMemoryFiles[fileName] = data;
};

const readFileSync = (fileName) => inMemoryFiles[fileName];

fs.writeFile = writeFile;
fs.writeFileSync = writeFileSync;
fs.readFileSync = readFileSync;

module.exports = fs;
