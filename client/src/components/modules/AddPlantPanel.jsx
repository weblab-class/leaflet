import React, { useState } from "react";
import "./EditPlantPanel.css";

const AddPlantPanel = ({ onSubmitFunction, onCancelFunction }) => {
  const [titleInput, setTitleInput] = useState("");
  const [fileInput, setFileInput] = useState(null);

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleFileChange = (event) => {
    setFileInput(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitFunction({ title: titleInput, file: fileInput });
  };

  return (
    <div className="EditPlantPanel">
      <form className="EditPlantPanel-form" onSubmit={handleSubmit}>
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
          <input type="file" accept=".txt" onChange={handleFileChange} />
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
