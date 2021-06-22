/** POC for three-fiber and cannon (a 3d physics lib)
 *
 *  useCannon is a custom hook that lets you link a physics body to a threejs
 *  mesh with zero effort. It will automatically update the mesh with the
 *  correct positioning.
 *
 *  When components with useCannon mount they are known to cannons world, when
 *  they unmount, they'll remove themselves from physics processing.
 *
 *  Check out three-fiber here: https://github.com/drcmda/react-three-fiber
 */

import * as CANNON from 'cannon';
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { useCannon, Provider } from './useCannon';
import './styles.css';

function Plane({ position }) {
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, (body) => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#008080" />
    </mesh>
  );
}

function Box({ position }) {
  // Register box as a physics body with mass
  const ref = useCannon({ mass: 100000 }, (body) => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
    body.position.set(...position);
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" color="#ffd3b6"/>
    </mesh>
  );
}

export default function App() {
  const [showPlane, set] = useState(true);
  // When React removes (unmounts) the upper plane after 5 sec, objects should drop ...
  // This may seem like magic, but as the plane unmounts it removes itself from cannon and that's that
  useEffect(() => void setTimeout(() => set(false), 5000), []);
  return (
    <Canvas className="main" shadowMap camera={{ position: [0, 0, 15] }}>
      <ambientLight intensity={0.6} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 50]}
        angle={0.3}
        penumbra={0.8}
        castShadow
      />
      <Provider>
        <Plane position={[0, 0, -10]} />
        {showPlane && <Plane position={[0, 0, 0]} />}
        <Box position={[1, 0, 1]} />
        <Box position={[2, 1, 5]} />
        <Box position={[0, 0, 6]} />
        <Box position={[-1, 1, 8]} />
        <Box position={[-2, 2, 13]} />
        <Box position={[2, -1, 13]} />
        <Box position={[5, -1, 13]} />
        {!showPlane && <Box position={[0.5, 1.0, 20]} />}
      </Provider>
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
