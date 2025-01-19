/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Book = require("./models/book");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// Get all books belonging to a user
router.get("/getallbooks", (req, res) => {
  Book.find({ userId: req.user._id }).then((books) => {
    res.send(books);
  });
});

router.post("/createbook", (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      // author: req.body.author,
      // currentPage: req.body.currentPage,
      // totalPages: req.body.totalPages,
      // content: req.body.content,

      // **************** TODO *************** //
      // Choose a random plant image
      plantType: req.body.plantType,
      userId: req.user._id,
    });
    // Save the book to the database
    const savedBook = newBook.save();
    res.status(201).json({ message: "Book created successfully", book: savedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to create book", details: error.message });
  }
});

// **************** TODO *************** //
// Delete a book
router.post("/deletebook", (req, res) => {
  // Delete the book from the database
  Book.findByIdAndDelete(req.body.bookID).then((deletedBook) => {
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  });
});

// **************** TODO *************** //
// Get a single book based off its unique ID (Regan, later)

router.get("/book/:bookID", (req, res) => {
  // Get book by bookID
  Book.findOne({ bookID: req.params.bookID })
    .then((book) => {
      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }
      res.send(book);
    })
    .catch((error) => {
      res.status(500).send({ error: "An error occurred" });
    });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
