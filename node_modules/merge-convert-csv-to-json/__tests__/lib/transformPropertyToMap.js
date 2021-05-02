
const { transformPropertyToMap } = require('../../lib/transformPropertyToMap.js');

test('Should be able to convert value of type string to map', (done) => {
  const transformerConfig = {
    pluginType: 'transformPropertyToMap',
    keyValueSplitter: ':',
    propertySplitter: ',',
    keyIndex: '0',
    valueIndex: '1',
    field: 'groups_access',
  };

  const data = [
    {
      username: 'john.doe',
      email: 'john.doe@northwind.in',
      password: 'password@123',
      groups_access: 'northwind-group:guest,northwind-auditors:guest',
    },
  ];

  const expected = [
    {
      username: 'john.doe',
      email: 'john.doe@northwind.in',
      password: 'password@123',
      groups_access: {
        'northwind-group': 'guest',
        'northwind-auditors': 'guest',
      },
    },
  ];

  transformPropertyToMap(transformerConfig, data, (err, transformedData) => {
    expect(transformedData).toMatchObject(expected);
    done();
  });
});
