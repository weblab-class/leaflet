import React, { useState } from "react";
import "./EditPlantPanel.css";
import BookSearcher from "./BookSearcher.jsx";

// parentOnSubmitFunction is submitAddPlant in Shelf.jsx
const AddPlantPanel = ({ parentOnSubmitFunction, onCancelFunction }) => {
  // ============ BOOK REPRESENTATION ============ //

  // *Lightweight* (*cough*) frontend representation of Book schema
  const [bookType, setBookType] = useState("physical"); // "search", "upload", "physical"
  const [bookData, setBookData] = useState({
    title: "",
    url: "",
    cover: "",
    file: null,
    currentPage: 0,
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

  // ============ BOOK SEARCH ============ //
  const handleBookSearchSelect = (book) => {
    setBookData((prev) => ({
      ...prev,
      title: book.title,
      url: book.link,
      cover: book.cover,
    }));
    setBookType("search");
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

  const handleTitleChange = (newTitle) => {
    setBookData((prev) => ({ ...prev, title: newTitle }));
    if (titleError) setTitleError(false);
  };

  // function getTextFromFile(fileEvent) {
  //   return new Promise((resolve, reject) => {
  //     const file = fileEvent.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (e) => resolve(e.target.result);
  //     reader.onerror = reject;
  //     reader.readAsText(file);
  //   });
  // }

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
      if (!bookData.currentPage || !bookData.totalPages) {
        console.warn("Missing required fields for 'physical' book type:", {
          currentPage: bookData.currentPage,
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
    console.info("Book data to be submitted:", {
      title: bookData.title,
      file: bookData.file,
      url: bookData.url,
      bookType: bookType,
      currentPage: bookData.currentPage,
      totalPages: bookData.totalPages,
    });

    parentOnSubmitFunction({
      title: bookData.title,
      file: bookData.file,
      url: bookData.url,
      bookType: bookType,
      currentPage: bookData.currentPage - 1,
      totalPages: bookData.totalPages,
    });
  };

  return (
    <div className="disable-outside-clicks">
      <div className="EditPlantPanel">
        <form
          className="EditPlantPanel-form"
          onSubmit={localOnSubmitFunction}
          encType="multipart/form-data"
        >
          <h3>Add a New Plant</h3>

          {/****************** BOOK SEARCH/TITLE INPUT ******************/}
          <BookSearcher onBookSelect={handleBookSearchSelect} onTitleChange={handleTitleChange} />

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
                <span className="warning">No book selected.</span>
              )}
              {/* Displays selected book */}
              <div className="selected-book-display">
                {bookData.title && (
                  <div className="selected-book-info">
                    <img src={bookData.cover} alt={bookData.title} className="book-cover" />
                    <div className="book-details">
                      <strong>{bookData.title}</strong>
                      <p>{bookData.author}</p>
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
                  {fileError && <span className="warning">No file uploaded.</span>}
                  {titleError && <span className="warning">Title not uploaded.</span>}
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
              <>
                <div style={{ marginTop: "8px" }}>
                  <label className="EditPlantPanel-page-input">
                    Current Page:
                    <input
                      type="number"
                      min="1"
                      value={bookData.currentPage}
                      onChange={(e) => handlePhysicalInputChange("currentPage", e.target.value)}
                    />
                  </label>
                  <label className="EditPlantPanel-page-input">
                    Total Pages:
                    <input
                      type="number"
                      min="1"
                      value={bookData.totalPages}
                      onChange={(e) => handlePhysicalInputChange("totalPages", e.target.value)}
                    />
                  </label>
                </div>
                {physicalBookError && <span className="warning">Please fill in both fields.</span>}
              </>
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
