import React from "react";
import { useDrag } from "react-dnd";
import "./TextureItem.css";

const TextureItem = ({ texture }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TEXTURE",
    item: { texture },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`texture-item ${isDragging ? "dragging" : ""}`}>
      <img src={texture.path} alt={texture.name} className="texture-preview" />
      <span className="texture-label">{texture.name}</span>
    </div>
  );
};

export default TextureItem;