#!/usr/bin/env node
const commandLineArgs = require('command-line-args');

const { usage } = require('../lib/cli-usage');
const { mergeConvertCsv2Json } = require('../lib/merge-convert-csv-to-json');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'pattern', type: String },
  { name: 'keyBy', type: String },
  { name: 'assignTo', type: String },
  { name: 'outputTo', type: String },
  { name: 'transformerConfig', type: String },
];

try {
  const options = commandLineArgs(optionDefinitions);
  const valid = options.pattern && options.outputTo;
  if (valid) {
    mergeConvertCsv2Json(options);
  } else {
    console.log('invalid');
    console.log(usage);
  }
} catch (e) {
  console.log(e);
  console.log(usage);
}
