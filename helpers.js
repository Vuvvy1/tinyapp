const generateRandomString = (length) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const string_Length = length;
  let randomstring = '';
  for (let i = 0; i < string_Length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars[rnum];
  }
  return randomstring;
};

const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortUrlKey in urlDatabase) {
    if (urlDatabase[shortUrlKey].userID === id) {
      userUrls[shortUrlKey] = urlDatabase[shortUrlKey];
    }
  }
  return userUrls;
};

const isValidUrl = (shortUrl, urlDatabase) => {
  if (urlDatabase[shortUrl]) {
    return true;
  }
  return false;
};

const isUserUrl = (shortUrl, user, urlDatabase) => {
  if (isValidUrl(shortUrl, urlDatabase) && urlDatabase[shortUrl].userID === user.id) {
    return true;
  }
  return false;
};

const getUserByEmail = function(email, database) {
  for(const userId in database){
    if (database[userId].email === email) {
      return database[userId];
      }}};

module.exports = {
  generateRandomString,
  urlsForUser,
  isUserUrl,
  getUserByEmail
};