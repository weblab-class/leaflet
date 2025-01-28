import React, { useState, useEffect, useRef } from "react";
import "./EditPlantPanel.css";

const EditPlantPanel = ({ plant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: plant?.title || "",
    bookType: plant?.bookType || "",
    curPage: plant?.curPage + 1 || 1,
  });

  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        onCancel(); // Close panel if clicked outside
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onCancel]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "curPage" && (value < 1 || isNaN(value))) {
      error = "Current page must be at least 1.";
    } else if (name === "totalPages" && (value < 2 || isNaN(value))) {
      error = "Total pages must be at least 2.";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "curPage" || name === "totalPages" ? Number(value) : value;

    const error = validateField(name, numericValue);
    setErrors((prev) => ({ ...prev, [name]: error }));

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const isFormValid = () => {
    return (
      !errors.curPage && !errors.totalPages && formData.curPage >= 1 && formData.totalPages >= 2
    );
  };

  const handleSave = () => {
    if (isFormValid()) {
      onSave(formData); // Pass updated data to parent
      console.log("Current Page from form: " + formData.curPage);
    }
  };

  return (
    <div className="disable-outside-clicks" ref={overlayRef}>
      <div className="Panel Panel-edit" ref={panelRef}>
        <div className="Panel-content">
          <h3 className="Panel-title">Edit Plant</h3>
          <form className="Panel-form">
            <label>
              Title:
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
            </label>
            <label>
              Current Page:
              <input
                type="number"
                name="curPage"
                value={formData.curPage}
                onChange={handleInputChange}
                min="1"
                max={plant.totalPages}
              />
              {errors.curPage && <div className="warning">{errors.curPage}</div>}
            </label>
          </form>
          <div className="Panel-buttons">
            <button
              type="button"
              className="Panel-button save"
              onClick={handleSave}
              disabled={!isFormValid()} // Disable Save button if form is invalid
            >
              Save
            </button>
            <button type="button" className="Panel-button cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlantPanel;
