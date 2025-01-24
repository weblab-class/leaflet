import React, { useContext, useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Book from "../modules/Book";
import NavBar from "../modules/NavBarBook";

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

  // **************** TODO *************** //
  const getLeftPage = () => {
    console.info("left page: " + curSpread[0]);
    return curSpread[0] || "";
  };

  // **************** TODO *************** //
  const getRightPage = () => {
    console.info("right page: " + curSpread[1]);
    return curSpread[1] || "";
  };

  const flipForward = () => {
    if (curPage < totalPages - 2) {
      setCurPage((prev) => prev + 2);
      setPrevSpread(curSpread);
      setCurSpread(nextSpread);
      setNextSpread(
        post("/api/nextspread", { _id: bookID, curPage: curPage, totalPages: totalPages })
      );
      setFlippedPage(1);
    }
  };

  const flipBackward = () => {
    if (curPage > 0) {
      setCurPage((prev) => prev - 2);
      setNextSpread(curSpread);
      setCurSpread(prevSpread);
      setPrevSpread(
        post("/api/prevspread", { _id: bookID, curPage: curPage, totalPages: totalPages })
      );
      setFlippedPage(0);
    }
  };

  return (
    <div className="BookReader-container">
      <NavBar />
      <button onClick={flipBackward} disabled={curPage === 0}>
        Previous
      </button>
      <button onClick={flipForward} disabled={curPage >= totalPages - 2}>
        Next
      </button>
      <Book leftPage={getLeftPage()} rightPage={getRightPage()} flippedPage={flippedPage} />
    </div>
  );
};

export default BookReader;
