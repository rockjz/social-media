const express = require('express');
// const basicAuth = require('express-basic-auth');

const app = express();
const port = 1738;

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use('/resources', express.static("resources"));

// const authentication = basicAuth({
//   users: { 'admin': 'password' },
//   challenge: true,
// })

// --- MAIN PAGE ---
app.get('/', (req, res) => {
  res.render("mainpage.pug");
})

// --- LOGIN PAGE ---
app.get('/login', (req, res) => {
  res.render("login.pug");
})

app.use((req, res, next) => {
  res.status(404).render('404.pug');
})

app.listen (port , () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://127.0.0.1:1738/`);
})