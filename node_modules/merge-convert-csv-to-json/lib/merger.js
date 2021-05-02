const fs = require('fs');
const path = require('path');
const glob = require('glob');

const { mergeUsers } = require('./mergeUsers');
const { mergeGroups } = require('./mergeGroups');

const valuesDirectory = process.argv[2];

if (!fs.existsSync(valuesDirectory)) {
  const stats = fs.statSync(valuesDirectory);
  if (!stats.isDirectory()) {
    throw new Error(`No directory exists in the following path ${valuesDirectory}`);
  }
}

const userFiles = glob.sync(path.join(valuesDirectory, '*.users.csv'));
const groupFiles = glob.sync(path.join(valuesDirectory, '*.groups.csv'));

const mergedUsersFilePath = path.join(valuesDirectory, './users.auto.tfvars.json');
const mergedGroupsFilePath = path.join(valuesDirectory, './groups.auto.tfvars.json');

mergeUsers(userFiles, mergedUsersFilePath);
mergeGroups(groupFiles, mergedGroupsFilePath);
