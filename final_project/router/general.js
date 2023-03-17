const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // console.log(req.body)
  const username = req.body.username
  const password = req.body.password
  // const { username, password } = req.body;
  // console.log(req)
  // console.log(users)

  if (username && password){
    if (isValid(username)){
      users.push({"username": username, "password": password})
      return res.status(200).json({message: `${username} has been registered`})
    } else {
      return res.status(400).json({message: "Already exists"})
    }
  } else {
    return res.status(404).json({message: "User registration failed"});
  }

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]

  if (book){
    return res.json(book);
  } else {
    return res.status(404).json({message: "Book with that ISBN does not exist"})
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author
  const books_with_author = []
  // console.log(author)
  // console.log(books)
  for (const isbn in books){
    const book = books[isbn]
    // console.log(book)
    const currAuthor = book.author
    // console.log(currAuthor)
    if (currAuthor.includes(author)){
      books_with_author.push(book)
    }
  }

  if (books_with_author.length > 0){
    return res.json(books_with_author)
  } else {
    return res.status(404).json({message: "No books with that author"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title
  const books_with_title = []

  for (const isbn in books){
    const book = books[isbn]
    const currTitle = book.title
    if (currTitle.includes(title)){
      books_with_title.push(book)
    }
  }

  if (books_with_title.length > 0){
    return res.json(books_with_title)
  } else {
    return res.status(404).json({message: "No books with that title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]

  if (book){
    return res.json(book.reviews);
  } else {
    return res.status(404).json({message: "Book with that ISBN does not exist"})
  }
});

module.exports.general = public_users;
