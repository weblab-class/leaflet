import React, { useState, useEffect, useContext } from "react";

import "./Shelf.css";

const Shelf = (props) => {
  return (
    <div className="Shelf-container">
      <div className="Shelf-item">
        <img src="../../assets/plants/testplant.jpg" alt="Plant" />
      </div>
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
