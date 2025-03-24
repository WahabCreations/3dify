import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import textures from "../src/component/textures"; // Import textures
import FloorPlanViewer from "../src/component/FloorPlanViewer/FloorPlanViewer"; // Import your 3D viewer component
import TextureItem from "../src/component/TextureItem/TextureItem"; // Import TextureItem component
import "../src/App.css"; // Make sure styles are in this file

// Main App component
const App = () => {
  const [selectedTexture, setSelectedTexture] = useState(null); // State to store selected texture
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to control the dropdown visibility

  // Handle texture change when a texture item is clicked or dropped
  const handleTextureChange = (texture) => {
    setSelectedTexture(texture); // Update the selected texture
    setDropdownOpen(false); // Close the dropdown after selecting the texture
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>3D Floor Plan Editor</h1>
        
        {/* Controls (Texture Button and Export Button) */}
        <div className="controls-container">
          <div className="texture-controls">
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="texture-button">
              Textures
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {textures.map((texture, index) => (
                  <TextureItem
                    key={index}
                    texture={texture}
                    onClick={handleTextureChange} // Set texture on click
                  />
                ))}
              </div>
            )}
          </div>
          <button className="export-button">Export</button>
        </div>

        {/* 3D Model Viewer */}
        <div style={{ flex: 1 }}>
          <FloorPlanViewer selectedTexture={selectedTexture} /> {/* Pass selected texture to the viewer */}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
