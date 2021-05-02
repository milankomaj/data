const commandLineUsage = require('command-line-usage');

const sections = [
  {
    header: 'merge-convert',
    content: 'Merges all the csv files passed as an input, converts them into json and outputs them into a file.',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'pattern',
        typeLabel: '{underline pattern}',
        description: 'The pattern of the input files to process.',
      },
      {
        name: 'keyby',
        typeLabel: '{underline propertyName}',
        description: 'The name of the property to keyby.',
      },
      {
        name: 'assignTo',
        typeLabel: '{underline propertyName}',
        description: 'The name of the property to assign the result to.',
      },
      {
        name: 'outputTo',
        typeLabel: '{underline filePath}',
        description: 'The filepath to output the result to.',
      },
      {
        name: 'transformerConfig',
        typeLabel: '{underline propertyName}',
        description: 'The name of the file containing the config for transformation',
      },
    ],
  },
];

const usage = commandLineUsage(sections);

module.exports = { usage };
