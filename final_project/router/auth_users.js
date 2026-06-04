const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "mike",
    password: "1234567890",
  },
];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
