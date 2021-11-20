# User-authentication-site
A simple login web app that allows authenticated users to view secret posts.

Multiple app.js will be posted all with different levels of security.

Leverl 1 Security
User email and password is checked to see if it matches that which is in db.

Level 2 Security
Password is encrypted inside DB so nobody who has access to db can view the password.

Environment Variables
Encryption key is stored inside a .env file so it can't be accessed when shared to github.

Level 3 Security
Hashing function is used for passwords.
