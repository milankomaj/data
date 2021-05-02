// const async = require('async');

// const { concatFiles } = require('./concatFiles');
// const { keyBy } = require('./keyBy');
// const { writeToFile } = require('./writeToFile');
// const { csvToJson } = require('./csvToJson');

// const mergeUsers = (userFiles, mergedUsersFilePath, cb) => async.waterfall([
//   concatFiles(userFiles, csvToJson),
//   keyBy('email'),
//   writeToFile(mergedUsersFilePath),
// ], cb);

// module.exports = { mergeUsers };
