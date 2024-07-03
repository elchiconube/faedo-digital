import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const Mug = "/mug.glb";
const Texture = "/model1.jpg";

//https://codesandbox.io/p/sandbox/threejs-mug-forked-3htn2?file=%2Fsrc%2FThreeJSExample.js%3A12%2C15

function Model() {
  const gltf = useLoader(GLTFLoader, Mug);
  const texture = useLoader(TextureLoader, Texture);
  const meshRef = useRef();
  const { camera, scene } = useThree();

  useEffect(() => {
    if (texture) {
      texture.encoding = THREE.sRGBEncoding;
      texture.flipY = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "Mug_Porcelain_PBR001_0") {
            const texturedMaterial = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.4,
              metalness: 0.1,
              envMapIntensity: 1,
            });

            texturedMaterial.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `
                #include <map_fragment>
                diffuseColor.rgb = mix(diffuseColor.rgb, pow(diffuseColor.rgb, vec3(1.1)), 0.5);
                `
              );
            };

            child.material = texturedMaterial;
          } else if (child.name === "Mug_Porcelain_PBR002_0") {
            child.material.color.setHex(0xffffff);
            child.material.roughness = 0.2;
            child.material.metalness = 0.1;
          }
          child.material.needsUpdate = true;
        }
      });

      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      const modelSizeVec3 = new THREE.Vector3();
      boundingBox.getSize(modelSizeVec3);
      const modelSize = modelSizeVec3.length();
      const modelCenter = new THREE.Vector3();
      boundingBox.getCenter(modelCenter);

      const cameraPos = new THREE.Vector3(-0.2, 0.4, 1.4);
      camera.position.copy(modelCenter);
      camera.position.x += modelSize * cameraPos.x;
      camera.position.y += modelSize * cameraPos.y;
      camera.position.z += modelSize * cameraPos.z;
      camera.lookAt(modelCenter);

      gltf.scene.position.sub(modelCenter);
      scene.add(gltf.scene);
    }
  }, [gltf, texture, camera, scene]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <hemisphereLight args={[0xffffff, 0x444444, 0.8]} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
    </>
  );
}

function ThreeJSExample() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "white" }}>
        <PerspectiveCamera makeDefault fov={20} near={1e-5} far={1e10} />
        <Lights />
        <React.Suspense fallback={null}>
          <Model />
        </React.Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.07}
          rotateSpeed={1.25}
          panSpeed={1.25}
          screenSpacePanning
          autoRotate
        />
      </Canvas>
    </div>
  );
}

export default ThreeJSExample;
