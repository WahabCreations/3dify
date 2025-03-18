import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Bounds, CameraControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Correct import
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"; // Correct import
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"; // Correct import
import * as THREE from "three";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { ErrorBoundary } from "react-error-boundary";

const FloorPlanViewer = ({ selectedTexture }) => {
  const [floorPlan, setFloorPlan] = useState(null);
  const controlsRef = useRef();
  const canvasRef = useRef(); // Ref to the Three.js canvas

  // Load Floorplan Model
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    const objLoader = new OBJLoader();

    const loadModel = (path) => {
      gltfLoader.load(
        path,
        (gltf) => {
          console.log("GLB file loaded successfully:", gltf);
          const object = gltf.scene;
          object.scale.set(1, 1, 1);

          const bbox = new THREE.Box3().setFromObject(object);
          const center = bbox.getCenter(new THREE.Vector3());
          const size = bbox.getSize(new THREE.Vector3());

          object.position.sub(center);

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
          console.error("Error loading GLB file, trying FBX:", error);
          fbxLoader.load(
            path,
            (fbx) => {
              console.log("FBX file loaded successfully:", fbx);
              const object = fbx;
              // Handle the loaded FBX file
            },
            undefined,
            (error) => {
              console.error("Error loading FBX file, trying OBJ:", error);
              objLoader.load(
                path,
                (obj) => {
                  console.log("OBJ file loaded successfully:", obj);
                  const object = obj;
                  // Handle the loaded OBJ file
                },
                undefined,
                (error) => {
                  console.error("Error loading OBJ file:", error);
                }
              );
            }
          );
        }
      );
    };

    loadModel("/Model/plan1.glb"); // Adjust the path as needed
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

  return (
    <div className="viewer-container">
      <ErrorBoundary fallback={<div>3D Viewer Error</div>}>
        <Canvas
          shadows
          camera={{ fov: 45 }}
          gl={{ antialias: true }}
          ref={canvasRef} // Attach the ref to the canvas
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