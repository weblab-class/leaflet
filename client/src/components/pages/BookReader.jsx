import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";

const BookReader = ({ title }) => {
  const [book, setBook] = useState([]); // Array of pages (text)
  const [curPage, setCurPage] = useState(-1); // Current page index

  const getBook = () => {
    const data = get(`/api/Book?title=${title}`);
    setBook(data.content);
    setCurPage(data.curPage);
  };

  const getPage = (pageNumber) => {
    post(`/api/setPage`, title, pageNumber);
    setCurPage(pageNumber);
  };

  useEffect(() => {
    getBook();
  }, []);

  return (
    <div>
      <p>{book[curPage]}</p>
    </div>
  );
};

export default BookReader;
