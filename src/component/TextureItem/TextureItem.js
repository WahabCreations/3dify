import React from "react";
import { useDrag } from "react-dnd";
import "./TextureItem.css";

const TextureItem = ({ texture, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TEXTURE",
    item: { texture },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`texture-item ${isDragging ? "dragging" : ""}`}
      onClick={() => onClick(texture)} // Set texture on click
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
      }}
    >
      <div className="texture-image" style={{ backgroundImage: `url(${texture.path})` }} />
      <span className="texture-name">{texture.name}</span>
    </div>
  );
};

export default TextureItem;
