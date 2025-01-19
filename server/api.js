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

router.get("/numberofbooks", (req, res) => {
  Book.findByIdAndDelete(req.book._id).then((deletedBook) => {
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  });
});

router.post("/createbook", (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    // author: req.body.author,
    // currentPage: req.body.currentPage,
    // totalPages: req.body.totalPages,
    // content: req.body.content, // This will be saved in the database but excluded in the response
    plantType: req.body.plantType || "testPlant", // Default to "testPlant" if not provided
    userId: req.user._id,
  });
  const savedBook = newBook.save().then((savedBook) => {
    // Prepare a response object excluding the `content` field
    const plantResponse = {
      _id: savedBook._id,
      title: savedBook.title,
      // author: savedBook.author,
      // currentPage: savedBook.currentPage,
      // totalPages: savedBook.totalPages,
      plantType: savedBook.plantType,
      userId: savedBook.userId,
    };
    console.log("plantResponse plantType: " + plantResponse.plantType);
    res.status(201).json({ message: "Book created successfully", book: plantResponse });
  });
});

// Delete a book
router.post("/deletebook", (req, res) => {
  Book.findByIdAndDelete(req.body._id).then((deletedBook) => {
    // For now, if book not found, return empty
    // if (!deletedBook) {
    //   return res.status(404).json({ error: "Book not found" });
    // }
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  });
});

router.get("/book/:bookID", (req, res) => {
  Book.findById(req.book._id).then((book) => {
    // For now, if book not found, return empty
    // if (!book) {
    //   return res.status(404).send({ message: "Book not found" });
    // }
    res.status(200).json({ message: "Book retrieved successfully", book: book });
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
