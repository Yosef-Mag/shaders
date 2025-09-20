import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import "./App.css";
import { Color } from "three";
import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const uniforms = {
  u_time: { value: 0.0 },
  u_pointer: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0.0, y: 0.0 } },
  u_color: { value: new Color(0x00ff00) },
};
const vertexShader = `
    varying vec2 v_uv;
    varying vec3 v_position;
    void main() {
      v_uv = uv;
      v_position = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);   
    }
  `;

const fragmentShader = `
    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform vec3 u_color;
    uniform float u_time; 
    varying vec2 v_uv;
    varying vec3 v_position;

    void main() {
      vec2 v = u_pointer / u_resolution;
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec3 colorP = vec3(v.x, 0.0, v.y);
      vec3 colorT = vec3((sin(u_time) + 1.0) / 2.0, 0.0, (cos(u_time) + 1.0) / 2.0);
      vec3 blendedColor = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.y);
      vec3 varyingColor = vec3(v_position.x, v_position.y, 0.0);
      vec3 stepColor = vec3(0.0);
      stepColor.r = step(-1.0, v_position.x);
      stepColor.g = step(-1.0, v_position.y);
      stepColor.y = step(1.0, length(v_position.xy));
      gl_FragColor = vec4(stepColor, 1.0); 
    }
  `;

function Plane() {
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      uniforms.u_pointer.value.x = e.clientX;
      uniforms.u_pointer.value.y = e.clientY;
    };
    const onResize = () => {
      uniforms.u_resolution.value.x = window.innerWidth;
      uniforms.u_resolution.value.y = window.innerHeight;
    };
    onResize();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize, false);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize, false);
    };
  }, []);

  useFrame((state) => {
    uniforms.u_time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
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
