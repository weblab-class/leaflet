import React from "react";
import "./Plant.css";
// title: String
// plantType: String
// curPage: Number
// totalPages: Number
// **************** TODO *************** //
// On hover, show reading progress in bars to the right of the plant image
const Plant = ({ title, plantType }) => {
  if (!plantType) {
    console.error("plantType not provided, default to testPlant");
    plantType = "testPlant";
  }
  console.info("Rendering a plant with plantType " + plantType);
  return (
    <>
      <img src={`../../../assets/${plantType}.png`} alt="Plant" className="Plant-image" />
      <p className="Plant-book-title"> {title} </p>
    </>
  );
};

export default Plant;
