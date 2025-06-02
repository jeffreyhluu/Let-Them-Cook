import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ rating, onRate }) => {
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleClick = (index) => {
    onRate(index + 1);
  };

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const isFilled = hoveredStar !== null ? index <= hoveredStar : index < rating;

        return (
          <span
            key={index}
            className={`star ${isFilled ? "filled" : ""}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
