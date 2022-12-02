let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
const express = require("express");
const bcrypt = require('bcryptjs');
//const methodOveride =
const PORT = 8080; // default port 8080
const {
  generateRandomString,
  urlsForUser,
  isUserUrl,
  getUserByEmail
} = require('./helpers');

const salt = bcrypt.genSaltSync(10);

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "Vuvvy",
  },
};

const userDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  Vuvvy: {
    id: "Vuvvy",
    email: "poop@example.com",
    password: '',
  },
};

userDatabase.Vuvvy.password = bcrypt.hashSync("poop");

app.get('/', (req, res) => {
  
  if (req.session.user) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/urls.json", (req, res) => {
  
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  const user = req.session.user;
  res.send(`<html><body>Hello ${user}<b>!</b></body></html>\n`);
});

app.get("/urls", (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
  const templateVars = {
    urls: urlsForUser(req.session.user.id , urlDatabase),
    usercook : req.session.user,
    userinfo : req.session.user
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    usercook : req.session.user,
    userinfo : req.session.user
  };
  if (!req.session.user) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user) {
    res.status(403).send('Cannot edit without login');
  }
  if (isUserUrl(req.params.id, req.session.user, urlDatabase) === false) {
    res.status(403).send('you dont own this url');
  }
  if (!urlDatabase[req.params.id]) {
    res.status(403).send('id does not exist');
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    userinfo : req.session.user, };
  res.render("urls_show", templateVars);
});

app.post('/urls', (req, res) => {
  if (!req.session.user) {
    res.status(403).send('Cannot shorten without login');
  } else {
    const shortUrl = generateRandomString(6);
    urlDatabase[shortUrl] =  {
      longURL: req.body.longURL,
      userID: req.session.user.id
    };
    res.redirect(`/urls/${shortUrl}`);
  }
});

app.get("/u/:id", (req, res) => {
  const urlObj = urlDatabase[req.params.id];
  const longUrl = urlObj.longURL;
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(400).send('Unkown URL');
  }
});

app.get('/urls/delete/:id', (req, res) => {
  if (!req.session.user) {
    res.status(403).send('Cannot delete without login');
  }
  if (!isUserUrl(req.params.id, req.session.user, urlDatabase)) {
    res.status(403).send('you dont own this url');
  }
  if (!urlDatabase[req.params.id]) {
    res.status(403).send('id does not exist');
  }
  const shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.post('/urls/:id', (req, res) => {
  const templateVars = {
    usercook : req.session.user,
    userinfo : req.session.user,
    longURL : req.body.longURL
  };
  const shortUrl = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortUrl].longURL = longURL;
  res.redirect("/urls");
});
app.post('/login', (req, res) => {
  let redirecting = false;
  if (req.body === "") {
    res.redirect('/login');
  }
  const username = getUserByEmail(req.body.email, userDatabase);
  if (!username || !bcrypt.compareSync(req.body.password, username.password)) {
    res.status(403).send('Password not matching');
  } else {
    req.session.user = username;
    res.redirect("/urls");
    redirecting = true;
    return;
  }
  if (!redirecting) {
    res.status(403).send('no matching email');
  } else {
  }
});
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    usercook:req.session.user,
    userinfo : req.session.user
  };
  res.render("urls_register", templateVars);
});

app.post('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/urls');
  }
  const oldps = req.body.password;
  const reqEmail = req.body.email;
  if (reqEmail === "" || oldps === "") {
    res.sendStatus(400);
  }
  const objectData = Object.keys(userDatabase);
  for (let userNum in objectData) {
    let objectData = Object.keys(userDatabase)[userNum];
    if (userDatabase[objectData].email === req.body.email) {
      res.status(400).send('Email already registered');
    }
  }
  const hashedPw = bcrypt.hashSync(oldps);
  const user = {
    id: generateRandomString(6),
    email: reqEmail,
    password: hashedPw,
  };
  userDatabase[user.id] = user;
  //req.session[userIdCookie] = user.id;
  //res.cookie("user", user.id);
  req.session.user = user.id;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect('/urls');
  }
  const templateVars = {
    urls: urlDatabase,
    usercook: req.session.user,
    userinfo : req.session.user
  };
  res.render("urls_login", templateVars);
});

app.get("/Profile", (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  }
  const templateVars = {
    userinfo : userDatabase[req.session.user],
    usercook : req.session.user,
    username : req.session.user,
    email : req.session.user.email,
    password : req.session.user.password,
  };

  if (req.session.user) {
    res.render("urls_profile", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

