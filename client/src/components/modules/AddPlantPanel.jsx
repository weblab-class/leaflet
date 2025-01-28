import React, { useState, useEffect, useRef } from "react";
// **************** TODO *************** // Custom icons
import { Search } from "lucide-react"; // Use lucide-react for icons

import "./EditPlantPanel.css";
import BookSuggest from "./BookSuggest.jsx";
import { plantTypes } from "./Shelf.jsx";

// parentOnSubmitFunction is submitAddPlant in Shelf.jsx
const AddPlantPanel = ({ parentOnSubmitFunction, onCancelFunction }) => {
  // ============ MONITOR RENDERING ============ //
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  // Handle click outside of the EditPlantPanel to trigger the cancel function
  useEffect(() => {
    console.info("Add Plant Panel rendering");
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        console.log("Clicked outside");
        onCancelFunction();
      } else if (
        bookSuggestionsWrapperRef.current &&
        !bookSuggestionsWrapperRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  // ============ BOOK REPRESENTATION ============ //
  // *Lightweight* (*cough*) frontend representation of Book schema
  const [bookType, setBookType] = useState("physical"); // "search", "upload", "physical"
  const [bookData, setBookData] = useState({
    title: "",
    url: "",
    cover: "",
    file: null,
    curPage: 1,
    totalPages: 10,
    plantType: "Default",
  });

  // ============ BOOK INPUT TYPE SELECT ============ //
  const handleBookTypeChange = (selectedType) => {
    setBookType(selectedType);
    setFileError(false);
  };

  // ============ BOOK TITLE ============ //
  const handleTitleChange = (event) => {
    const newTitle = event.target.value; // Extract the value from the event
    setBookData((prev) => ({ ...prev, title: newTitle }));
    if (newTitle) setTitleError(false);
    setShowSuggestions(false);
  };

  // ============ BOOK SEARCH ============ //
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchedBook, setSearchedBook] = useState(false);
  const searchButtonRef = useRef(null);
  const bookSuggestionsWrapperRef = useRef(null);

  const handleSearchToggle = () => {
    console.info("Search icon clicked, showing suggestions");
    setShowSuggestions(true);
  };

  const handleBookSearchSelect = (book) => {
    console.info("Book selected from search panel");
    setBookData((prev) => ({
      ...prev,
      url: book.link,
      cover: book.cover,
    }));
    setBookType("search");
    console.info("User selected a book, setting suggestions invisible");
    setShowSuggestions(false);
    setSearchedBook(true);
  };

  // triggers when user clicks out of title input field
  const handleBlur = (event) => {
    console.log("User clicked out of suggestion mode");
    if (!searchButtonRef.current || searchButtonRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  // triggers when user hits 'Enter' key
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchButtonRef.current) {
      event.preventDefault();
      event.target.blur();
      searchButtonRef.current.click();
    }
  };

  // ============ BOOK UPLOAD ============ //
  const [fileError, setFileError] = useState(false); // Tracks whether the file error message is displayed
  const [titleError, setTitleError] = useState(false); // Tracks whether the title error message is displayed

  const handleFileChange = (event) => {
    console.info("Different file uploaded");
    setBookData((prev) => ({
      ...prev,
      file: event.target.files[0],
    }));
    setBookType("upload");
    setFileError(false);
  };

  // ============ PHYSICAL BOOK ============ //
  const [pageError, setPageError] = useState(false);

  const handlePhysicalInputChange = (field, value) => {
    setPageError(false);
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  // ============ PLANT TYPE ============ //

  const [selectedPlantType, setSelectedPlantType] = useState("Default");

  const handlePlantTypeSelect = (type) => {
    setSelectedPlantType(type.name);
    setBookData((prev) => ({ ...prev, plantType: type.name }));
  };

  // ============ BOOK SUBMIT ============ //
  const localOnSubmitFunction = async (event) => {
    event.preventDefault();
    console.info("Submitting new book...");

    if (bookType === "upload") {
      if (!bookData.file) {
        console.warn("No file uploaded for 'upload' book type.");
        setFileError(true);
        return;
      } else if (!bookData.title) {
        console.warn("Title empty for 'upload' book type.");
        setTitleError(true);
        return;
      } else {
        console.info("File uploaded:", bookData.file.name);
      }
    }

    if (parseInt(bookData.curPage) > parseInt(bookData.totalPages)) {
      console.warn("Current page exceeds total pages.");
      setPageError(true);
      return;
    } else {
      setPageError(false);
    }

    // Log the submission payload
    console.info("Book data to be submitted:", bookData);
    bookData.curPage -= 1;

    if (bookData.curPage % 2 == 1) {
      bookData.curPage -= 1;
    }

    parentOnSubmitFunction({
      title: bookData.title,
      file: bookData.file,
      url: bookData.url,
      bookType: bookType,
      curPage: bookData.curPage,
      totalPages: bookData.totalPages,
      plantType: bookData.plantType,
    });
  };

  return (
    <div className="disable-outside-clicks" ref={overlayRef}>
      <div className="EditPlantPanel" ref={panelRef}>
        <form
          className="EditPlantPanel-form"
          onSubmit={localOnSubmitFunction}
          encType="multipart/form-data"
        >
          {/****************** BOOK TITLE INPUT ******************/}
          <h3>Add a New Plant</h3>
          <label htmlFor="AddPlantPanel-bookTitleInput">Book Title:</label>
          <div className="bookTitleInput-wrapper">
            <input
              className="bookTitleInput"
              id="AddPlantPanel-bookTitleInput"
              type="text"
              placeholder="Search for a book..."
              value={bookData.title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              style={{ flex: 1 }}
            />
            <button
              className="bookTitleInput-search-icon"
              type="button"
              onClick={handleSearchToggle}
              ref={searchButtonRef}
            >
              <Search size={24} strokeWidth={4} />
            </button>
          </div>
          {/****************** BOOK SEARCH ******************/}
          <div
            className="suggestions-wrapper"
            ref={bookSuggestionsWrapperRef}
            style={{
              display: showSuggestions ? "block" : "none",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <BookSuggest
              onBookSelect={handleBookSearchSelect}
              title={bookData.title}
              style={{
                display: showSuggestions ? "block" : "none",
              }}
            />
          </div>

          {/****************** BOOK TYPE BAR SELECTION ******************/}
          <div className="upload-options">
            {/* GUTENBERG BOOK SEARCH OPTION */}
            <label>
              <input
                type="radio"
                name="bookTypeOption"
                value="search"
                checked={bookType === "search"}
                onChange={() => handleBookTypeChange("search")}
              />
              Use Book from Project Gutenberg
              {bookType === "search" && !bookData.url && (
                <div className="warning">No book selected.</div>
              )}
              {/* Displays selected book */}
              {searchedBook && (
                <div className="selected-book-display">
                  <div className="selected-book-info">
                    {bookData.cover && (
                      <img src={bookData.cover} alt="Book Cover" className="book-cover" />
                    )}
                    <div className="book-details">
                      <strong className="book-details-title">{bookData.title}</strong>
                      {bookData.author && <p className="book-details-author">{bookData.author}</p>}
                    </div>
                  </div>
                </div>
              )}
            </label>

            {/* UPLOAD BOOK OPTION */}
            <label>
              <input
                type="radio"
                name="bookTypeOption"
                value="upload"
                checked={bookType === "upload"}
                onChange={() => handleBookTypeChange("upload")}
              />
              Upload Your Own TXT File
              {bookType === "upload" && (
                <>
                  <input
                    className="upload-button"
                    id="file_upload_input"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    name="files"
                    size="10mb"
                    style={{ display: "block", marginTop: "8px" }}
                  />
                  {/* Display error if no file uploaded */}
                  {fileError && <div className="warning">No file uploaded.</div>}
                  {titleError && <div className="warning">Title not uploaded.</div>}
                </>
              )}
            </label>

            <label>
              {/* PHYSICAL BOOK OPTION */}
              <input
                type="radio"
                name="bookTypeOption"
                value="physical"
                checked={bookType === "physical"}
                onChange={() => handleBookTypeChange("physical")}
              />
              I Have a Physical Book (No Upload)
            </label>
            {bookType === "physical" && (
              <div className="page-input-wrapper">
                <label className="EditPlantPanel-page-label">
                  Current Page:
                  <input
                    className="EditPlantPanel-page-input"
                    type="number"
                    min="1"
                    value={bookData.curPage}
                    onChange={(e) => handlePhysicalInputChange("curPage", e.target.value)}
                  />
                </label>
                <label className="EditPlantPanel-page-label">
                  Total Pages:
                  <input
                    className="EditPlantPanel-page-input"
                    type="number"
                    min="1"
                    value={bookData.totalPages}
                    onChange={(e) => handlePhysicalInputChange("totalPages", e.target.value)}
                  />
                </label>
              </div>
            )}
            {bookType === "physical" && pageError && (
              <div className="warning">Current page cannot be past total pages.</div>
            )}
          </div>
          {/****************** SELECT PLANT TYPE ******************/}
          <h3 className="plant-type-header">Select a Plant Type:</h3>
          <div className="plant-type-grid">
            {plantTypes.map((plant) => (
              <div
                key={plant.name}
                className={`plant-type-card ${selectedPlantType === plant.name ? "selected" : ""}`}
                onClick={() => handlePlantTypeSelect(plant)}
              >
                <img src={plant.src + "4.png"} alt={plant.name} />
                <span>{plant.name}</span>
              </div>
            ))}
          </div>

          {/****************** SUBMIT/CANCEL BUTTONS ******************/}
          <div className="EditPlantPanel-buttons">
            <button type="submit" className="EditPlantPanel-submit">
              Add Plant
            </button>
            <button type="button" className="EditPlantPanel-cancel" onClick={onCancelFunction}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantPanel;
