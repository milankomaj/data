const mock = require('mock-fs');

const { concatFiles } = require('../../lib/concatFiles');
const { csvToJson } = require('../../lib/csvToJson');

beforeAll(() => mock({
  '/tmp/a.csv': 'username,email,organization,password\ntommy.jones,tommy.jones@northwindtraders.com,NorthwindTraders,password@123\n',
  '/tmp/b.csv': 'username,email,organization,password\nanne.frank,anne.frank@northwindtraders.com,NorthwindTraders,password@123\n',
}));

test('Given set of csv files it should return the merged json', (done) => {
  const testCb = (err, values) => {
    const userSachin = {
      username: 'tommy.jones',
      email: 'tommy.jones@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    };

    const userSagar = {
      username: 'anne.frank',
      email: 'anne.frank@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    };
    const expected = [userSachin, userSagar];
    expect(values).toEqual(expect.arrayContaining(expected));
    done(err);
  };
  concatFiles(['/tmp/a.csv', '/tmp/b.csv'], csvToJson)(testCb);
});

test('Given a non existing path it should throw error', (done) => {
  const testCb = (err) => {
    if (err) done();
  };

  concatFiles(['/tmp/d.csv'], csvToJson)(testCb);
});

afterAll(async () => {
  mock.restore();
});
