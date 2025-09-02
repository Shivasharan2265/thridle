// components/WhatsAppButton.js
import React from "react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919964384555" // Replace with your WhatsApp number
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
        alt="WhatsApp Chat"
        style={{ width: 50, height: 50 }}
      />
    </a>
  );
};

export default WhatsAppButton;
