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

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
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
    return res.status(200).json({
      message: "User successfully logged in",
    });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;
  const username = req.session.authorization.username;

  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const review = req.body.review;

    if (!review) {
      return res.status(400).json({ message: "Review not provided" });
    }

    book.reviews[username] = review;

    return res.status(200).json({
      message: "Review successfully posted",
      reviews: book.reviews,
    });
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;
  const username = req.session.authorization.username;

  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    delete book.reviews[username];

    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: book.reviews,
    });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
