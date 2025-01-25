import React, { useState, useEffect, useRef } from "react";
// **************** TODO *************** // Custom icons
import { Search } from "lucide-react"; // Use lucide-react for icons

import "./EditPlantPanel.css";
import Booksuggest from "./BookSuggest.jsx";

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
        onCancelFunction(); // Trigger cancel function if clicked outside
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
    curPage: 0,
    totalPages: 0,
  });

  // ============ BOOK INPUT TYPE SELECT ============ //
  const handleBookTypeChange = (selectedType) => {
    setBookType(selectedType);
    setFileError(false);
    setPhysicalBookError(false);
    if (selectedType === "upload") {
      setBookData({ url: "" });
    }
    if (selectedType === "physical") {
      setBookData({ url: "", file: null });
    }
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
  const searchButtonRef = useRef(null);

  const handleSearchToggle = () => {
    setShowSuggestions(true);
  };

  const handleBookSearchSelect = (book) => {
    console.info("Book selected from search panel");
    setBookData((prev) => ({
      ...prev,
      title: book.title,
      url: book.link,
      cover: book.cover,
    }));
    setBookType("search");
    setShowSuggestions(false);
  };

  // triggers when user clicks out of title input field
  const handleBlur = () => {
    console.log("User clicked out of suggestion mode");
    setShowSuggestions(false);
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
  const [physicalBookError, setPhysicalBookError] = useState(false); // Tracks whether physical book fields are missing

  const handlePhysicalInputChange = (field, value) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
    setPhysicalBookError(false);
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
    } else if (bookType === "physical") {
      if (!bookData.curPage || !bookData.totalPages) {
        console.warn("Missing required fields for 'physical' book type:", {
          curPage: bookData.curPage,
          totalPages: bookData.totalPages,
        });
        setPhysicalBookError(true);
        return;
      }
    }

    if (!bookData.title || !bookType) {
      console.error("Missing required fields 'title' or 'bookType'.");
      return;
    }

    // Log the submission payload
    console.info("Book data to be submitted:", bookData);

    parentOnSubmitFunction({
      title: bookData.title,
      file: bookData.file,
      url: bookData.url,
      bookType: bookType,
      curPage: bookData.curPage - 1,
      totalPages: bookData.totalPages,
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
              <Search size={24} />
            </button>
          </div>
          {/****************** BOOK SEARCH ******************/}
          <Booksuggest
            onBookSelect={handleBookSearchSelect}
            title={bookData.title}
            isVisible={showSuggestions}
          />

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
              <div className="selected-book-display">
                {bookData.title && (
                  <div className="selected-book-info">
                    {bookData.cover && (
                      <img src={bookData.cover} alt="Book Cover" className="book-cover" />
                    )}
                    <div className="book-details">
                      <strong>{bookData.title}</strong>
                      {bookData.author && <p>{bookData.author}</p>}
                    </div>
                  </div>
                )}
              </div>
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
              <div>
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

                {physicalBookError && <div className="warning">Please fill in both fields.</div>}
              </div>
            )}
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
