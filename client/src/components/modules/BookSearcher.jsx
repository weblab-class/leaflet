import React, { useState, useEffect, useCallback } from "react";
import "./BookSearcher.css";

// onBookSelect is handleBookSearchSelect from AddPlantPanel.jsx
const BookSearcher = ({ onBookSelect, title }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books directly without debouncing
  const fetchBooks = useCallback(async (searchTitle) => {
    if (!searchTitle.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    console.log("Loading book results");
    try {
      console.debug("Searhing for book titled ", searchTitle);
      const response = await fetch(
        `https://gutendex.com/books?search=${encodeURIComponent(searchTitle)}`
      );
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
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger the search when the title changes
  useEffect(() => {
    fetchBooks(title);
  }, [title, fetchBooks]);

  // Handle book selection
  const handleSelect = (book) => {
    console.info("Sending selected book");
    onBookSelect(book); // Pass the selected book to the parent
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="book-searcher">
      {loading && <div className="loading">Loading...</div>}
      <ul className="suggestions">
        {suggestions.map((book, index) => (
          <li key={index} onClick={() => handleSelect(book)} className="book-list-item">
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearcher;
