import React, { useState } from "react";
import "./EditPlantPanel.css";
import BookSearcher from "./BookSearcher.jsx";

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

  const [latestFileChangeEvent, setLatestFileChangeEvent] = useState(null);
  const [fileError, setFileError] = useState(false); // Tracks whether the file error message is displayed

  const handleFileChange = (event) => {
    setLatestFileChangeEvent(event);
    setBookType("upload");
    setFileError(false);
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
    // let file_text = "";
    if (bookType === "upload") {
      if (!latestFileChangeEvent) {
        // Don't submit, let 'no file uploaded' span pop up
        setFileError(true);
        return;
      } else {
        setBookData((prev) => ({
          ...prev,
          file: latestFileChangeEvent.target.files[0],
        }));
        // file_text = await getTextFromFile(latestFileChangeEvent);
      }
    } else if (bookType === "physical" && (!bookData.currentPage || !bookData.totalPages)) {
      setPhysicalBookError(true);
      return;
    }
    // pass data back to parent --> Shelf.jsx submitAddPlant
    parentOnSubmitFunction({
      title: bookData.title,
      file: bookData.file,
      url: bookData.url,
      bookType: bookType,
      // account for array style
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
          <BookSearcher onBookSelect={handleBookSearchSelect} />

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
                  <label>
                    Current Page:
                    <input
                      type="number"
                      min="1"
                      value={bookData.currentPage}
                      onChange={(e) => handlePhysicalInputChange("currentPage", e.target.value)}
                    />
                  </label>
                  <label>
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
            <button
              type="submit"
              className="EditPlantPanel-submit"
              disabled={
                (bookType === "upload" && !latestFileChangeEvent) ||
                (bookType === "physical" && (!bookData.currentPage || !bookData.totalPages))
              }
            >
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
