import React, { useState, useEffect } from "react";
import Plant from "./Plant.jsx";
import "./Shelf.css";

const Shelf = () => {
  const [plants, setPlants] = useState([]);
  const testPlantImageUrl = "testPlant.jpg";
  const addPlantButtonUrl = "addPlantButton.jpg";

  // Initialize hardcoded plants
  useEffect(() => {
    const hardcodedPlants = [
      { url: testPlantImageUrl },
      { url: testPlantImageUrl },
      { url: testPlantImageUrl },
    ];
    setPlants(hardcodedPlants);
  }, []);

  const addPlant = () => {
    console.log("add new plant function called on");
    //
    // setPlants((prevPlants) => [...prevPlants, plant]);
  };

  const generateShelfItems = (numVisibleShelfItems) => {
    const shelfItems = [];

    for (let i = 0; i < numVisibleShelfItems; i++) {
      if (i < plants.length) {
        shelfItems.push(
          <div className="Shelf-item" key={`shelf-item-${i}`}>
            <Plant url={testPlantImageUrl} />
          </div>
        );
      } else if (i == plants.length) {
        shelfItems.push(
          <div className="Shelf-item" onClick={addPlant} key={`shelf-item-${i}`}>
            <Plant url={addPlantButtonUrl} />
          </div>
        );
      } else {
        shelfItems.push(<div className="Shelf-item" key={`shelf-item-${i}`}></div>);
      }
    }
    return shelfItems;
  };

  return <div className="Shelf-container">{generateShelfItems(9)}</div>;
};

export default Shelf;
