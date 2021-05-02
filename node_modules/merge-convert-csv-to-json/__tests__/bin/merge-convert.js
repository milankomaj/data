const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');

beforeEach(() => {
  const sampleA = 'username,email,organization,password\ntommy.jones,tommy.jones@northwindtraders.com,NorthwindTraders,password@123\n';
  const sampleB = 'username,email,organization,password\nanne.frank,anne.frank@northwindtraders.com,NorthwindTraders,password@123\n';
  const sampleC = 'username,email,organization,password,groups_access,project_access\nanne.frank,anne.frank@northwindtraders.com,NorthwindTraders,password@123,"northwind-wave-1:guest,northwind-auditors:guest","northwind-wave-1:guest,northwind-auditors:guest"';
  const transformerConfig = '[{"pluginType":"transformPropertyToMap","keyValueSplitter":":","propertySplitter":",","keyIndex":"0","valueIndex":"1","field":"groups_access"},{"pluginType":"transformPropertyToMap","keyValueSplitter":":","propertySplitter":",","keyIndex":"0","valueIndex":"1","field":"project_access"}]';

  fs.writeFileSync('/tmp/a.users.csv', sampleA);
  fs.writeFileSync('/tmp/b.users.csv', sampleB);
  fs.writeFileSync('/tmp/c.groups.csv', sampleC);
  fs.writeFileSync('/tmp/transformerConfig.json', transformerConfig);
});

afterEach(() => {
  fs.unlinkSync('/tmp/a.users.csv');
  fs.unlinkSync('/tmp/b.users.csv');
  fs.unlinkSync('/tmp/merged.users.json');
  fs.unlinkSync('/tmp/c.groups.csv');
  fs.unlinkSync('/tmp/transformerConfig.json');
});


test('Should merge all the CSV files and convert into single JSON file', (done) => {
  const pathToMergeConvert = path.join(__dirname, '../../bin/merge-convert.js');
  const cmd = `${pathToMergeConvert} --pattern "/tmp/*.users.csv" --outputTo /tmp/merged.users.json`;
  const expected = [{
    username: 'tommy.jones',
    email: 'tommy.jones@northwindtraders.com',
    organization: 'NorthwindTraders',
    password: 'password@123',
  },
  {
    username: 'anne.frank',
    email: 'anne.frank@northwindtraders.com',
    organization: 'NorthwindTraders',
    password: 'password@123',
  }];
  childProcess.exec(cmd, (err) => {
    if (!err) {
      const mergedJSONAsString = fs.readFileSync('/tmp/merged.users.json', 'utf8');
      const mergedJSON = JSON.parse(mergedJSONAsString);
      expect(mergedJSON).toMatchObject(expected);
    }
    done();
  });
});

test('Should Merge all the `CSV` files, convert it to `JSON` object, assign it to a `JSON field` an then store it in a `JSON` file', (done) => {
  const pathToMergeConvert = path.join(__dirname, '../../bin/merge-convert.js');
  const cmd = `${pathToMergeConvert} --pattern "/tmp/*.users.csv" --assignTo users --outputTo /tmp/merged.users.json`;
  const expected = {
    users: [{
      username: 'tommy.jones',
      email: 'tommy.jones@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    },
    {
      username: 'anne.frank',
      email: 'anne.frank@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    }],
  };
  childProcess.exec(cmd, (err) => {
    if (!err) {
      const mergedJSONAsString = fs.readFileSync('/tmp/merged.users.json', 'utf8');
      const mergedJSON = JSON.parse(mergedJSONAsString);
      expect(mergedJSON).toMatchObject(expected);
    }
    done();
  });
});

test('Should Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field and then store it to a `JSON` file', (done) => {
  const pathToMergeConvert = path.join(__dirname, '../../bin/merge-convert.js');
  const cmd = `${pathToMergeConvert} --pattern "/tmp/*.users.csv" --keyBy email --outputTo /tmp/merged.users.json`;
  const expected = {
    'tommy.jones@northwindtraders.com': {
      username: 'tommy.jones',
      email: 'tommy.jones@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    },
    'anne.frank@northwindtraders.com': {
      username: 'anne.frank',
      email: 'anne.frank@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    },
  };
  childProcess.exec(cmd, (err) => {
    if (!err) {
      const mergedJSONAsString = fs.readFileSync('/tmp/merged.users.json', 'utf8');
      const mergedJSON = JSON.parse(mergedJSONAsString);
      expect(mergedJSON).toMatchObject(expected);
    }
    done();
  });
});

test('Should Merge all the `CSV` files, convert it to `JSON` with every object *keyedBy* a `JSON` field, assign the object to a `JSON` field and then store it to a `JSON` file', (done) => {
  const pathToMergeConvert = path.join(__dirname, '../../bin/merge-convert.js');
  const cmd = `${pathToMergeConvert} --pattern "/tmp/*.users.csv" --keyBy email --assignTo users --outputTo /tmp/merged.users.json`;
  const expected = {
    users: {
      'tommy.jones@northwindtraders.com': {
        username: 'tommy.jones',
        email: 'tommy.jones@northwindtraders.com',
        organization: 'NorthwindTraders',
        password: 'password@123',
      },
      'anne.frank@northwindtraders.com': {
        username: 'anne.frank',
        email: 'anne.frank@northwindtraders.com',
        organization: 'NorthwindTraders',
        password: 'password@123',
      },
    },
  };
  childProcess.exec(cmd, (err) => {
    if (!err) {
      const mergedJSONAsString = fs.readFileSync('/tmp/merged.users.json', 'utf8');
      const mergedJSON = JSON.parse(mergedJSONAsString);
      expect(mergedJSON).toMatchObject(expected);
    }
    done();
  });
});

test('Should merge all the CSV files and convert into single JSON file with Transformers', (done) => {
  const pathToMergeConvert = path.join(__dirname, '../../bin/merge-convert.js');
  const cmd = `${pathToMergeConvert} --pattern "/tmp/c.groups.csv" --outputTo /tmp/merged.users.json --transformerConfig /tmp/transformerConfig.json`;
  const expected = [{
    username: 'anne.frank',
    email: 'anne.frank@northwindtraders.com',
    organization: 'NorthwindTraders',
    password: 'password@123',
    groups_access: {
      'northwind-wave-1': 'guest',
      'northwind-auditors': 'guest',
    },
    project_access: {
      'northwind-wave-1': 'guest',
      'northwind-auditors': 'guest',
    },
  }];
  childProcess.exec(cmd, (err, stdout, stderr) => {
    if (!err) {
      const mergedJSONAsString = fs.readFileSync('/tmp/merged.users.json', 'utf8');
      const mergedJSON = JSON.parse(mergedJSONAsString);
      expect(mergedJSON).toMatchObject(expected);
    } else {
      console.log(stdout);
      console.log(stderr);
    }
    done();
  });
});
