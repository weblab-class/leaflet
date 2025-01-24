import React, { useState } from "react";
import "./BookSearcher.css";

const BookSearcher = ({ onBookSelect }) => {
  const [title, setTitle] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // triggers when user enters/deletes something in search bar
  const handleSearchChange = async (inputChangeEvent) => {
    const titeInput = inputChangeEvent.target.value;
    setTitle(titeInput);

    if (!titeInput) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://gutendex.com/books?search=${title}`);
      const data = await response.json();
      const bookOptions = data.results
        .map((book) => ({
          title: book.title,
          author: book.authors.map((a) => a.name).join(", "),
          link: book.formats["text/plain; charset=utf-8"] || book.formats["text/plain"],
          cover: book.formats["image/jpeg"] || book.formats["image/png"],
        }))
        .filter((book) => book.link); // Ensure we have a txt link
      setSuggestions(bookOptions);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
    setLoading(false);
  };

  const handleSelect = (book) => {
    if (onBookSelect) onBookSelect(book);
    setTitle(book.title);
    setSuggestions([]);
  };

  // triggers when user clicks out of title input field
  const handleBlur = () => {
    setSuggestions([]); // Hide suggestions on blur
  };

  return (
    <div className="book-searcher">
      <label htmlFor="bookTitleInput">Book Title:</label>
      <input
        id="bookTitleInput"
        type="text"
        placeholder="Search for a book..."
        value={title}
        onChange={handleSearchChange}
        onBlur={handleBlur} // Hide suggestions on blur
      />
      {loading && <div className="loading">Loading...</div>}
      <ul className="suggestions">
        {suggestions.map((book, index) => (
          <li key={index} onClick={() => handleSelect(book)} className="book-list-item">
            {book.cover && <img src={book.cover} alt={book.title} className="book-cover" />}
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearcher;
