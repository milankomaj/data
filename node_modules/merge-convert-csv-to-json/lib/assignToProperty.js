const assignToProperty = (property) => (value, callback) => {
  const obj = {};
  obj[property] = value;
  callback(null, obj);
};

module.exports = { assignToProperty };
