jest.mock('fs');
const fs = require('fs');

const { writeToFile } = require('../../lib/writeToFile.js');

test('Should be able to write JSON Data to the file', (done) => {
  const data = {
    a: {
      b: 'c',
    },
  };
  const testCb = (err) => {
    const actualResult = JSON.parse(fs.readFileSync('/tmp/a.json'));
    expect(actualResult).toMatchObject(data);
    done(err);
  };
  writeToFile('/tmp/a.json')(data, testCb);
});
