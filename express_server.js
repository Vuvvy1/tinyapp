let cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  Vuvvvy: {
    id: "Vuvvvy",
    email: "poop@example.com",
    password: "poop",
  },
};


// const templateVars = {
//   username: req.cookies["username"],
//   // ... any other vars
// };

//res.render("urls_index", templateVars);


app.get('/', (req, res) => {
  
  if (req.user) {
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
  const user = req.cookies['user'];
  res.send(`<html><body>Hello ${user}<b>!</b></body></html>\n`);
});

app.get("/urls", (req, res) => {
  console.log(urlDatabase);
  const templateVars = {
    urls: urlDatabase,
    usercook: req.cookies['user'],
    userinfo : userDatabase[req.cookies['user']]
  };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    usercook:req.cookies['user'],
    userinfo : userDatabase[req.cookies['user']]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  console.log("pOOOOOOOP");
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post('/urls', (req, res) => {
  
  const shortUrl = generateRandomString(6);
  console.log("{ id: req.params.id} ➤", { id: req.body.longURL });
  urlDatabase[shortUrl] =  req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
  console.log("urlDatabase ➤", urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  console.log("longURL ➤", longURL);
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  console.log("req.params.id ➤", JSON.stringify(req.params));
  const shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
});

app.post('/urls/:id', (req, res) => {
  const templateVars = {
    usercook:req.cookies['user'],
    userinfo : userDatabase[req.cookies['user']]
  };
  const shortUrl = req.params.id;
  const longURL = req.body.longUrl;
  urlDatabase[shortUrl] = longURL;
  res.redirect("/urls", templateVars);
});
app.post('/login', (req, res) => {
  if (req.body === "") {
    res.redirect('/login');
  } else {
    console.log("trying to login");
    const objectData = Object.keys(userDatabase)
 for (let userNum in objectData) {
   let objectData = Object.keys(userDatabase)[userNum]
   if(userDatabase[objectData].email === req.body.email){
     console.log(userDatabase[objectData].password, req.body.password);
    if(userDatabase[objectData].password === req.body.password){
      console.log("login successful :D ➤");
      console.log("objectData ➤", userDatabase[objectData]);
      let username = userDatabase[objectData].id
      console.log("username ➤", username);
      res.cookie('user', username);
      res.redirect("/profile");
      return
    }else{console.log("login unsuccessful (pass):( ➤");
      res.status(403).send('Password not matching');}

    console.log("login unsuccessful (email):( ➤");
    res.status(403).send('no matching email');
    }
  }


    // let clientUserInput = req.body.username;
    // let clientPassInput = req.body.password;
    // if (clientPassInput = userDatabase[clientUserInput].password) {
    //   console.log("login successful ➤");
    //   res.cookie('user', clientUserInput);
    //   res.redirect("/profile");
    // } else {
    //   console.log("login unsuccessful ➤");
    //   res.redirect("/login");
    // }
  }
});
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    usercook:req.cookies['user'],
    userinfo : userDatabase[req.cookies['user']]
  };
  res.render("urls_register", templateVars);
  // console.log(urlDatabase);
  // const templateVars = { urls: urlDatabase };
  // res.render("urls_index", templateVars);

});

app.post('/register', (req, res) => {
  const objectData = Object.keys(userDatabase)
 for (let userNum in objectData) {
   let objectData = Object.keys(userDatabase)[userNum]
   if(userDatabase[objectData].email === req.body.email){res.status(400).send('Email already registered');}
  }
const hashedPw = req.body.password
const reqEmail = req.body.email

  if (reqEmail === "" || hashedPw === ""){
    res.sendStatus(400);
  }
  const user = {
    id: generateRandomString(6),
    email: reqEmail,
    password: hashedPw,
  };
  userDatabase[user.id] = user;
  res.cookie("user", user.id);
  res.redirect("/profile");
});
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    usercook: req.cookies['user'],
    userinfo : userDatabase[req.cookies['user']]
  };
  res.render("urls_login", templateVars);
});

app.get("/Profile", (req, res) => {
  const templateVars = {
    userinfo : userDatabase[req.cookies['user']],
    usercook : req.cookies['user'],
    username : [req.cookies['user']],
    email : userDatabase[req.cookies['user']].email,
    password : userDatabase[req.cookies['user']].password,
  };
  //console.log("userDatabase[req.cookies['user']] ➤", userDatabase[req.cookies['user']]);

  if (req.cookies['user']) {
    res.render("urls_profile", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie("user");
  res.redirect('/');
});

