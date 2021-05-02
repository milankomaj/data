const mock = require('mock-fs');

const { csvToJson } = require('../../lib/csvToJson');

beforeAll(() => mock({
  '/tmp/a.csv': 'username,email,organization,password\ntommy.jones,tommy.jones@northwindtraders.com,NorthwindTraders,password@123\n',
}));

test('Should return the json object on reading a csv file', (done) => {
  const testCb = (err, values) => {
    const userSachin = {
      username: 'tommy.jones',
      email: 'tommy.jones@northwindtraders.com',
      organization: 'NorthwindTraders',
      password: 'password@123',
    };
    const expected = [userSachin];
    expect(values).toEqual(expect.arrayContaining(expected));
    done(err);
  };
  csvToJson('/tmp/a.csv', testCb);
});

test('Should return error on incorrect file path', (done) => {
  const testCb = (err) => {
    if (err) {
      done();
    }
  };
  csvToJson('/tmp/b.csv', testCb);
});

afterAll(() => {
  mock.restore();
});
