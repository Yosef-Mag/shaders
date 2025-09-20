import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import "./App.css";

function Plane() {
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position*0.5, 1.0);   
    }
  `;

  const fragmentShader = `
    void main() {
      gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); 
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 5]}
        left={-1}
        right={1}
        top={1}
        bottom={-1}
        near={0.1}
        far={1000}
      />
      <Plane />
    </Canvas>
  );
}

export default App;
