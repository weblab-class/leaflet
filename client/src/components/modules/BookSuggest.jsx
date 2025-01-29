import React, { useState, useEffect } from "react";
import "./BookSuggest.css";

const fetchSuggestions = (searchTitle, setSuggestions, setLoading, signal) =>
  new Promise((resolve, reject) => {
    if (!searchTitle || !searchTitle.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Time-costly asynchronous function call:
    fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchTitle)}&limit=10`, {
      signal,
    })
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.results)) {
          const bookOptions = data.results
            .map((book) => ({
              title: book.title,
              author: book.authors.map((a) => a.name).join(", "),
              link: book.formats["text/plain; charset=utf-8"] || book.formats["text/plain"],
              cover: book.formats["image/jpeg"] || book.formats["image/png"],
            }))
            .filter((book) => book.link); // Ensure we have a txt link
          setSuggestions(bookOptions);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
        } else {
          console.error("An error occurred while fetching suggestions:", error);
        }
      });
  });

// ============ BOOK SUGGESTION COMPONENT ============ //
// onBookSelect is handleBookSearchSelect from AddPlantPanel.jsx
const BookSuggest = ({ onBookSelect, title }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Trigger upon re-mount
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchSuggestions(title, setSuggestions, setLoading, signal);

    // Cleanup function to abort fetch if the title changes again before the fetch completes
    return () => {
      controller.abort();
    };
  }, [title]);

  const handleSelect = (book) => {
    onBookSelect(book); // Pass the selected book to the parent
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="book-suggest">
      {loading && <div className="loading">Loading...Please allow up to 10 sec</div>}
      {!loading && suggestions.length === 0 && <div className="no-results">No books found</div>}
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

export default BookSuggest;
