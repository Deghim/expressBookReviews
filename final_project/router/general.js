const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
});;

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   if (books) return res.status(200).json(JSON.stringify(books, null, 4));
//   else return res.status(404).send("Unable to locate books");
// })

// Internal endpoint that directly returns the books object
public_users.get("/books", function (req, res) {
  if (books) {
    return res.status(200).json(books);
  } else {
    return res.status(404).send("Unable to locate books");
  }
});

// Task 10: Get book list using async/await with Axios
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:3000/books");

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Unable to locate books" });
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const book = books[req.params.isbn];
//   if (book) return res.status(200).json(book);
//   else return res.status(404).send("Unable to locate book: " + req.params.isbn);
// });
public_users.get("/isbn-direct/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({
      message: "Unable to locate book: " + isbn,
    });
  }
});

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(
      `http://localhost:3000/isbn-direct/${isbn}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Unable to locate book: " + isbn,
    });
  }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   const bookList = Object.entries(books).map(([id, book]) => {
//     return {
//       id: id,
//       author: book.author,
//       title: book.title,
//       reviews: book.reviews,
//     };
//   });
//   const result = bookList.filter((book) => book.author === author);
//   if (result.length > 0) return res.status(200).json(result);
//   else
//     return res
//       .status(404)
//       .send("unable to find " + req.params.author + "'s book(s)");
// });

// Helper route that directly gets books by author
public_users.get("/author-direct/:author", function (req, res) {
  const author = req.params.author;

  const bookList = Object.entries(books).map(([id, book]) => ({
    id,
    author: book.author,
    title: book.title,
    reviews: book.reviews,
  }));

  const result = bookList.filter((book) => book.author === author);

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({
      message: "Unable to find " + author + "'s book(s)",
    });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:3000/author-direct/${encodeURIComponent(author)}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Unable to find " + author + "'s book(s)",
    });
  }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   const bookList = Object.entries(books).map(([id, book]) => {
//     return {
//       id: id,
//       author: book.author,
//       title: book.title,
//       reviews: book.reviews,
//     };
//   });
//   const result = bookList.filter((book) => book.title === title);
//   if (result.length > 0) return res.status(200).json(result);
//   else return res.status(404).send("unable to find " + req.params.title);
// });

// Helper route that directly gets books by title
public_users.get("/title-direct/:title", function (req, res) {
  const title = req.params.title;

  const bookList = Object.entries(books).map(([id, book]) => ({
    id,
    author: book.author,
    title: book.title,
    reviews: book.reviews,
  }));

  const result = bookList.filter((book) => book.title === title);

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({
      message: "Unable to find book with title: " + title,
    });
  }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `http://localhost:3000/title-direct/${encodeURIComponent(title)}`,
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Unable to find book with title: " + title,
    });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  const response = { isbn: req.params.isbn, reviews: book.reviews };
  if (book) return res.status(200).json(response);
  else return res.status(404).send("Unable to locate book: " + req.params.isbn);
});

module.exports.general = public_users;
