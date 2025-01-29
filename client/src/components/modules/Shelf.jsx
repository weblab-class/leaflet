import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Plant from "./Plant.jsx";
import AddPlantPanel from "./AddPlantPanel.jsx";
import DeletePlantPanel from "./DeletePlantPanel.jsx";
import EditPlantPanel from "./EditPlantPanel.jsx";
import { useNavigate } from "react-router-dom";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import "./Shelf.css";

export const plantTypes = [
  { name: "Default", src: "/assets/testPlant" },
  { name: "Tulip", src: "/assets/tulip" },
  { name: "Stephania Erecta", src: "/assets/stephania_erecta" },
  { name: "African Violet", src: "/assets/african_violet" },
  { name: "Lilies of the Valley", src: "/assets/lilies_of_valley" },
];

const Shelf = () => {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();
  const addPlantButton = {
    title: "",
    plantType: "addPlantButton",
  };

  // Fetch plants from the server
  useEffect(() => {
    console.log("Sending get all books request");
    get("/api/getallbooks").then(({ books: books }) => {
      setPlants(books);
    });
  }, []);

  // ============ ADDING PLANTS ============ //
  const [showAddPlantPanel, setShowAddPlantPanel] = useState(false);
  const addPlant = () => {
    setShowAddPlantPanel(true);
  };

  const cancelAddPlant = () => {
    setShowAddPlantPanel(false);
  };

  const submitAddPlant = ({ title, bookType, file, url, curPage, totalPages, plantType }) => {
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
    console.log("plantType: ", plantType);
    setShowAddPlantPanel(false);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("bookType", bookType);
    formData.append("file", file);
    formData.append("url", url);
    formData.append("curPage", curPage);
    formData.append("totalPages", totalPages);
    formData.append("plantType", plantType);

    fetch("/api/createbook", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(({ newPlant }) => {
        setPlants((prevPlants) => [...prevPlants, newPlant]); // Update UI with the new plant
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
    post("/api/deletebook", plantToDelete);
    setPlantToDelete(null);
    setShowDeletePlantPanel(false);
  };

  // ============ EDITING PLANTS ============ //
  const [showEditPlantPanel, setShowEditPlantPanel] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);

  const editPlant = (plant) => {
    setPlantToEdit(plant);
    setShowEditPlantPanel(true);
  };

  const cancelEditPlant = () => {
    setPlantToEdit(null);
    setShowEditPlantPanel(false);
  };

  const saveEditPlant = (updatedPlant) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant._id === plantToEdit._id ? { ...plant, ...updatedPlant } : plant
      )
    );
    post("/api/updatebook", { _id: plantToEdit._id, ...updatedPlant });
    setPlantToEdit(null);
    setShowEditPlantPanel(false);
  };

  // ============ OPENING BOOK ============ //
  const [messagePlantId, setMessagePlantId] = useState(null);
  const openBook = (plant) => {
    console.log("Opening plant: ", plant);
    if (plant.plantType === "addPlantButton") {
      addPlant();
      return;
    } else if (plant.bookType === "physical") {
      console.log("physical book");
      setMessagePlantId(plant._id);
      setTimeout(() => setMessagePlantId(null), 800);
      return;
    }
    navigate("/BookReader", {
      state: { _id: plant._id },
    });
  };

  //=========== RENDERING ============//

  const [curShelfPage, setCurShelfPage] = useState(0); // Track the current page of plants

  const generateShelfItems = () => {
    const shelfItems = [];
    const startIndex = curShelfPage * 9;
    const endIndex = startIndex + 9;

    for (let i = startIndex; i < endIndex; i++) {
      if (i < plants.length) {
        const isMessageVisible = messagePlantId === plants[i]._id;
        shelfItems.push(
          <div className="Shelf-item" key={`shelf-item-${i}`}>
            <div className="column left"></div>
            <div className="column middle">
              <div className="plant-container">
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
              {isMessageVisible && <div className="message-box">I'm a physical book!</div>}
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
    <>
      {curShelfPage > 0 && (
        <button
          className="Shelf-button left"
          onClick={() => setCurShelfPage(curShelfPage - 1)}
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <div className="Shelf-container">{generateShelfItems()}</div>
      {curShelfPage * 9 + 9 < plants.length + 1 && (
        <button
          className="Shelf-button right"
          onClick={() => setCurShelfPage(curShelfPage + 1)}
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}
      {showAddPlantPanel && (
        <AddPlantPanel parentOnSubmitFunction={submitAddPlant} onCancelFunction={cancelAddPlant} />
      )}
      {showDeletePlantPanel && (
        <DeletePlantPanel onConfirmDelete={confirmDeletePlant} onCancelDelete={cancelDeletePlant} />
      )}
      {showEditPlantPanel && (
        <EditPlantPanel plant={plantToEdit} onSave={saveEditPlant} onCancel={cancelEditPlant} />
      )}
    </>
  );
};

export default Shelf;
