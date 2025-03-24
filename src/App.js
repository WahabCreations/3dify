import React, { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import textures from "../src/component/textures"; // Import textures
import FloorPlanViewer from "../src/component/FloorPlanViewer/FloorPlanViewer"; // Import your 3D viewer component
import TextureItem from "../src/component/TextureItem/TextureItem"; // Import TextureItem component
import html2canvas from "html2canvas"; // Import html2canvas to capture the canvas
import "../src/App.css"; // Make sure styles are in this file

// Main App component
const App = () => {
  const [selectedTexture, setSelectedTexture] = useState(null); // State to store selected texture
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to control the dropdown visibility
  const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level
  const canvasRef = useRef(null); // Ref to the 3D model canvas

  // Handle texture change when a texture item is clicked or dropped
  const handleTextureChange = (texture) => {
    setSelectedTexture(texture); // Update the selected texture
    setDropdownOpen(false); // Close the dropdown after selecting the texture
  };

  // Zoom In function
  const zoomIn = () => {
    setZoomLevel(zoomLevel + 0.1); // Increase zoom level
  };

  // Zoom Out function
  const zoomOut = () => {
    setZoomLevel(zoomLevel - 0.1); // Decrease zoom level
  };

  // Export function to download the floor plan as an image
  const handleExport = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/obj"); // Capture canvas to image
        const link = document.createElement("a");
        link.href = image;
        link.download = "floorplan.obj"; // Set the download filename
        link.click(); // Trigger the download
      });
    } else {
      console.error("Canvas not found for export");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>3D Floor Plan Editor</h1>
        
        {/* Controls (Texture Button, Zoom Buttons, and Export Button) */}
        <div className="controls-container">
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button onClick={zoomIn} className="zoom-button">+</button>
            <button onClick={zoomOut} className="zoom-button">-</button>
          </div>

          {/* Texture Controls */}
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

          {/* Export Button */}
          <button className="export-button" onClick={handleExport}>Export</button>
        </div>

        {/* 3D Model Viewer */}
        <div style={{ flex: 1 }}>
          <FloorPlanViewer selectedTexture={selectedTexture} canvasRef={canvasRef} zoomLevel={zoomLevel} /> {/* Pass canvasRef and zoomLevel to the viewer */}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
