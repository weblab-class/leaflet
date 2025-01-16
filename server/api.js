/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/
const slugify = require("slugify");
const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

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

router.get("/allbooks", (req, res) => {
  // get all books
  Book.find({}).then((books) => {
    res.send(books);
  });
});

// router.post("/book", async (req, res) => {
//   try {
//     const { title, author } = req.body;
//     const slug = slugify(title, { lower: true, strict: true }); // Generate slug

//     const newBook = new Book({ title, author, slug });
//     await newBook.save();

//     res.status(201).send(newBook);
//   } catch (error) {
//     res.status(500).send({ error: "An error occurred" });
//   }
// });

// router.get('/book/:slug', async (req, res) => {
//   try {
//     const book = await Book.findOne({ slug: req.params.slug }); // Find by slug
//     if (!book) {
//       return res.status(404).send({ message: 'Book not found' });
//     }
//     res.send(book);
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred' });
//   }
// });

// async function generateUniqueSlug(title) {
//   let slug = slugify(title, { lower: true, strict: true });
//   let count = 0;

//   while (await Book.findOne({ slug })) {
//     count += 1;
//     slug = `${slug}-${count}`;
//   }

//   return slug;
// }

router.get("/book/:title", (req, res) => {
  //need to fix - change URL based on the title, not the title based on the URL
  // Get book by title
  Book.findOne({ title: req.params.title }) // Use req.params.title to get the title from the URL
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
