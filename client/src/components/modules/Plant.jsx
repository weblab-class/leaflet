import React from "react";

const Plant = ({ plantType, title }) => {
  return (
    <>
      <img src={`../../../dist/assets/${plantType}`} alt="Plant" className="Plant-image" />
      <p className="Plant-book-title"> {title} </p>
    </>
  );
};

export default Plant;
