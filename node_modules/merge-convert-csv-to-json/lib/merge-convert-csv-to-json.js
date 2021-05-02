/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const async = require('async');
const glob = require('glob');
const fs = require('fs');

const { keyBy } = require('./keyBy');
const { getLogger } = require('./logger');
const { concatFiles } = require('./concatFiles');
const { writeToFile } = require('./writeToFile');
const { assignToProperty } = require('./assignToProperty');
const { csvToJson } = require('./csvToJson');

const log = getLogger('merge');

const mergeConvertCsv2Json = (options) => {
  const files = glob.sync(options.pattern);
  log.trace('Enabling ConcatFiles Modules');

  const transformers = [];
  if (options.transformerConfig) {
    const transformerConfigAsString = fs.readFileSync(options.transformerConfig, 'utf8');
    const transformerConfig = JSON.parse(transformerConfigAsString);
    transformers.push(...transformerConfig.map((config) => require(`./${config.pluginType}`)[config.pluginType].bind(null, config)));
  }
  const csvToJsonWithTransformers = async.compose(...transformers, csvToJson);

  const modules = [concatFiles(files, csvToJsonWithTransformers)];

  if (options.keyBy) {
    log.trace(`Enabling KeyBy module for the option ${options.keyBy}`);
    modules.push(keyBy(options.keyBy));
  }

  if (options.assignTo) {
    log.trace(`Enabling AssignTo Module for the option ${options.assignTo}`);
    modules.push(assignToProperty(options.assignTo));
  }

  log.trace(`Enabling writeToFile Module for the option ${options.outputTo}`);
  modules.push(writeToFile(options.outputTo));
  async.waterfall(modules, (err) => {
    if (err) {
      log.error(err);
    } else {
      log.info(`Files with pattern ${options.pattern} merged and convert to json at ${options.outputTo}`);
    }
  });
};

module.exports = { mergeConvertCsv2Json };
