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
  Book.find({ userId: req.user._id })
    .select("_id title bookType curPage totalPages plantType") // Only include these fields
    .then((books) => {
      res.status(200).json({ message: "Books fetched successfully", books });
    })
    .catch((err) => {
      console.error("Error fetching books:", err);
      res.status(500).json({ message: "Failed to fetch books", error: err });
    });
});

router.post("/updatebook", async (req, res) => {
  console.log("request body: ", req.body);
  const { _id, ...updateData } = req.body; // Destructure _id and the rest of the data
  if (!_id) {
    return res.status(400).send({ error: "_id is required" });
  }
  const book = await Book.findByIdAndUpdate(_id, updateData, { new: true });
  console.log("updated book: ", book);
  res.status(200).send({ message: "Book updated successfully", book });
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Stores file in memory
const axios = require("axios"); // For fetching content from URLs if needed
const pdfParse = require("pdf-parse");

// formData fields: { title, bookType, file, url, curPage, totalPages }
router.post("/createbook", upload.single("file"), async (req, res) => {
  console.log("Creating a book");

  const { title, bookType, url, curPage, totalPages, plantType } = req.body;
  const file = req.file;
  console.log("Extracted fields:", { title, bookType, url, curPage, totalPages, plantType });

  if (!bookType) {
    console.log("Missing required field: bookType");
    return res.status(400).json({ message: "Missing required field: bookType" });
  }

  if (bookType === "upload" && !file) {
    console.log("File is required for bookType 'upload'");
    return res.status(400).json({ message: "File is required for bookType 'upload'" });
  }

  if (bookType === "search" && !url) {
    console.log("URL is required for bookType 'search'");
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
    console.log("Getting book content from url");
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
    console.log("Getting book content from uploaded file");
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

  console.log("newPlant: ", newPlant);
  res.status(201).json({ message: "Book created successfully", newPlant });
});

// Helper function for parsing string into book array:
// Given non-empty string, parse into array of different pages
// MAKE SURE EVEN NUMBER OF PAGES! (Add blank page at end if not even)
// **************** TODO: Format pages nicely? (REGAN)                       //
// ****************       Like, if line contains 'chapter', skip to new page //
function parseBook(contentString) {
  const pageArray = [];
  const chunkSize = 1375; // Desired chunk size
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

// function parseBook(contentString) {
//   const words = contentString.split(/\s+/); // Split by whitespace (spaces, newlines)
//   let pageArray = [];
//   let currentPage = "";
//   let currentLine = "";
//   let lineCount = 0;

//   for (let word of words) {
//     // If adding the word exceeds 60 chars, start a new line
//     if ((currentLine + word).length > 55) {
//       currentPage += currentLine.trim() + "\n"; // Add line to the page
//       currentLine = word; // Start new line with the word
//       lineCount++;

//       // If we've hit 21 lines, start a new page
//       if (lineCount === 21) {
//         pageArray.push(currentPage.trim()); // Store the full page
//         currentPage = "";
//         lineCount = 0;
//       }
//     } else {
//       // Append word to the current line
//       currentLine += (currentLine.length === 0 ? "" : " ") + word;
//     }
//   }

//   // Add the last line if it exists
//   if (currentLine) {
//     currentPage += currentLine.trim() + "\n";
//   }

//   // Add the last page if it has content
//   if (currentPage.trim().length > 0) {
//     pageArray.push(currentPage.trim());
//   }
//   return pageArray;
// }

//=========== DELETING BOOKS ============//
// Delete a book
router.post("/deletebook", (req, res) => {
  Book.findByIdAndDelete(req.body._id).then((deletedBook) => {
    console.log("Deleted book ", req.body);
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
  console.log("Getting page info ");
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
  console.log("Get page range request received with:", { _id, startPage, totalPages, numPages });

  // Validate required fields
  if (!_id || startPage === undefined || totalPages === undefined) {
    console.warn("Missing required fields:", { _id, startPage, totalPages });
    return res
      .status(400)
      .json({ message: "Missing required fields: _id, curPage, or totalPages" });
  }

  // Calculate the range to fetch
  const startIndex = Math.max(startPage, 0);
  console.log("startIndex: ", startIndex);
  const endIndex = Math.min(startPage + numPages, totalPages); // Exclusive
  console.log("endIndex: ", endIndex);
  console.log("Calculated range to fetch:", { startIndex, endIndex });

  // Initialize textArray with blank entries
  const textArray = Array(numPages).fill("");

  // Fetch pages from the database
  console.log("Querying database with _id:", _id);
  const book = await Book.findOne(
    { _id: _id },
    { content: { $slice: [startIndex, endIndex - startIndex] } }
  ).exec();
  const fetchedPages = book?.content || [];

  // Populate the `textArray` based on the fetched pages
  const relativeStart = Math.abs(Math.min(startPage, 0)); // Offset for blank prefix
  console.log("Relative start index in textArray:", relativeStart);
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
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ message: "API route not found" });
});

module.exports = router;
