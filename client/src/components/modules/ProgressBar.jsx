import React, { useState, useEffect } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ curPage, totalPages, progressBarHovered }) => {
  const progress = Math.ceil(((curPage + 1) / totalPages) * 4);
  useEffect(() => {
    "Progress Bar rendered, progressBarHovered = ", progressBarHovered;
  });
  return (
    <div>
      {progressBarHovered && (
        <div className={`progress-bar`}>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`progress-bar-segment ${index < progress ? "filled" : "empty"}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
