import React, { useState, useEffect } from "react";
import "./PriceFilter.css";

const PriceFilter = ({ onPriceChange }) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);
  const [slider, setSlider] = useState([0, 1000]);

  useEffect(() => {
    setSlider([min, max]);
  }, [min, max]);

  const handleSliderChange = (index, value) => {
    const updated = [...slider];
    updated[index] = Number(value);
    if (index === 0) setMin(updated[0]);
    if (index === 1) setMax(updated[1]);
    setSlider(updated);
  };

  return (
   <div className="facet clearfix">
     <h1 className="h6 facet-title">Price</h1>
      <div className="price-input-wrapper">
        <div className="input-label">
          <label>Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
        </div>
        <span className="dash">-</span>
        <div className="input-label">
          <label>Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
        </div>
        <button className="apply-btn" onClick={() => onPriceChange(min, max)}>
          <i className="material-icons">chevron_right</i>
        </button>
      </div>

      <div className="slider-wrapper">
        <input
          type="range"
          min="0"
          max="1000"
          value={slider[0]}
          onChange={(e) => handleSliderChange(0, e.target.value)}
        />
        <input
          type="range"
          min="0"
          max="1000"
          value={slider[1]}
          onChange={(e) => handleSliderChange(1, e.target.value)}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
