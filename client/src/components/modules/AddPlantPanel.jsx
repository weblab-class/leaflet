import React, { useState } from "react";
import "./EditPlantPanel.css";

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
    <div className="EditPlantPanel">
      <form className="EditPlantPanel-form" onSubmit={handleSubmit}>
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
