create table users (
  username varchar(16) not null,
  password varchar(16) not null,
  primary key(username)
);

create table posts (
  post_id int not null auto_increment,
  username varchar(16) not null,
  content varchar(300) not null,
  upvotes int not null default 0,
  downvotes int not null default 0,
  primary key(post_id),
  foreign key(username) references users(username)
);

-- create table post_likes (
--   post_id int not null,
--   username varchar(16) not null,
--   foreign key(post_id) references posts(post_id)
-- )

INSERT INTO users (username, password) VALUES ("testUser", "testPassword");

INSERT INTO posts (username, content) VALUES ("testUser", "This is some content!", 0, 0);

SELECT upvotes FROM posts WHERE post_id = 10;

UPDATE posts SET upvotes=4 WHERE post_id = 10;

UPDATE posts SET content="hi" WHERE post_id = 10;

DELETE FROM posts WHERE post_id=31;