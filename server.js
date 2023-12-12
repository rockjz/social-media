const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const { createPost, getPosts, getUser, get_likes, increase_like } = require('./data');

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
  getPosts().then(posts => {
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
    res.render("mainpage.pug", { posts, loggedIn: req.session.name ? true : false, pages });
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
    getUser(req.body.loginUser).then(user => {

      // No user exists
      if(user[0] === undefined) {
        console.log("No user exists")
        res.render("loginerror.pug", { loggedIn })
        return
      }

      // Successful login
      if(req.body.loginPass === user[0].password) {
        userName = req.body.loginUser;
        req.session.name = userName;
        res.render("profile.pug", { name: userName, loggedIn: true });
      } 

      // Incorrect password
      else {
        console.log("Wrong password")
        res.render("loginerror.pug", { loggedIn });
      }
    })
  } catch {
    res.render("loginerror.pug", { loggedIn });
  }
})

// --- LOGOUT ---
app.get('/logout', async (req, res) => {
  req.session.name = undefined;
  loggedIn = req.session.name ? true : false;
  res.render("loggedout.pug", { loggedIn })
})

// --- NEW POST PAGE ---
app.get('/post', (req, res) => {
  loggedIn = req.session.name ? true : false;
  res.render("postpage.pug", { loggedIn });
})

app.post('/post', (req, res) => {
  loggedIn = req.session.name ? true : false;
  if (req.session.name) {
    createPost(userName, req.body.content).then(newPost => {
      res.render("postsuccess.pug", { loggedIn })
    })
  }
  else {
    res.render("posterror.pug", { loggedIn });
  }
})

// --- LIKES AND DISLIKES ---
app.post('/addUpvote', async (req, res) => {
  console.log(req.body)
  const post_id = parseInt(req.body.id)
  console.log("addvote postId: "+post_id)
  await get_likes(post_id).then(numLikes => {
    numLikes += 1;
    increase_like(post_id, numLikes++);
  })
})

app.post('/removeUpvote', async (req, res) => {
  const post_id = parseInt(req.body.id)
  console.log(post_id)
  await get_likes(post_id).then(numLikes => {
    numLikes -= 1;
    increase_like(post_id, numLikes++);
  })
})

app.use((req, res, next) => {
  res.status(404).render('404.pug');
})

app.listen (port , () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`http://127.0.0.1:1738/`);
})