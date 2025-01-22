import React, { useState } from "react";
import "./EditPlantPanel.css";
import BookSearcher from "./BookSearcher.jsx";

const AddPlantPanel = ({ onSubmitFunction, onCancelFunction }) => {
  const [titleInput, setTitleInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [latestFileChangeEvent, setLatestFileChangeEvent] = useState(null);
  const [selectedOption, setSelectedOption] = useState("none"); // "gutenberg", "upload", "none"
  const [bookData, setBookData] = useState({
    title: "",
    contentURL: "",
    cover: "",
    uploadedFile: null,
  });

  const handleTitleChange = (event) => {
    const value = event.target.value;
    setTitleInput(value);
    setBookData((prev) => ({ ...prev, title: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the file from the input
    setFileInput(file); // Update state
    setLatestFileChangeEvent(event);
    setBookData((prev) => ({ ...prev, uploadedFile: file, contentURL: "" }));
    setSelectedOption("upload");
  };

  function getFileText(fileEvent) {
    return new Promise((resolve, reject) => {
      const file = fileEvent.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let file_text = "";
    if (latestFileChangeEvent) {
      file_text = await getFileText(latestFileChangeEvent);
    }
    onSubmitFunction({
      title: titleInput,
      content: selectedOption === "upload" ? file_text : null,
      contentURL: selectedOption === "gutenberg" ? bookData.contentURL : "",
      uploadOption: selectedOption,
    });
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === "none") {
      setBookData({ title: "", contentURL: "", uploadedFile: null });
    }
  };

  const handleBookSelect = (book) => {
    setBookData((prev) => ({
      ...prev,
      title: book.title,
      contentURL: book.link,
      cover: book.cover,
    }));
    setTitleInput(book.title); // Sync with title input
    setSelectedOption("gutenberg");
  };

  return (
    <div className="EditPlantPanel">
      <form className="EditPlantPanel-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Add a New Plant</h3>
        <label htmlFor="bookTitle">Book Title:</label>
        <BookSearcher onBookSelect={handleBookSelect} initialValue={titleInput} />
        <div className="selected-book-display">
          {bookData.title && (
            <div className="selected-book-info">
              <img
                src={bookData.cover || "https://via.placeholder.com/80"}
                alt={bookData.title}
                className="book-cover"
              />
              <div className="book-details">
                <strong>{bookData.title}</strong>
                <p>{bookData.author}</p>
              </div>
            </div>
          )}
        </div>
        <div className="upload-options">
          <label>
            <input
              type="radio"
              name="uploadOption"
              value="gutenberg"
              checked={selectedOption === "gutenberg"}
              onChange={() => handleOptionChange("gutenberg")}
            />
            Use Project Gutenberg Book
            {selectedOption === "gutenberg" && !bookData.contentURL && (
              <span className="warning">No book selected.</span>
            )}
          </label>
          <label>
            <input
              type="radio"
              name="uploadOption"
              value="upload"
              checked={selectedOption === "upload"}
              onChange={() => handleOptionChange("upload")}
            />
            Upload Your Own TXT File
            {selectedOption === "upload" && (
              <input
                id="file_upload_input"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                name="files"
                style={{ display: "block", marginTop: "8px" }}
              />
            )}
          </label>
          <label>
            <input
              type="radio"
              name="uploadOption"
              value="none"
              checked={selectedOption === "none"}
              onChange={() => handleOptionChange("none")}
            />
            I Have a Physical Book (No Upload)
          </label>
        </div>
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
  );
};

export default AddPlantPanel;
