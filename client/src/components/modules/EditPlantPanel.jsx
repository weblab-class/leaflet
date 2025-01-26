import React, { useState, useEffect, useRef } from "react";
import "./EditPlantPanel.css";

const EditPlantPanel = ({ plant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: plant?.title || "",
    bookType: plant?.bookType || "",
    curPage: plant?.curPage || "",
    totalPages: plant?.totalPages || "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData); // Pass updated data to parent
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
              Book Type:
              <select name="bookType" value={formData.bookType} onChange={handleInputChange}>
                <option value="search">Search</option>
                <option value="upload">Upload</option>
                <option value="physical">Physical</option>
              </select>
            </label>
            <label>
              Current Page:
              <input
                type="number"
                name="curPage"
                value={formData.curPage}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Total Pages:
              <input
                type="number"
                name="totalPages"
                value={formData.totalPages}
                onChange={handleInputChange}
              />
            </label>
          </form>
          <div className="Panel-buttons">
            <button type="button" className="Panel-button save" onClick={handleSave}>
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
