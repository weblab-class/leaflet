import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Plant.css";
import { plantTypes } from "./Shelf.jsx";

const Plant = ({ plant, openBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [plantData, setPlantData] = useState(plant);

  // Sync plantData with plant prop when plant changes
  useEffect(() => {
    setPlantData(plant);
    // console.log("plantData: ", plantData);
  }, [plant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = async () => {
    setIsEditing(false);
    console.log("Sending plant data:", plantData);
    post("/api/updatebook", plantData);
    console.log("Updated plant data: ", plantData);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  };

  const plantImageSrc = () => {
    if (plantData.plantType === "addPlantButton") {
      return "/assets/addPlantButton.png"; // Special case for "add plant" button
    }
    const stage = Math.min(
      4,
      Math.max(1, Math.ceil((4 * (plantData.curPage + 1)) / plantData.totalPages))
    );
    const plantTypePartialPath = plantTypes.find(
      (plantType) => plantType.name === plantData.plantType
    );
    return plantTypePartialPath.src + stage.toString() + ".png";
  };

  return (
    <div className="Plant-container">
      <img
        src={plantImageSrc()}
        alt="Plant"
        className="Plant-image"
        onClick={() => openBook(plantData)}
      />
      {isEditing ? (
        <input
          type="text"
          name="title"
          value={plantData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className="Plant-book-title-input"
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <p
          className={`Plant-book-title ${!plantData.title ? "hidden-title" : " "}`}
          onClick={() => setIsEditing(true)} // Switch to editing mode on click
        >
          {plantData.title || " "} {/* Use a space to reserve height */}
        </p>
      )}
    </div>
  );
};

export default Plant;
