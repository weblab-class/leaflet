import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import DeletePlantPanel from "./DeletePlantPanel.jsx";
import DeletePlantButton from "./DeletePlantButton.jsx";
import { useNavigate } from "react-router-dom";
import "./Shelf.css";

const Shelf = () => {
  // Plant = lightweight representation of Book schema/object:
  // _id: corresponding book id
  // title: String
  // bookType: String among ["search", "upload", "physical"]
  // currentPage: Number
  // totalPages: Number
  const [plants, setPlants] = useState([]);
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [showDeletePlantPanel, setShowDeletePlantPanel] = useState(false);
  const addPlantButton = "addPlantButton";
  const navigate = useNavigate();

  // Display user's existing plants in shelf
  useEffect(() => {
    console.log("Sending get all books request");
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

  // Arguments passed in from AddPlantPanel.jsx --> localOnSubmitFunction
  const submitAddPlant = ({ title, bookType, file, url, currentPage, totalPages }) => {
    console.info("Adding new plant");
    setShowAddPlantPanel(false);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("bookType", bookType);
    formData.append("file", file);
    formData.append("url", url);
    formData.append("currentPage", currentPage);
    formData.append("totalPages", totalPages);

    // Can't use get/post from utilities because formdata is passed in
    fetch("/api/createbook", {
      method: "POST",
      body: formData, // Send FormData directly
    })
      .then((response) => response.json())
      .then(({ newPlant }) => {
        setPlants((prevPlants) => [...prevPlants, newPlant]); // Update UI with the new book
      })
      .catch((error) => console.error("Error creating book:", error));
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
          <div className="Shelf-item" key={`shelf-item-${i}`}>
            <div className="column left"></div>
            <div className="column middle" onClick={() => openBook(plants[i])}>
              <div className="plant-container">
                <Plant plantType={plants[i].plantType} title={plants[i].title} />
              </div>
            </div>
            <div className="column right">
              <DeletePlantButton onDelete={() => deletePlant(plants[i])} />
            </div>
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
        <AddPlantPanel parentOnSubmitFunction={submitAddPlant} onCancelFunction={cancelAddPlant} />
      )}
      {showDeletePlantPanel && (
        <DeletePlantPanel onConfirmDelete={confirmDeletePlant} onCancelDelete={cancelDeletePlant} />
      )}
    </div>
  );
};

export default Shelf;
