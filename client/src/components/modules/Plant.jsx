import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Plant.css";

const Plant = ({ plant, openBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [plantData, setPlantData] = useState(plant);

  // Sync plantData with plant prop when plant changes
  useEffect(() => {
    setPlantData(plant);
    console.log("plantData: ", plantData);
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
    console.log("plantData.plantType: ", plantData.plantType);
    if (plantData.plantType === "addPlantButton") return "/assets/addPlantButton.png";
    if (!plantData.totalPages || plantData.plantType === "default") return "/assets/testPlant.png";
    console.log("not a default plant or button!");
    return (
      "/assets/" +
      plantData.plantType +
      Math.floor((4 * plantData.curPage) / plantData.totalPages).toString() +
      ".png"
    );
  };

  return (
    <div>
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
