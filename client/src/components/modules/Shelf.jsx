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

  // Initialize hardcoded plants for now
  useEffect(() => {
    const hardcodedPlants = [
      { plantType: testPlant, title: defaultTitle },
      { plantType: testPlant, title: defaultTitle },
      { plantType: testPlant, title: defaultTitle },
    ];
    setPlants(hardcodedPlants);
  }, []);

  // Function called on when user clicks on "Add Plant" button, pops up panel/form to add plant (book)
  const addPlant = () => {
    setShowAddPlantPanel(true);
  };

  // Function called on when user decides not to create a plant after all
  const cancelAddPlant = () => {
    setShowAddPlantPanel(false);
    // API endpoint: add new plant (update database)
  };

  // Function called on when user finishes filling out add Plant (book) form and submits it
  const addPlantOnSubmit = (title) => {
    if (title) {
      const newPlant = { plantType: testPlant, title: title };
      setPlants((prevPlants) => [...prevPlants, newPlant]);
    }
    setShowAddPlantPanel(false);
  };

  //=========== RENDERING ============//
  // Dynamically generate shelf items, based on 'plants' state array
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
