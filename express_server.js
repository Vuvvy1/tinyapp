const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const generateRandomString = (length) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const string_length = length;
  let randomstring = '';
  for (let i = 0; i < string_length; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars[rnum];
  }
  return randomstring;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log(urlDatabase);
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post('/urls', (req, res) => {
  
    const shortUrl = generateRandomString(6);
    console.log("{ id: req.params.id} ➤", { id: req.body.longURL });
    urlDatabase[shortUrl] =  req.body.longURL ;
    res.redirect(`/urls/${shortUrl}`);
    console.log("urlDatabase ➤", urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  console.log("longURL ➤", longURL);
  res.redirect(longURL);
});

app.post('/urls/:id/delete', (req, res) => {
  console.log("req.params.id ➤", JSON.stringify(req.params));
  const shortUrl = req.params.id;
 delete urlDatabase[shortUrl];
});

app.post('/urls/:id', (req, res) => {
  const shortUrl = req.params.id;
  const longURL = req.body.longUrl
  urlDatabase[shortUrl] = longURL
  res.redirect("/urls")
  console.log(urlDatabase);

 //delete urlDatabase[shortUrl];
});