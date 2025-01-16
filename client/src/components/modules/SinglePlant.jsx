import React from "react";

const SinglePlant = (props) => {
  return (
  <img src={`../../../dist/assets/${props.url}`} className="Plant-image" />
  );
};

export default SinglePlant;
