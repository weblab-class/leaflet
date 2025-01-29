import React, { useContext, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Book from "../modules/Book";
import NavBarBook from "../modules/NavBarBook";
import "./BookReader.css";

// **************** NEWLY ADDED *************** //

const BookReader = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const _id = location.state?._id; // Retrieve the book from state
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(10);
  const [bookWindow, setBookWindow] = useState(["", ""]);
  const [flipDirection, setFlipDirection] = useState(-1);
  const [boolFlippedPage, setBoolFlippedPage] = useState(false);
  const { isSoundOn, setIsSoundOn } = useOutletContext();

  useEffect(() => {
    if (!userId) {
      ("Redirecting to Login!");
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchPageData = async () => {
      const { curPage, totalPages } = await post("/api/getpageinfo", { _id });
      setCurPage(curPage);
      setTotalPages(totalPages);
      const response = await post("/api/getpagerange", {
        _id,
        startPage: curPage - 2,
        totalPages,
        numPages: 6,
      });
      setBookWindow(response.textArray);
    };
    fetchPageData();
  }, []);

  const flipToPage = async (newPage) => {
    setCurPage(newPage);
    const response = await post("/api/getpagerange", {
      _id,
      startPage: newPage - 2,
      totalPages,
      numPages: 6,
    });
    setBookWindow(response.textArray);
    post("/api/savecurpage", { _id, curPage: newPage });
    if (newPage > curPage) {
      setFlipDirection(0);
    } else {
      setFlipDirection(1);
    }
    setCurPage(newPage);
    setBoolFlippedPage(!boolFlippedPage);
  };

  //page turn audio
  const pageTurnSound = new Audio("/assets/pageTurn.mp3");

  const playSound = () => {
    if (isSoundOn) {
      pageTurnSound.play();
    }
  };

  // Event listener for arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && curPage > 0) {
        flipToPage(curPage - 2);
        playSound();
      }
      if (event.key === "ArrowRight" && curPage < totalPages - 2) {
        flipToPage(curPage + 2);
        playSound();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [curPage, totalPages]);

  return (
    <div className="BookReader-container">
      <div className="BookReader-overlay"></div>
      <NavBarBook curPage={curPage} totalPages={totalPages} flipToPage={flipToPage} />
      <button
        className="BookReader-button"
        onClick={() => {
          flipToPage(curPage - 2);
          playSound();
        }}
        disabled={curPage <= 0}
      >
        ◀
      </button>
      <Book
        prevSpread={flipDirection === 1 ? bookWindow.slice(0, 2) : bookWindow.slice(4, 6)}
        nextSpread={bookWindow.slice(2, 4)}
        flipDirection={flipDirection}
        boolFlippedPage={boolFlippedPage}
      />
      <button
        className="BookReader-button"
        onClick={() => {
          flipToPage(curPage + 2);
          playSound();
        }}
        disabled={curPage >= totalPages - 2}
      >
        ▶
      </button>
    </div>
  );
};

export default BookReader;
