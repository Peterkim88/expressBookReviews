const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {username: "peterkim", password: "testtest"}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// console.log("this is the isValid users")
// console.log(users)
  const matches = users.filter((user) => {
    user.username === username
  })
  if (matches.length > 0){
    return false
  }
  return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // console.log(users)
  for (const user of users){
    // console.log(user)
    if (user.username === username && user.password === password){
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // console.log(req.body)
  // console.log(users)
  const username = req.body.username
  const password = req.body.password
  // console.log(username)
  // console.log(password)

  if (!username || !password){
    return res.status(400).json({message: "Please enter a Username and Password"})
  }

  if (authenticatedUser(username, password)){

    let token = jwt.sign({
      data: password
    }, "access", { expiresIn: 60 * 60 })

    req.session.authorization = { token, username };

    return res.json({message: "Login is successful"})

  } else {

    return res.status(404).json({message: "Login Credentials Are Incorrect"})
  
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review
  const isbn = req.params.isbn

  const username = req.session.authorization['username']

  let book = books[isbn]
  book.reviews[username] = review

  return res.json({message: "Review Submitted"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization['username']
  
  if (books[isbn]){

    let book = books[isbn]
    delete book.reviews[username]
    return res.status(200).send({message: "Review Deleted"})

  } else {

    return res.status(404).json({message: "ISBN or Review Does Not Exist"})

  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
