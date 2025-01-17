import React from "react";

const Plant = ({ url }) => {
  return <img src={`../../../dist/assets/${url}`} alt="Plant" className="Plant-image" />;
};

export default Plant;
