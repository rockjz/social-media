To Run:

GRADERS - DATABASE INFORMATION CAN BE FOUND IN THE databaseinfo.md FILE

$ node tunnel.js
  - Create a tunnel using a UMN account

$ node server.js
  - Start the server

The website is available at:

  http://127.0.0.1:1738/

and should be accessible by command clicking the link that appears in the terminal.

Features implemented:

  - Users can create short text posts (300 characters max)

  - Text posts can be viewed in reverse temporal order OR by most likes

  - Text posts are paginated and limited to 5 per page

  - Text posts can be edited and deleted

  - Text posts can be "liked" and maintain a "like count"

  - Account creation

  - Logged-in vs. not-logged-in status is tracked

  - Login and logout features (plaintext passwords)

  - Posts are associated with specific user, only the associated user can edit or
      delete a given post