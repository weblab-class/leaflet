import React, { useState, useEffect } from "react";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import "./Shelf.css";

const Shelf = () => {
  const [plants, setPlants] = useState([]);
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);
  const testPlant = "testPlant.jpg";
  const defaultTitle = "Default Title";
  const addPlantButton = "addPlantButton.jpg";

  // Initialize hardcoded plants
  useEffect(() => {
    const hardcodedPlants = [
      { plantType: testPlant, title: defaultTitle },
      { plantType: testPlant, title: defaultTitle },
      { plantType: testPlant, title: defaultTitle },
    ];
    setPlants(hardcodedPlants);
  }, []);

  const addPlant = () => {
    setShowAddPlantPanel(true);
  };

  const cancelAddPlant = () => {
    setShowAddPlantPanel(false);
  };

  const addPlantOnSubmit = (title) => {
    if (title) {
      const newPlant = { plantType: testPlant, title: title };
      setPlants((prevPlants) => [...prevPlants, newPlant]);
    }
    setShowAddPlantPanel(false);
  };

  const generateShelfItems = (numVisibleShelfItems) => {
    const shelfItems = [];

    for (let i = 0; i < numVisibleShelfItems; i++) {
      if (i < plants.length) {
        shelfItems.push(
          <div className="Shelf-item" key={`shelf-item-${i}`}>
            <Plant plantType={plants[i].plantType} title={plants[i].title} />
          </div>
        );
      } else if (i === plants.length) {
        shelfItems.push(
          <div className="Shelf-item" onClick={addPlant} key={`shelf-item-${i}`}>
            <Plant plantType={addPlantButton} title="" />
          </div>
        );
      } else {
        shelfItems.push(<div className="Shelf-item" key={`shelf-item-${i}`}></div>);
      }
    }
    return shelfItems;
  };

  return (
    <div className="Shelf-container">
      {generateShelfItems(9)}
      {showAddPlantPanel && (
        <AddPlantPanel onSubmitFunction={addPlantOnSubmit} onCancelFunction={cancelAddPlant} />
      )}
    </div>
  );
};

export default Shelf;
