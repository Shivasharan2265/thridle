// components/AnimatedDropdown.js
import React, { useRef, useEffect, useState } from "react";

const AnimatedDropdown = ({ isOpen, children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (ref.current) {
      if (isOpen) {
        setHeight(`${ref.current.scrollHeight}px`);
      } else {
        setHeight("0px");
      }
    }
  }, [isOpen]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "height 0.3s ease",
        height,
      }}
    >
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedDropdown;
