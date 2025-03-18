import React, { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FloorPlanViewer from "./component/FloorPlanViewer/FloorPlanViewer";
import textures from "../src/component/textures";
import html2canvas from "html2canvas"; // Import html2canvas
import "./App.css";

const App = () => {
  const [selectedTexture, setSelectedTexture] = useState(null);
  const floorPlanRef = useRef(null); // Ref to the floor plan container

  const handleTextureChange = (event) => {
    const selectedPath = event.target.value;
    const selectedTexture = textures.find((texture) => texture.path === selectedPath);
    setSelectedTexture(selectedTexture);
  };

  const handleExport = () => {
    if (floorPlanRef.current) {
      // Capture the floor plan container
      html2canvas(floorPlanRef.current).then((canvas) => {
        // Convert the canvas to a data URL
        const image = canvas.toDataURL("image/glb");

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = image;
        link.download = "floorplan.glb"; // Set the file name
        link.click(); // Trigger the download
      });
    } else {
      console.error("Floor plan container not found.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>3D Floor Plan Editor</h1>
        {/* Controls (Texture Dropdown and Export Button) */}
        <div className="controls-container">
          <div className="texture-controls">
            <h3>Textures</h3>
            <select onChange={handleTextureChange}>
              <option value="">Select a texture</option>
              {textures.map((texture, index) => (
                <option key={index} value={texture.path}>
                  {texture.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleExport} className="export-button">
            Export
          </button>
        </div>

        {/* 3D Model Viewer */}
        <div className="floorplan-container" ref={floorPlanRef}>
          <FloorPlanViewer selectedTexture={selectedTexture} />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;