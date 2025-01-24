import React, { useContext, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Book from "../modules/Book";
import NavBarBook from "../modules/NavBarBook";
import "./BookReader.css";

// **************** NEWLY ADDED *************** //
const BookReader = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const bookID = location.state?.bookID; // Retrieve the book from state
  // **************** TODO *************** // (Regan)
  // Consider passing in more props than bookID, (like curPage, totalPages)
  const [curPage, setCurPage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const [prevSpread, setPrevSpread] = useState([]);
  const [curSpread, setCurSpread] = useState([]);
  const [nextSpread, setNextSpread] = useState([]);
  // NEW: -1 = no flip, 0 = left page, 1 = right page
  const [flippedPage, setFlippedPage] = useState(-1);

  useEffect(() => {
    if (!userId) {
      console.info("Redirecting to Login!");
      navigate("/");
    }
  }, [userId, navigate]);

  // Initialize page on mount
  useEffect(() => {
    // **************** NEWLY ADDED *************** //
    post("/api/spreads", { _id: bookID }).then(
      ({ curPage, totalPages, prevSpread, curSpread, nextSpread }) => {
        setCurPage(curPage);
        setTotalPages(totalPages);
        setPrevSpread(prevSpread);
        setCurSpread(curSpread);
        setNextSpread(nextSpread);
      }
    );
  }, []);

  const flipForward = () => {
    if (curPage <= totalPages - 4) {
      setCurPage((prev) => prev + 2);
      setPrevSpread(curSpread);
      setCurSpread(nextSpread);
      console.log("Posting request for next spread");
      post("/api/nextspread", { _id: bookID, curPage, totalPages }).then((spreadResult) => {
        setNextSpread(spreadResult.nextSpread);
      });
      setFlippedPage(1);
    }
  };

  const flipBackward = () => {
    if (curPage >= 2) {
      setCurPage((prev) => prev - 2);
      setNextSpread(curSpread);
      setCurSpread(prevSpread);
      console.log("Posting request for previous spread");
      post("/api/prevspread", { _id: bookID, curPage, totalPages }).then((spreadResult) => {
        setPrevSpread(spreadResult.prevSpread);
      });
      setFlippedPage(0);
    }
  };

  return (
    <div className="BookReader-container">
      <div className="BookReader-overlay"></div> {/* Add this div for the dark overlay */}
      <NavBarBook />
      <button className="BookReader-button" onClick={flipBackward} disabled={curPage === 0}>
        ◀
      </button>
      <Book
        prevSpread={prevSpread}
        curSpread={curSpread}
        nextSpread={nextSpread}
        flippedPage={flippedPage}
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
