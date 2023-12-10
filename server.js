const express = require('express');
const { createPost, getPosts, getUser } = require('./data');

const app = express();
const port = 1738;

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/resources', express.static("resources"));

let loggedIn = false
let userName = ""


// --- MAIN PAGE ---
app.get('/', (req, res) => {
  getPosts().then(posts => {
    res.render("mainpage.pug", { posts, loggedIn });
  })
})

// --- LOGIN PAGE ---
app.get('/login', (req, res) => {
  if (!loggedIn) {
    res.render("login.pug", { loggedIn });
  }
  else {
    res.render("profile.pug", { loggedIn })
  }
})

app.post('/login', (req, res) => {
  try {
    getUser(req.body.loginUser).then(user => {

      if(user[0] === undefined) {
        res.render("nouser.pug", { loggedIn })
        return
      }

      if(req.body.loginPass === user[0].password) {
        loggedIn = true;
        userName = req.body.loginUser;
        res.render("loginsuccess.pug", { loggedIn });
      } 

      else {
        res.render("wrongpass.pug", { loggedIn });
      }
    })
  } catch {
    res.render("loginerror.pug", { loggedIn });
  }
})

// --- NEW POST PAGE ---
app.get('/post', (req, res) => {
  res.render("postpage.pug", { loggedIn });
})

app.post('/post', (req, res) => {
  if (loggedIn) {
    createPost(userName, req.body.content).then(newPost => {
      res.render("postsuccess.pug", { loggedIn })
    })
  }
  else {
    res.render("posterror.pug", { loggedIn });
  }
})

app.use((req, res, next) => {
  res.status(404).render('404.pug');
})

app.listen (port , () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://127.0.0.1:1738/`);
})