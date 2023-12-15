const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const { create_post, get_posts, get_user, create_user, get_likes, increase_like, edit_post, delete_post } = require('./data');

const app = express();
const port = 1738;
app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ 
  secret:"nukeradio",
  resave: false,
  saveUninitialized: false, 
}))
app.use('/resources', express.static("resources"));


// --- MAIN PAGE ---
app.get('/', (req, res) => {
  // Determine how the post order is displayed
  if (req.session.sort === undefined && req.query.sort === undefined) {
    req.session.sort = ""
  }
  else if (req.query.sort !== undefined) {
    req.session.sort = req.query.sort
  } 

  get_posts(req.session.sort).then(posts => {
    const numPages = (posts.length / 5);
    let page = parseInt(req.query.page ?? 1)
    if (!page) {
      page = 1;
    }
    let offset = (page - 1) * 5;
    posts = posts.slice(offset, offset + 5)
    let pages = [];
    for (let i = 1; i < numPages + 1; i++) {
      pages.push(i);
    }
    res.render("mainpage.pug", { posts, loggedIn: req.session.name ? true : false, pages, username: req.session.name, sort: req.session.sort, page });
  })
})

// --- LOGIN PAGE ---
app.get('/login', (req, res) => {
  loggedIn = req.session.name ? true : false;
  if (!loggedIn) {
    res.render("login.pug", { loggedIn });
  }
  else {
    res.render("profile.pug", { loggedIn, name: req.session.name })
  }
})

app.post('/login', async (req, res) => {
  loggedIn = req.session.name ? true : false;
  try {
    get_user(req.body.loginUser).then(user => {

      // No user exists
      if(user[0] === undefined) {
        res.render("alert.pug", { loggedIn, message: "No user exists" })
        return
      }

      // Successful login
      if(req.body.loginPass === user[0].password) {
        req.session.name = req.body.loginUser;
        res.render("profile.pug", { name: req.session.name, loggedIn: true });
      } 

      // Incorrect password
      else {
        res.render("alert.pug", { loggedIn, message: "Incorrect password" });
      }
    })
  } catch {
    res.status(400).render("alert.pug", { loggedIn, message: "Error logging in" });
  }
})

app.post('/createAccount', (req, res) => {
  loggedIn = req.session.name ? true : false;
  try {
    create_user(req.body.newUser, req.body.newPass).then(user => {

      // User already exists
      if(!user) {
        res.render("alert.pug", { loggedIn, message: "User already exists" })
        return
      }

      // Successful creation
      req.session.name = req.body.newUser;
      res.status(201).render("profile.pug", { name: req.session.name, loggedIn: true });
    })
  } catch {
    res.status(400).render("loginerror.pug", { loggedIn });
  }
})

// --- LOGOUT ---
app.get('/logout', async (req, res) => {
  req.session.destroy()
  res.render("alert.pug", { loggedIn: false, message: "Successfully logged out" })
})

// --- NEW POST PAGE ---
app.get('/post', (req, res) => {
  loggedIn = req.session.name ? true : false;
  res.render("postpage.pug", { loggedIn });
})

app.post('/post', (req, res) => {
  loggedIn = req.session.name ? true : false;
  if (loggedIn) {
    create_post(req.session.name, req.body.content).then(newPost => {
      res.status(201).render("alert.pug", { loggedIn, message: "Post created!" })
    })
  }
  else {
    res.status(403).render("alert.pug", { loggedIn, message: "Error creating post" });
  }
})

// --- LIKES AND DISLIKES ---
app.post('/addUpvote', async (req, res) => {
  const post_id = parseInt(req.body.id)
  await get_likes(post_id).then(numLikes => {
    numLikes += 1;
    increase_like(post_id, numLikes++);
  })
})

// app.post('/removeUpvote', async (req, res) => {
//   const post_id = parseInt(req.body.id)
//   await get_likes(post_id).then(numLikes => {
//     numLikes -= 1;
//     increase_like(post_id, numLikes++);
//   })
// })

// --- EDIT / DELETE POSTS ---

app.post('/editPost', async (req, res) => {
  const post_id = parseInt(req.body.id);
  const newMessage = req.body.message;
  await edit_post(post_id, newMessage)
})

app.post('/deletePost', async (req, res) => {
  const post_id = parseInt(req.body.id);
  await delete_post(post_id)
})

app.use((req, res, next) => {
  res.status(404).render('404.pug');
})

app.listen (port , () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://127.0.0.1:1738/`);
})