// const async = require('async');

// const { concatFiles } = require('./concatFiles');
// const { keyBy } = require('./keyBy');
// const { writeToFile } = require('./writeToFile');
// const { csvToJson } = require('./csvToJson');

// const mergeGroups = (groupFiles, mergedGroupsFilePath, cb) => async.waterfall([
//   concatFiles(groupFiles, csvToJson),
//   keyBy('group_name'),
//   writeToFile(mergedGroupsFilePath),
// ], cb);

// module.exports = { mergeGroups };
