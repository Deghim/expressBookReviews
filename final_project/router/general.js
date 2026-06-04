const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) return res.status(200).json(JSON.stringify(books, null, 4));
  else return res.status(404).send("Unable to locate books");
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).send("Unable to locate book: " + req.params.isbn);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookList = Object.entries(books).map(([id, book]) => {
    return {
      id: id,
      author: book.author,
      title: book.title,
      reviews: book.reviews,
    };
  });
  const result = bookList.filter((book) => book.author === author);
  if (result.length > 0) return res.status(200).json(result);
  else
    return res
      .status(404)
      .send("unable to find " + req.params.author + "'s book(s)");
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookList = Object.entries(books).map(([id, book]) => {
    return {
      id: id,
      author: book.author,
      title: book.title,
      reviews: book.reviews,
    };
  });
  const result = bookList.filter((book) => book.title === title);
  if (result.length > 0) return res.status(200).json(result);
  else return res.status(404).send("unable to find " + req.params.title);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  const response = { isbn: req.params.isbn, reviews: book.reviews };
  if (book) return res.status(200).json(response);
  else return res.status(404).send("Unable to locate book: " + req.params.isbn);
});

module.exports.general = public_users;
