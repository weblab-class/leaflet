import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import DeletePlantPanel from "./DeletePlantPanel.jsx";
import DeletePlantButton from "./DeletePlantButton.jsx";
import "./Shelf.css";

const Shelf = () => {
  const [plants, setPlants] = useState([]);
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [showDeletePlantPanel, setShowDeletePlantPanel] = useState(false);
  const addPlantButton = "addPlantButton";

  // **************** TODO *************** //
  // When website mounts, get all the books from the user,
  // display them in shelf
  useEffect(() => {
    console.log("Going to send get all books request");
    get("/api/getallbooks").then((books) => {
      setPlants(books);
    });
  }, []);

  // *********** ADDING PLANTS ************ //
  // Function called on when user clicks on "Add Plant" button,
  // pops up panel/form to add plant (book)
  const addPlant = () => {
    setShowAddPlantPanel(true);
  };

  // Function called on when user decides not to create a plant after all
  const cancelAddPlant = () => {
    setShowAddPlantPanel(false);
  };

  // Function called on when user finishes filling out add Plant
  // (book) form and submits it
  const confirmAddPlant = (newBook) => {
    post("/api/createbook", newBook).then((newPlant) => {
      console.log("newPlant plantType: " + newPlant.plantType);
      setPlants((prevPlants) => [...prevPlants, newPlant]);
      setShowAddPlantPanel(false);
    });
  };

  // *********** DELETING PLANTS ************ //
  const deletePlant = (plant) => {
    setPlantToDelete(plant);
    setShowDeletePlantPanel(true);
  };

  const cancelDeletePlant = () => {
    setPlantToDelete(null);
    setShowDeletePlantPanel(false);
  };

  const confirmDeletePlant = () => {
    setPlants((prevPlants) => prevPlants.filter((p) => p !== plantToDelete));
    post("/api/deletebook", plantToDelete);
    setPlantToDelete(null);
    setShowDeletePlantPanel(false);
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
            <DeletePlantButton onDelete={() => deletePlant(plants[i])} />
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
        <AddPlantPanel onSubmitFunction={confirmAddPlant} onCancelFunction={cancelAddPlant} />
      )}
      {showDeletePlantPanel && (
        <DeletePlantPanel onConfirmDelete={confirmDeletePlant} onCancelDelete={cancelDeletePlant} />
      )}
    </div>
  );
};

export default Shelf;
