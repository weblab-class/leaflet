import React, { useState } from "react";
import "./EditPlantPanel.css";

const AddPlantPanel = ({ onSubmitFunction, onCancelFunction }) => {
  const [titleInput, setTitleInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [latestFileChangeEvent, setLatestFileChangeEvent] = useState(null);

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleFileChange = (event) => {
    console.info("file changing");
    const file = event.target.files[0]; // Get the file from the input
    setFileInput(file); // Update state
    setLatestFileChangeEvent(event);
  };

  function getFileText(fileEvent) {
    return new Promise((resolve, reject) => {
      let file = fileEvent.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        const file_text = e.target.result;
        resolve(file_text);
      };
      reader.readAsText(file);
    });
  }

  const handleSubmit = async (event) => {
    console.info("Submitting form");
    event.preventDefault();
    let file_text = "";
    if (latestFileChangeEvent) {
      file_text = await getFileText(latestFileChangeEvent);
    }
    console.info("file text: ", file_text.substring(0, 50));
    onSubmitFunction({ title: titleInput, content: file_text });
  };

  return (
    <div className="EditPlantPanel">
      <form className="EditPlantPanel-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Add a New Plant</h3>
        <label htmlFor="bookTitle">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          onChange={handleTitleChange}
          value={titleInput}
          placeholder="Enter book title"
        />
        <div className="EditPlantPanel-fileinput">
          {/***************** TODO ****************/
          /* accept other file types */}
          <input
            id="file_upload_input"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            name="files"
          />
        </div>
        {/* file upload div ^ */}
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
