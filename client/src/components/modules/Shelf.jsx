import React, { useState, useEffect, useContext } from "react";
import testPlant from "../../assets/plants/testplant.jpeg";

import "./Shelf.css";

const Shelf = (props) => {
  return (
    <div className="Shelf-container">
      <img src={testPlant} alt="Plant image" className="Shelf-item"/>
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
