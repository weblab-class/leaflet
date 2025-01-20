import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import DeletePlantPanel from "./DeletePlantPanel.jsx";
import DeletePlantButton from "./DeletePlantButton.jsx";
import { useNavigate } from "react-router-dom";
import "./Shelf.css";

const Shelf = () => {
  // Plant is same as its book object (in the database) EXCEPT
  // it doesn't have a content field (but ObjectID is the same)
  const [plants, setPlants] = useState([]);
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [showDeletePlantPanel, setShowDeletePlantPanel] = useState(false);
  const addPlantButton = "addPlantButton";
  const navigate = useNavigate();

  // Display user's existing plants in shelf
  useEffect(() => {
    console.log("Going to send get all books request");
    get("/api/getallbooks").then(({ books: books }) => {
      setPlants(books);
    });
  }, []);

  // ============ ADDING PLANTS ============ //
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
    post("/api/createbook", newBook).then(({ book: newPlant }) => {
      setPlants((prevPlants) => [...prevPlants, newPlant]);
      setShowAddPlantPanel(false);
    });
  };

  // ============ DELETING PLANTS ============ //
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

  // ============ OPENING BOOK ============ //
  // **************** NEWLY ADDED *************** //
  const openBook = (plant) => {
    navigate("/BookReader", {
      // **************** TODO *************** // (Regan)
      // Consider passing in more props than bookID, (like curPage, totalPages)
      state: { bookID: plant._id },
    });
  };

  //=========== RENDERING ============//
  // Dynamically generate shelf items, based on 'plants' state array
  const generateShelfItems = (numVisibleShelfItems) => {
    const shelfItems = [];
    for (let i = 0; i < numVisibleShelfItems; i++) {
      if (i < plants.length) {
        shelfItems.push(
          // **************** NEWLY ADDED *************** //
          // Make sure it doesn't open book when delete button is clicked
          <div className="Shelf-item" key={`shelf-item-${i}`} onClick={() => openBook(plants[i])}>
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
