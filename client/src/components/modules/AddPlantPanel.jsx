import React, { useState } from "react";
import "./AddPlantPanel.css";

const AddPlantPanel = ({ onSubmitFunction, onCancelFunction }) => {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitFunction(input);
  };

  return (
    <div className="AddPlantPanel">
      <form className="AddPlantPanel-form" onSubmit={handleSubmit}>
        <h3>Add a New Plant</h3>
        <label htmlFor="bookTitle">Book Title:</label>
        <input
          type="text"
          id="bookTitle"
          onChange={handleChange}
          value={input}
          placeholder="Enter book title"
          required
        />
        <div className="AddPlantPanel-buttons">
          <button type="submit" className="AddPlantPanel-submit">
            Add Plant
          </button>
          <button type="button" className="AddPlantPanel-cancel" onClick={onCancelFunction}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlantPanel;
