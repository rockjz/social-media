// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost", // this will work
  user: "C4131F23U233",
  database: "C4131F23U233",
  password: "54339", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function create_post(username, content){
  return await connPool.awaitQuery("INSERT INTO posts (username, content) VALUES (?, ?)", [username, content]);
}

async function get_posts(sort) {
  let query = "SELECT * FROM posts ORDER BY post_id DESC"
  if (sort === "likes") {
    query = "SELECT * FROM posts ORDER BY upvotes DESC"
  }
  const posts = await connPool.awaitQuery(query);
  return posts;
}

async function get_user(username) {
  const user = await connPool.awaitQuery(`SELECT * FROM users WHERE username=\"${username}\"`);
  return user;
}

async function create_user(username, password) {
  userExists = false;
  const user = await connPool.awaitQuery(`SELECT * FROM users WHERE username=\"${username}\"`);
  console.log(user)

  // User already exists
  if (user[0]) {
    userExists = true;
  }

  if (userExists) {
    return false;
  }

  const newUser = await connPool.awaitQuery("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
  return newUser;
}

async function createPost(username, content) {
  return await connPool.awaitQuery("INSERT INTO posts (username, content) VALUES (?, ?)", [username, content]);
}

async function get_likes(postid) {
  const query = await connPool.awaitQuery(`select upvotes from posts where post_id=\"${postid}\"`);
  return query[0].upvotes;
}

async function increase_like(postid, newUpvotes) {
  const query = await connPool.awaitQuery(`update posts set upvotes=\"${newUpvotes}\" where post_id=\"${postid}\"`)
  return query;
}

async function edit_post(postid, newMessage) {
  const query = await connPool.awaitQuery(`update posts set content=\"${newMessage}\" where post_id=\"${postid}\"`)
  return query;
}

async function delete_post(postid) {
  const query = await connPool.awaitQuery(`delete from posts where post_id=\"${postid}\"`)
  return query;
}

module.exports = { create_post, get_posts, get_user, create_user, createPost, get_likes, increase_like, edit_post, delete_post };
