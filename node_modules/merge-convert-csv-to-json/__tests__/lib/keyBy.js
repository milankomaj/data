const { keyBy } = require('../../lib/keyBy');

test('Should convert the listToMap', (done) => {
  const users = [
    {
      username: 'tommy.jones',
      email: 'tommy.jones@NorthwindTraders.in',
      organization: 'NorthwindTraders',
      password: 'password@123',
    },
  ];
  const testCb = (err, actualValue) => {
    const expectedValue = {
      'tommy.jones@NorthwindTraders.in': {
        username: 'tommy.jones',
        email: 'tommy.jones@NorthwindTraders.in',
        organization: 'NorthwindTraders',
        password: 'password@123',
      },
    };
    expect(actualValue).toMatchObject(expectedValue);
    done(err);
  };
  keyBy('email')(users, testCb);
});
