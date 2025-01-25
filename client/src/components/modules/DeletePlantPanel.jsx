import React from "react";
import "./EditPlantPanel.css";

const DeletePlantPanel = ({ onConfirmDelete, onCancelDelete }) => {
  return (
    <div className="disable-outside-clicks">
      <div className="EditPlantPanel">
        <div className="EditPlantPanel-content">
          <h3>Are you sure you want to delete this plant?</h3>
          <div className="EditPlantPanel-buttons">
            <button type="button" className="EditPlantPanel-delete" onClick={onConfirmDelete}>
              Delete
            </button>
            <button type="button" className="EditPlantPanel-cancel" onClick={onCancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePlantPanel;
