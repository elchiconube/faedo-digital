import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const Mug = "/mug.glb";
const Texture = "/model1.jpg";

function Model() {
  const gltf = useLoader(GLTFLoader, Mug);
  const texture = useLoader(TextureLoader, Texture);
  const meshRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (texture) {
      texture.encoding = THREE.sRGBEncoding;
      texture.flipY = false;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "Mug_Porcelain_PBR001_0") {
            child.material.map = texture;
          } else if (child.name === "Mug_Porcelain_PBR002_0") {
            child.material.color.setHex(0xffffff);
          }
          child.material.needsUpdate = true;
        }
      });

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 0.7;

      camera.position.set(0, 0, cameraZ);
      camera.lookAt(center);

      gltf.scene.position.sub(center);
    }
  }, [gltf, texture, camera]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return <primitive object={gltf.scene} ref={meshRef} />;
}

function ThreeJSExample() {
  return (
    <div style={{ width: "300px", height: "400px" }}>
      <Canvas style={{ background: "white" }}>
        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 5]} />
        <ambientLight intensity={0.9} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <React.Suspense fallback={null}>
          <Model />
        </React.Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.25}
          rotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}

export default ThreeJSExample;
