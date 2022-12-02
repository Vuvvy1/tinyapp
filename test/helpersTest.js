const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
};

describe('#getUserByEmail()', () => {
  it('should return a user with a valid email', () => {
    const user = getUserByEmail('user@example.com', testUsers);
    const  expectedOutput = testUsers.userRandomID;
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined with an invalid email', () => {
    const user = getUserByEmail('noUser@example.com', testUsers);
    const  expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});