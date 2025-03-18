import React, { useState } from "react";
import "./TextureDropdown.css"; // Ensure the CSS file is named correctly
import TextureItem from "./TextureItem";

const TextureDropdown = ({ textures, onSelectTexture }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="texture-dropdown-container">
      <button className="texture-btn" onClick={() => setIsOpen(!isOpen)}>
        Texture
        <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="texture-dropdown">
          {textures.map((texture, index) => (
            <TextureItem
              key={index}
              texture={texture}
              onSelectTexture={onSelectTexture}
              onClick={() => setIsOpen(false)} // Close dropdown on selection
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TextureDropdown;