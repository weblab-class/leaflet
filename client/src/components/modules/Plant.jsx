import React from "react";

const Plant = ({ plantType, title }) => {
  console.log("hahaha plantType: " + plantType.toString());
  return (
    <>
      <img src={`../../../dist/assets/${plantType}.jpg`} alt="Plant" className="Plant-image" />
      <p className="Plant-book-title"> {title} </p>
    </>
  );
};

export default Plant;
