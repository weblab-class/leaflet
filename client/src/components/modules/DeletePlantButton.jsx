import React from "react";
import "./DeletePlantButton.css";

const DeletePlantButton = ({ onDelete }) => {
  return (
    <button className="DeletePlantButton" onClick={onDelete}>
      X
    </button>
  );
};

export default DeletePlantButton;
