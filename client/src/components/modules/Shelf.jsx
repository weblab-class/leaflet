import React, { useState, useEffect, useContext } from "react";
import SinglePlant from "./SinglePlant.jsx";

import "./Shelf.css";

const Shelf = (props) => {
  return (
    <div className="Shelf-container">
      <SinglePlant url="testplant.jpeg" />
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
      <div className="Shelf-item">hi</div>
    </div>
  );
};

export default Shelf;
