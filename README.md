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

Level 4 Security

Passwords are salted and hashed with bcrypt.

What is salting? 

The proccess of adding a random character string to a password and then hashing the new string. This makes it much harder for a hashed password to be deciphered because now the salt must be cracked as well.
Why use bcrypt? 

bcrypt hashing is much more complex to perform than a standard hashing algorithm so it will be much harder to brute force hashes.
bcrypt also supports salting rounds which basically increases the amount of times a hashed password is salted and hashed; this exponentially increases the time it would take to crack the hash via brute force.
