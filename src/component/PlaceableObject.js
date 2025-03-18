
import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

const PlaceableObject = ({ path, position }) => {
  const obj = useLoader(OBJLoader, path);

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.3,
            roughness: 0.8,
          });
        }
      });
    }
  }, [obj]);

  return obj ? <primitive object={obj} position={position} /> : null;
};

export default PlaceableObject;