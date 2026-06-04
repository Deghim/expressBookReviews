const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "mike",
    password: "1234567890",
  },
  { username: "john", password: "1234567890" },
];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!password)
    return res.status(400).json({ message: "password not provided" });
  if (!username)
    return res.status(400).json({ message: "username not provided" });

  const existingUser = users.find((user) => user.username === username);
  if (existingUser)
    return res.status(400).json({ message: "username already taken" });

  users.push({ username: username, password: password });
  return res.status(200).send("user added successfuly");
});
//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 },
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res, next) => {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    // Verify JWT token
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        // next(); // Proceed to the next middleware
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
  const book = books[req.params.isbn];
  const username = req.session.authorization.username;
  const review = req.body.review;
  books.reviews[username] = review;

  return res.status(200).send(`${username}'s review of ${book.title} `);
});

regd_users.delete("/auth/review/:isbn", (req, res, next) => {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    // Verify JWT token
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        // next(); // Proceed to the next middleware
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
  const username = req.session.authorization.username;
  delete books[req.params.isbn].reviews[username] 

  return res.status(200).send(`${username}'s review of ${books[req.params.isbn].title} deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
