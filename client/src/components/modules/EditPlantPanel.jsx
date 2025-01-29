import React, { useState, useEffect, useRef } from "react";
import "./Panel.css";
import { plantTypes } from "./Shelf.jsx";

const EditPlantPanel = ({ plant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: plant?.title || "",
    bookType: plant?.bookType || "",
    curPage: plant?.curPage + 1,
    plantType: plant?.plantType || "Default",
  });

  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  const [selectedPlantType, setSelectedPlantType] = useState(plant?.plantType || "Default");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        onCancel();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onCancel]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "curPage") {
      if (isNaN(value) || value < 1) {
        error = "Current page must be at least 1.";
      } else if (value > plant.totalPages) {
        error = `Page cannot exceed ${plant.totalPages}.`;
      }
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericValue = name === "curPage" && value !== "" ? Number(value) : value;

    const error = validateField(name, numericValue);
    setErrors((prev) => ({ ...prev, [name]: error }));

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handlePlantTypeSelect = (type) => {
    setSelectedPlantType(type.name);
    setFormData((prev) => ({ ...prev, plantType: type.name }));
  };

  const isFormValid = () => {
    return !errors.curPage && formData.curPage >= 1 && formData.curPage <= plant.totalPages;
  };

  const handleSave = () => {
    if (isFormValid()) {
      formData.curPage -= 1;
      if (formData.curPage % 2 == 1) {
        formData.curPage -= 1;
      }
      "formData.curPage: ", formData.curPage;
      onSave(formData);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // Remove focus from the input field
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
              <div className="current-page-container">
                <input
                  type="number"
                  name="curPage"
                  value={formData.curPage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  min="1"
                  max={plant.totalPages}
                />
                <p className="total-pages">/ {plant.totalPages || "N/A"}</p>
              </div>
              {errors.curPage && <div className="warning">{errors.curPage}</div>}
            </label>
            <h3 className="plant-type-header">Change Plant Type:</h3>
            <div className="plant-type-grid">
              {plantTypes.map((plantType) => (
                <div
                  key={plantType.name}
                  className={`plant-type-card ${
                    selectedPlantType === plantType.name ? "selected" : ""
                  }`}
                  onClick={() => handlePlantTypeSelect(plantType)}
                >
                  <img src={plantType.src + "4.png"} alt={plantType.name} />
                  <span>{plantType.name}</span>
                </div>
              ))}
            </div>
          </form>
          <div className="Panel-buttons">
            <button
              type="button"
              className="Panel-button save"
              onClick={handleSave}
              disabled={!isFormValid()}
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
