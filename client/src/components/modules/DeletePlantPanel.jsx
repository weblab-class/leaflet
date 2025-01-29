import React, { useEffect, useRef } from "react";
import "./Panel.css";

const DeletePlantPanel = ({ onConfirmDelete, onCancelDelete }) => {
  // ============ MONITOR RENDERING ============ //
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    ("Delete Plant Panel rendering");
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        ("Clicked outside");
        onCancelDelete(); // Trigger cancel function if clicked outside
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div className="disable-outside-clicks" ref={overlayRef}>
      <div className="EditPlantPanel" ref={panelRef}>
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
