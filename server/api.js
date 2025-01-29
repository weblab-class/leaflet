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
router.get("/getallbooks", async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from request

    // Fetch books that belong to the user
    let books = await Book.find({ userId }).select(
      "_id title bookType curPage totalPages plantType"
    );

    // Check if this is the user's first time logging in
    const user = await User.findOne({ _id: userId }, { firstTimeLoggingIn: 1 });

    if (user?.firstTimeLoggingIn) {
      // Fetch public books
      const publicBooks = await Book.find({ userId: "public" });

      // Create copies of public books but assign userId = req.user._id
      const copiedBooks = publicBooks.map((book) => ({
        userId, // Assign new userId
        title: book.title,
        bookType: book.bookType,
        curPage: book.curPage,
        totalPages: book.totalPages,
        plantType: book.plantType,
        content: book.content,
      }));

      // Save copied books to the database
      await Book.insertMany(copiedBooks);

      // Fetch the newly added books
      books = [...books, ...copiedBooks];

      // Update user's firstTimeLoggingIn field to false
      await User.updateOne({ _id: userId }, { firstTimeLoggingIn: false });
    }

    res.status(200).json({ message: "Books fetched successfully", books });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err });
  }
});

router.post("/updatebook", async (req, res) => {
  const { _id, ...updateData } = req.body; // Destructure _id and the rest of the data
  if (!_id) {
    return res.status(400).send({ error: "_id is required" });
  }
  const book = await Book.findByIdAndUpdate(_id, updateData, { new: true });
  res.status(200).send({ message: "Book updated successfully", book });
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Stores file in memory
const axios = require("axios"); // For fetching content from URLs if needed
const pdfParse = require("pdf-parse");

// formData fields: { title, bookType, file, url, curPage, totalPages }
router.post("/createbook", upload.single("file"), async (req, res) => {
  const { title, bookType, url, curPage, totalPages, plantType } = req.body;
  const file = req.file;

  if (!bookType) {
    return res.status(400).json({ message: "Missing required field: bookType" });
  }

  if (bookType === "upload" && !file) {
    return res.status(400).json({ message: "File is required for bookType 'upload'" });
  }

  if (bookType === "search" && !url) {
    return res.status(400).json({ message: "URL is required for bookType 'search'" });
  }

  const newBook = new Book({
    userId: req.user._id,
    title,
    bookType,
    curPage: parseInt(curPage, 10) || 0,
    totalPages: parseInt(totalPages, 10) || 10,
    content: [],
    plantType,
  });

  // GET CONTENT IF SEARCHED OR UPLOADED

  // ==== BOOK URL GIVEN ==== //
  if (bookType === "search") {
    // title, bookType, url fields only
    // **************** NEW: NEEDS TESTING/FIXING *************** // (REGAN)
    const response = await axios.get(url); // Fetch content from URL
    const contentString = response.data; // Assume the response contains plain text
    newBook.content = parseBook(contentString);
    newBook.curPage = 0;
    newBook.totalPages = newBook.content.length;
  }

  // ==== BOOK FILE GIVEN ==== //
  else if (bookType === "upload") {
    let contentString = "";

    if (file.mimetype === "text/plain") {
      contentString = file.buffer.toString("utf-8");
    } else if (file.mimetype === "application/pdf") {
      try {
        const pdfData = await pdfParse(file.buffer);
        contentString = pdfData.text;
      } catch (err) {
        console.error("Error extracting text from PDF:", err);
        return res.status(500).json({ message: "Error processing PDF file" });
      }
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    newBook.content = parseBook(contentString);
    newBook.curPage = 0;
    newBook.totalPages = newBook.content.length;
  }

  // ==== NOTHING GIVEN ==== //
  else if (bookType === "physical") {
    // title, bookType, curPage, totalPages fields only
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
    bookType: savedBook.bookType,
  };

  res.status(201).json({ message: "Book created successfully", newPlant });
});

// Helper function for parsing string into book array:
// Given non-empty string, parse into array of different pages
// MAKE SURE EVEN NUMBER OF PAGES! (Add blank page at end if not even)
// **************** TODO: Format pages nicely? (REGAN)                       //
// ****************       Like, if line contains 'chapter', skip to new page //
function parseBook(contentString) {
  const maxLineLength = 50; // Maximum characters per line
  const maxLinesPerPage = 23; // Maximum lines per page
  const words = contentString.split(/\s+/); // Split by whitespace
  let currentLine = "";
  let currentPage = [];
  const pageArray = [];

  words.forEach((word) => {
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      // Add word to the current line
      currentLine += (currentLine.length === 0 ? "" : " ") + word;
    } else {
      // Push the completed line and start a new one
      currentPage.push(currentLine);
      currentLine = word;

      // If the page is full, push it to pageArray
      if (currentPage.length >= maxLinesPerPage) {
        pageArray.push(currentPage.join("\n"));
        currentPage = [];
      }
    }
  });

  // Push the last line
  if (currentLine) currentPage.push(currentLine);

  // Push the last page if not empty
  if (currentPage.length > 0) pageArray.push(currentPage.join("\n"));

  // Ensure an even number of pages by adding a blank page if needed
  if (pageArray.length % 2 !== 0) pageArray.push("");

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

async function getPage(_id, page) {
  const result = await Book.findOne(
    { _id: _id },
    { content: { $slice: [page, 1] } } // Use $slice to fetch one page
  ).exec(); // Ensure to use exec for a promise
  return result?.content?.[0] || ""; // Safely return the first item of content or an empty string
}

router.post("/getpageinfo", async (req, res) => {
  const _id = req.body._id;
  const pageInfo = await Book.findOne({ _id: _id }, { curPage: 1, totalPages: 1 }).exec();
  res.status(200).json({
    message: "Page information retrieved successfully",
    curPage: pageInfo?.curPage || 0,
    totalPages: pageInfo?.totalPages || 10,
  });
});

router.post("/savecurpage", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    { _id: req.body._id },
    { curPage: req.body.curPage },
    { new: true } // return the updated document
  );
  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(updatedBook);
});

router.post("/getpagerange", async (req, res) => {
  let { _id, startPage, totalPages, numPages } = req.body;

  // Log input variables

  // Validate required fields
  if (!_id || startPage === undefined || totalPages === undefined) {
    console.warn("Missing required fields:", { _id, startPage, totalPages });
    return res
      .status(400)
      .json({ message: "Missing required fields: _id, curPage, or totalPages" });
  }

  // Calculate the range to fetch
  const startIndex = Math.max(startPage, 0);
  const endIndex = Math.min(startPage + numPages, totalPages); // Exclusive

  // Initialize textArray with blank entries
  const textArray = Array(numPages).fill("");

  // Fetch pages from the database
  const book = await Book.findOne(
    { _id: _id },
    { content: { $slice: [startIndex, endIndex - startIndex] } }
  ).exec();
  const fetchedPages = book?.content || [];

  // Populate the `textArray` based on the fetched pages
  const relativeStart = Math.abs(Math.min(startPage, 0)); // Offset for blank prefix
  fetchedPages.forEach((page, index) => {
    textArray[relativeStart + index] = page;
  });

  // Send the response
  res.status(200).json({
    message: "Pages retrieved successfully",
    textArray,
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  res.status(404).send({ message: "API route not found" });
});

module.exports = router;
