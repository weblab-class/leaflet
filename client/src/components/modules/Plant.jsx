import React from "react";
import "./Plant.css";
const Plant = ({ plantType, title }) => {
  console.log("Rendering a plant with plantType " + plantType.toString());
  return (
    <>
      <img src={`../../../dist/assets/${plantType}.jpg`} alt="Plant" className="Plant-image" />
      <p className="Plant-book-title"> {title} </p>
    </>
  );
};

export default Plant;
