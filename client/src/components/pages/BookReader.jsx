import React, { useContext, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Book from "../modules/Book";
import NavBarBook from "../modules/NavBarBook";
import "./BookReader.css";

// **************** NEWLY ADDED *************** //

// From openBook in Shelf.jsx
const BookReader = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const _id = location.state?._id; // Retrieve the book from state
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const [bookWindow, setBookWindow] = useState(["", ""]);
  // NEW: -1 = no flip, 0 = left page, 1 = right page
  const [flipDirection, setFlipDirection] = useState(-1);
  // Apparently, react is having issues detecting changes to cur, prev, and next spread...
  const [boolFlippedPage, setBoolFlippedPage] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.info("Redirecting to Login!");
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchPageData = async () => {
      console.log("_id: ", _id);
      const { curPage, totalPages } = await post("/api/getpageinfo", { _id });
      console.info("Got page info: curPage = ", curPage, "totalPages = ", totalPages);
      setCurPage(curPage);
      setTotalPages(totalPages);
      const response = await post("/api/getpagerange", {
        _id,
        startPage: curPage - 2,
        totalPages,
        numPages: 6,
      });
      console.log("Page range response from API call: ", response.textArray[2]?.substring(0, 10));
      setBookWindow(response.textArray);
    };
    fetchPageData();
  }, []);

  const flipForward = async () => {
    if (curPage < totalPages - 2) {
      console.log("Getting next two pages");
      const response = await post("/api/getpagerange", {
        _id,
        startPage: curPage,
        totalPages,
        numPages: 6,
      });
      console.log("Page range response from API call: ", response.textArray[2]?.substring(0, 10));
      setCurPage(curPage + 2);
      setBookWindow(response.textArray);
      setFlipDirection(1);
      setBoolFlippedPage(!boolFlippedPage);
      console.log("Finished setting states for flipping forward");
    }
  };

  const flipBackward = async () => {
    if (curPage > 0) {
      console.log("Getting previous two pages");
      const response = await post("/api/getpagerange", {
        _id,
        startPage: curPage - 4,
        totalPages,
        numPages: 6,
      });
      console.log("Page range response from API call: ", response.textArray[2]?.substring(0, 10));
      setBookWindow(response.textArray);
      setCurPage(curPage - 2);
      console.log("Flip Back Page Number: " + curPage);
      setFlipDirection(0);
      setBoolFlippedPage(!boolFlippedPage);
      console.log("Finished setting states for flipping forward");
    }
  };

  return (
    <div className="BookReader-container">
      <div className="BookReader-overlay"></div>
      <NavBarBook />
      <button className="BookReader-button" onClick={flipBackward} disabled={curPage <= 0}>
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
        onClick={flipForward}
        disabled={curPage >= totalPages - 2}
      >
        ▶
      </button>
    </div>
  );
};

export default BookReader;
