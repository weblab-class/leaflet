import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import DeletePlantPanel from "./DeletePlantPanel.jsx";
import EditPlantPanel from "./EditPlantPanel.jsx";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react"; // Use lucide-react for icons
import "./Shelf.css";

const Shelf = () => {
  // Plant = lightweight representation of Book schema/object:
  // _id: corresponding book id
  // title: String
  // bookType: String among ["search", "upload", "physical"]
  // curPage: Number
  // totalPages: Number
  // plantType: "testPlant"
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();
  const addPlantButton = {
    title: "",
    plantType: "addPlantButton",
  };

  // Display user's existing plants in shelf
  useEffect(() => {
    console.log("Sending get all books request");
    get("/api/getallbooks").then(({ books: books }) => {
      setPlants(books);
    });
  }, []);

  // ============ ADDING PLANTS ============ //
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);

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
  const submitAddPlant = ({ title, bookType, file, url, curPage, totalPages }) => {
    console.info("Adding new plant");

    // Validate input based on bookType
    if (bookType === "search" && !url) {
      console.error("Validation Error: 'search' book type requires a non-empty 'url'.");
    }
    if (bookType === "upload" && !file) {
      console.error("Validation Error: 'upload' book type requires a file to be uploaded.");
    }
    if (bookType === "physical" && !totalPages) {
      console.error(
        "Validation Error: 'physical' book type requires 'totalPages' to be specified."
      );
    }
    setShowAddPlantPanel(false);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("bookType", bookType);
    formData.append("file", file);
    formData.append("url", url);
    formData.append("curPage", curPage);
    formData.append("totalPages", totalPages);

    // Can't use get/post from utilities because formdata is passed in
    fetch("/api/createbook", {
      method: "POST",
      body: formData, // Send FormData directly
    })
      .then((response) => response.json())
      .then(({ newPlant }) => {
        setPlants((prevPlants) => [...prevPlants, newPlant]); // Update UI with the new book
      });
  };

  // ============ DELETING PLANTS ============ //
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [showDeletePlantPanel, setShowDeletePlantPanel] = useState(false);
  const deletePlant = (plant) => {
    console.log("Plant set to delete: ", plant);
    setPlantToDelete(plant);
    setShowDeletePlantPanel(true);
  };

  const cancelDeletePlant = () => {
    setPlantToDelete(null);
    setShowDeletePlantPanel(false);
  };

  const confirmDeletePlant = () => {
    console.info("About to delete plant: ", plantToDelete);
    setPlants((prevPlants) => prevPlants.filter((p) => p._id !== plantToDelete._id));
    console.info("Remaining plants: ", plants);
    post("/api/deletebook", plantToDelete);
    setPlantToDelete(null);
    setShowDeletePlantPanel(false);
  };

  // ============ EDITING PLANTS ============ //

  const [showEditPlantPanel, setShowEditPlantPanel] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);

  const editPlant = (plant) => {
    setPlantToEdit(plant); // Set the plant to be edited
    setShowEditPlantPanel(true);
  };

  const cancelEditPlant = () => {
    setPlantToEdit(null);
    setShowEditPlantPanel(false);
  };

  const saveEditPlant = (updatedPlant) => {
    // Update plant details in the state
    if (updatedPlant.curPage != 0 && (updatedPlant.curPage - 1) % 2 == 0) {
      updatedPlant.curPage -= 2;
    } else {
      updatedPlant.curPage -= 1;
    }
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant._id === plantToEdit._id ? { ...plant, ...updatedPlant } : plant
      )
    );

    // Send updated data to the backend
    post("/api/updatebook", { _id: plantToEdit._id, ...updatedPlant }).then(() => {
      console.log("Plant updated successfully");
    });

    // Close the edit panel
    setPlantToEdit(null);
    setShowEditPlantPanel(false);
  };

  // ============ OPENING BOOK ============ //
  const openBook = (plant) => {
    if (plant.plantType === "addPlantButton") {
      addPlant();
      return;
    } else if (plant.bookType === "physical") {
      return;
    } else {
      navigate("/BookReader", {
        state: { _id: plant._id },
      });
    }
  };

  //=========== RENDERING ============//
  // Dynamically generate shelf items, based on 'plants' state array
  const generateShelfItems = (numVisibleShelfItems) => {
    const shelfItems = [];
    for (let i = 0; i < numVisibleShelfItems; i++) {
      if (i < plants.length) {
        shelfItems.push(
          <div className="Shelf-item" key={`shelf-item-${i}`}>
            <div className="column left"></div>
            <div className="column middle">
              <div className="plant-container">
                {console.info("generating current plant: ", plants[i])}
                <Plant plant={plants[i]} openBook={openBook} />
              </div>
            </div>
            <div className="column right">
              <button className="DeletePlantButton" onClick={() => deletePlant(plants[i])}>
                {" "}
                X{" "}
              </button>
              <button className="EditPlantButton" onClick={() => editPlant(plants[i])}>
                <Pencil size={20} />
              </button>
            </div>
          </div>
        );
      } else if (i === plants.length) {
        shelfItems.push(
          <div className="Shelf-item" onClick={addPlant} key={`shelf-item-${i}`}>
            <Plant plant={addPlantButton} openBook={openBook} />
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
      {showEditPlantPanel && (
        <EditPlantPanel plant={plantToEdit} onSave={saveEditPlant} onCancel={cancelEditPlant} />
      )}
    </div>
  );
};

export default Shelf;
