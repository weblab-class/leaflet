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
    res.status(201).json({ message: "Book created successfully", books: books });
  });
});

//=========== ADDING BOOKS ============//
// **************** TODO *************** //
// Middleware to parse content
// --> get totalpages
// --> split content into string array of pages
// MAKE SURE EVEN NUMBER OF PAGES! (Add blank page at end if not blank)

function parseBook(req, res, next) {
  console.log("parsing the new book");
  console.log("req body content: ", req.body.content.substring(0, 100));
  console.log("req body content length", req.body.content.length);
  if (req.body.content) {
    // console.log(req.body.content);
    pageArray = [];
    charIndex = 0;
    ogIncrement = 200; //change both increments to desired chunk size
    increment = 200;
    while (charIndex < req.body.content.length) {
      if (charIndex + increment > req.body.content.length) {
        pageArray.push(req.body.content.slice(charIndex, req.body.content.length));
        // console.log(pageArray);
      } else {
        while (req.body.content[charIndex + increment] !== " ") {
          charIndex--;
        }
        pageArray.push(req.body.content.slice(charIndex, charIndex + increment));
        // console.log(pageArray);
      }
      charIndex += increment;
      increment = ogIncrement;
    }
    const parsedBookArray = pageArray;
    req.body.content = pageArray;
    req.body.totalPages = pageArray.length;
  }
  next();
}

// **************** NEWLY ADDED *************** //
// Middleware to set default values for book creation request fields
function setDefaultBookFields(req, res, next) {
  req.body.title = req.body.title || ""; // Default to empty string
  req.body.curPage = 0; // Default to 0
  req.body.totalPages = req.body.totalPages || 4; // Default to 2 //Regan TODO
  // **************** TODO *************** //
  // Later set body content default to [] (empty array) for physical books
  req.body.content = req.body.content || ["first page", "second page", "third page", "fourth page"]; // Default content
  req.body.plantType = req.body.plantType || "testPlant"; // Default to "testPlant"
  next();
}

router.post("/createbook", parseBook, setDefaultBookFields, (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    curPage: req.body.curPage,
    totalPages: req.body.totalPages,
    content: req.body.content, // This will be saved in the database but excluded in the response
    plantType: req.body.plantType,
    userId: req.user._id,
  });

  newBook
    .save()
    .then((savedBook) => {
      // Prepare a response plant object excluding the `content` field
      const plantResponse = {
        _id: savedBook._id,
        title: savedBook.title,
        curPage: savedBook.curPage,
        totalPages: savedBook.totalPages,
        plantType: savedBook.plantType,
        userId: savedBook.userId,
      };
      res.status(201).json({ message: "Book created successfully", book: plantResponse });
    })
    .catch((error) => {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Failed to create book", error: error.message });
    });
});

//=========== DELETING BOOKS ============//
// Delete a book
router.post("/deletebook", (req, res) => {
  Book.findByIdAndDelete(req.body._id).then((deletedBook) => {
    res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  });
});

//=========== GETTING PAGES ============//
// **************** TODO *************** //
// Instead of retrieving whole book, get & return specific pages of book
router.post("/spreads", async (req, res) => {
  const bookID = req.body._id;
  const cursor = Book.find({ _id: bookID }, { curPage: 1, totalPages: 1 }).cursor();
  const pageInfo = await cursor.next();
  if (!pageInfo) {
    return res.status(404).json({ message: "Book not found" });
  }
  const curPage = pageInfo.curPage;
  const totalPages = pageInfo.totalPages;
  // use curPage and totalPages to find needed spreads
  const curSpread = (
    await Book.find({ _id: bookID }, { curPage: 0, content: { $slice: [curPage, 2] } })
  )[0].content;
  let prevSpread = [];
  if (curPage > 2) {
    prevSpread = (
      await Book.find({ _id: bookID }, { curPage: 0, content: { $slice: [curPage - 2, 2] } })
    )[0].content;
  }
  let nextSpread = [];
  if (curPage < totalPages - 2) {
    nextSpread = (
      await Book.find({ _id: bookID }, { curPage: 0, content: { $slice: [curPage + 2, 2] } })
    )[0].content;
  }
  res.status(200).json({
    message: "Pages retrieved successfully",
    curPage: curPage,
    totalPages: totalPages,
    prevSpread: prevSpread,
    curSpread: curSpread,
    nextSpread: nextSpread,
  });
});

router.post("/nextspread", async (req, res) => {
  const bookID = req.body._id;
  const curPage = req.body.curPage;
  const totalPages = req.body.totalPages;
  if (curPage >= totalPages - 2) {
    res.status(400).json({ message: "Next spread doesn't exist" });
  }
  const nextSpread = (
    await Book.find({ _id: bookID }, { curPage: 0, content: { $slice: [curPage + 2, 2] } })
  )[0].content;
  Book.updateOne({ _id: bookID }, { $set: { curPage: curPage + 2 } });
  res.status(200).json({ message: "Next spread retrieved successfully", nextSpread });
});

router.post("/prevspread", async (req, res) => {
  const bookID = req.body._id;
  const curPage = req.body.curPage;
  if (curPage <= 2) {
    res.status(400).json({ message: "Previous spread doesn't exist" });
  }
  const prevSpread = (
    await Book.find({ _id: bookID }, { curPage: 0, content: { $slice: [curPage - 2, 2] } })
  )[0].content;
  Book.updateOne({ _id: bookID }, { $set: { curPage: curPage - 2 } });
  res.status(200).json({ message: "Previous spread retrieved successfully", prevSpread });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ message: "API route not found" });
});

module.exports = router;
