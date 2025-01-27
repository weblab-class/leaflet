import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Plant.css";

const Plant = ({ plant, openBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [plantData, setPlantData] = useState(plant);

  // Sync plantData with plant prop when plant changes
  useEffect(() => {
    setPlantData(plant);
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

  return (
    <div>
      <img
        src={`../../../assets/${plantData.plantType}.png`}
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
        plantData.title && (
          <p
            className="Plant-book-title"
            onClick={() => setIsEditing(true)} // Switch to editing mode on click
          >
            {plantData.title}
          </p>
        )
      )}
    </div>
  );
};

export default Plant;
