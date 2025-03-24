import React, { useEffect, useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Bounds, CameraControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { ErrorBoundary } from "react-error-boundary";

// FloorPlanViewer Component
const FloorPlanViewer = ({ selectedTexture, canvasRef }) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const controlsRef = useRef();

  // Load Floorplan Model
  useEffect(() => {
    const gltfLoader = new GLTFLoader();

    const loadModel = (path) => {
      gltfLoader.load(
        path,
        (gltf) => {
          console.log("GLB file loaded successfully:", gltf);
          const object = gltf.scene;
          object.scale.set(1, 1, 1);

          object.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (selectedTexture) {
                const texture = new THREE.TextureLoader().load(
                  selectedTexture.path,
                  (texture) => {
                    console.log("Texture loaded successfully:", texture);
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                  },
                  undefined,
                  (error) => {
                    console.error("Error loading texture:", error);
                  }
                );
              } else {
                child.material.map = null;
                child.material.needsUpdate = true;
              }
            }
          });

          setFloorPlan(object);
        },
        undefined,
        (error) => {
          console.error("Error loading GLB file:", error);
        }
      );
    };

    loadModel("/Model/plan1.obj"); // Adjust the path as needed
  }, [selectedTexture]);

  // Auto-fit camera to model
  useEffect(() => {
    if (floorPlan && controlsRef.current) {
      const bbox = new THREE.Box3().setFromObject(floorPlan);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const cameraDistance = maxDim * 1.5;

      controlsRef.current.setLookAt(
        center.x + cameraDistance,
        center.y + cameraDistance,
        center.z + cameraDistance,
        center.x,
        center.y,
        center.z,
        true
      );
    }
  }, [floorPlan]);

  // Drop functionality for floor plan (apply texture on drop)
  const [{ isOver }, drop] = useDrop({
    accept: "TEXTURE",
    drop: (item) => {
      if (item.texture) {
        // Apply the dropped texture to the 3D model
        console.log("Texture dropped:", item.texture);
        if (floorPlan) {
          floorPlan.traverse((child) => {
            if (child.isMesh) {
              const texture = new THREE.TextureLoader().load(item.texture.path);
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop} // Attach drop functionality to the floor plan container
      style={{
        border: "none", // Highlight the area when hovered
      }}
    >
      <ErrorBoundary fallback={<div>3D Viewer Error</div>}>
        <Canvas
          ref={canvasRef} // Attach the canvasRef to the canvas
          shadows
          camera={{ fov: 45 }}
          gl={{ antialias: true }}
        >
          <CameraControls ref={controlsRef} makeDefault />
          <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={50} makeDefault />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
          <Grid args={[10, 10]} cellColor="#cccccc" sectionColor="#eeeeee" position={[0, -0.01, 0]} />
          <Bounds fit clip observe margin={1.2}>
            <group position={[0, 0, 0]}>{floorPlan && <primitive object={floorPlan} />}</group>
          </Bounds>
          <EffectComposer>
            <SSAO radius={0.4} intensity={50} luminanceInfluence={0.4} color="red" />
          </EffectComposer>
          <axesHelper args={[5]} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default FloorPlanViewer;
