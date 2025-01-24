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

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Stores file in memory
const axios = require("axios"); // For fetching content from URLs if needed

// formData fields: { title, bookType, file, url, currentPage, totalPages }
router.post("/createbook", upload.single("file"), async (req, res) => {
  console.log("Creating a book");
  if (!title || !bookType) {
    return res.status(400).json({ message: "Missing required fields: title or bookType" });
  }

  if (bookType === "upload" && !req.file) {
    return res.status(400).json({ message: "File is required for bookType 'upload'" });
  }

  if (bookType === "search" && !url) {
    return res.status(400).json({ message: "URL is required for bookType 'search'" });
  }

  const { title, bookType, url, currentPage, totalPages } = req.body;
  console.log("Extracted fields:", { title, bookType, url, currentPage, totalPages });
  const file = req.file;
  if (file) {
    console.log("Uploaded file:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
  }
  const newBook = new Book({
    userId: req.user._id,
    title,
    bookType,
    currentPage: parseInt(currentPage, 10) || 0,
    totalPages: parseInt(totalPages, 10) || 0,
    content: [],
  });

  // GET CONTENT IF SEARCHED OR UPLOADED

  // ==== BOOK URL GIVEN ==== //
  if (bookType === "search") {
    // title, bookType, url fields only
    // **************** NEW: NEEDS TESTING/FIXING *************** // (REGAN)
    if (!url) {
      return res.status(400).json({ message: "URL is required for bookType 'search'" });
    }
    try {
      const response = await axios.get(url); // Fetch content from URL
      const contentString = response.data; // Assume the response contains plain text
      newBook.content = parseBook(contentString); // Convert to an array of pages
    } catch (error) {
      console.error("Error fetching content from URL:", error);
      return res.status(500).json({ message: "Failed to fetch book content from URL" });
    }
  }

  // ==== BOOK FILE GIVEN ==== //
  else if (bookType === "upload") {
    // title, bookType, file fields only
    // **************** NEW: NEEDS TESTING/FIXING *************** // (REGAN)
    if (!file) {
      return res.status(400).json({ message: "File is required for bookType 'upload'" });
    }
    try {
      const contentString = file.buffer.toString("utf-8"); // Convert file buffer to a string
      newBook.content = parseBook(contentString); // Convert to an array of pages
    } catch (error) {
      console.error("Error processing uploaded file:", error);
      return res.status(500).json({ message: "Failed to process uploaded file" });
    }
  }

  // ==== NOTHING GIVEN ==== //
  else if (bookType === "physical") {
    // title, bookType, currentPage, totalPages fields only
    // nothing left to do
  }
  const savedBook = await newBook.save();
  const newPlant = {
    userId: savedBook.userId,
    _id: savedBook._id,
    title: savedBook.title,
    curPage: savedBook.curPage,
    totalPages: savedBook.totalPages,
    plantType: savedBook.plantType,
  };
  res.status(201).json({ message: "Book created successfully", newPlant });
});

// Helper function for parsing string into book array:
// Given non-empty string, parse into array of different pages
// MAKE SURE EVEN NUMBER OF PAGES! (Add blank page at end if not even)
// **************** TODO: Format pages nicely? (REGAN)                       //
// ****************       Like, if line contains 'chapter', skip to new page //
function parseBook(contentString) {
  const pageArray = [];
  const chunkSize = 1000; // Desired chunk size
  let charIndex = 0;

  while (charIndex < contentString.length) {
    let endIndex = charIndex + chunkSize;
    // Ensure we don't exceed the content length
    if (endIndex > contentString.length) {
      endIndex = contentString.length;
    } else {
      // Find the nearest space before the chunk ends
      while (endIndex > charIndex && contentString[endIndex] !== " ") {
        endIndex--;
      }
      // If no space is found, just break at chunkSize
      if (endIndex === charIndex) {
        endIndex = charIndex + chunkSize;
      }
    }
    // Add the chunk to the page array
    pageArray.push(contentString.slice(charIndex, endIndex).trim());
    charIndex = endIndex;
  }
  // Ensure an even number of pages by adding a blank page if needed
  if (pageArray.length % 2 !== 0) {
    pageArray.push("");
  }
  return pageArray;
}

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

  if (curPage < 2) {
    return res.status(400).json({ message: "Previous spread doesn't exist" });
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
