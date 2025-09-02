import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HeaderProfile = ({ navigate }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", marginLeft: "15px" }}>
      {/* Profile icon */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <i className="material-icons" style={{ color: "black", fontSize: "22px" }}>
          account_circle
        </i>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "48px",
            minWidth: "160px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            padding: "8px 0",
            zIndex: 9999,
          }}
        >
          <Link
            to="/check-out"
            style={{
              display: "block",
              padding: "10px 16px",
              fontSize: "14px",
              color: "#333",
              textDecoration: "none",
            }}
          >
            🛒 Checkout
          </Link>
          <Link
            to="/order-history"
            style={{
              display: "block",
              padding: "10px 16px",
              fontSize: "14px",
              color: "#333",
              textDecoration: "none",
            }}
          >
            📜 History
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/login"); // add your logout logic
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              textAlign: "left",
              fontSize: "14px",
              color: "#e63946",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderProfile;
