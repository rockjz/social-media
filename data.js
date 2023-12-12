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

async function createPost(data){
    const username = data.username;
    const content = data.content;
    return await connPool.awaitQuery("INSERT INTO posts (username, content) VALUES (?, ?)", [username, content]);
}

async function getPosts() {
  const posts = await connPool.awaitQuery("SELECT * FROM posts ORDER BY post_id DESC");
  return posts;
}

async function getUser(username) {
  const user = await connPool.awaitQuery(`SELECT * FROM users WHERE username=\"${username}\"`);
  return user;
}

async function createPost(username, content) {
  return await connPool.awaitQuery("INSERT INTO posts (username, content) VALUES (?, ?)", [username, content]);
}

// async function try_login(username, password) {
//   const query = ("select id from user_data where username = ? and password = ?", [username, password])
//   let result = await connPool.awaitQuery(query)
//   return result.length>0;
// }

async function get_likes(postid) {
  const query = await connPool.awaitQuery(`select upvotes from posts where post_id=\"${postid}\"`);
  return query[0].upvotes;
}

async function increase_like(postid, newUpvotes) {
  const query = await connPool.awaitQuery(`update posts set upvotes=\"${newUpvotes}\" where post_id=\"${postid}\"`)
  return query;
}

module.exports = { createPost, getPosts, getUser, createPost, get_likes, increase_like };
