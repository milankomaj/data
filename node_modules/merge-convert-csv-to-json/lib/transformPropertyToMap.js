const transformStringToMap = (config, jsonData) => {
  const {
    field,
    keyIndex,
    valueIndex,
    propertySplitter,
    keyValueSplitter,
  } = config;
  const fieldValue = jsonData[field];
  const transformedProperty = {};
  transformedProperty[field] = fieldValue.split(propertySplitter).reduce((acc, value) => {
    const keyValuePair = value.split(keyValueSplitter);
    acc[keyValuePair[keyIndex]] = keyValuePair[valueIndex];
    return acc;
  }, {});
  return Object.assign(jsonData, transformedProperty);
};

const transformPropertyToMap = (config, data, callback) => {
  const transformedData = data.map(transformStringToMap.bind(null, config));
  return callback(null, transformedData);
};

module.exports = { transformPropertyToMap };
