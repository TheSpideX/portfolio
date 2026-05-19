import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraController = ({ transformRef }: { transformRef: React.RefObject<{ x: number, y: number, scale: number }> }) => {
  useFrame((state) => {
    if (!transformRef.current) return;
    const { x, y, scale } = transformRef.current;
    
    // Map the 2D canvas coordinates to 3D space
    // The 2D canvas is huge (5000x4000), so we need to scale it down
    // Initial position is x: -1000, y: -800, scale: 0.6
    
    // Target camera position
    const targetX = (x + 1000) * 0.01;
    const targetY = -(y + 800) * 0.01;
    const targetZ = 20 + (1 - scale) * 20; // Zoom out when scale is smaller
    
    // Smoothly interpolate camera position
    state.camera.position.x += (targetX - state.camera.position.x) * 0.1;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.1;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1;
    
    // Add a slight rotation based on pan
    state.camera.rotation.y = -targetX * 0.02;
    state.camera.rotation.x = targetY * 0.02;
  });
  return null;
};

const WireframeTerrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a plane geometry
  const geometry = useMemo(() => new THREE.PlaneGeometry(150, 150, 80, 80), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = geometry.attributes.position;
    
    // Animate vertices to create a wave effect
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Calculate z based on sine waves to make undulating terrain
      const z = Math.sin(x * 0.1 + time * 0.5) * 3 + Math.cos(y * 0.1 + time * 0.3) * 3;
      positions.setZ(i, z);
    }
    
    positions.needsUpdate = true;
    
    // Slowly rotate the entire terrain
    meshRef.current.rotation.z = time * 0.02;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -15, -30]}>
      <meshBasicMaterial color="#ccff00" wireframe={true} transparent opacity={0.15} />
    </mesh>
  );
};

const FloatingParticles = () => {
  const count = 800;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      const speed = 0.1 + Math.random() * 0.5;
      const scale = 0.5 + Math.random() * 1.5;
      temp.push({ x, y, z, speed, scale });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.x,
        particle.y + Math.sin(time * particle.speed + i) * 2,
        particle.z
      );
      dummy.rotation.set(
        time * particle.speed,
        time * particle.speed,
        0
      );
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Slowly rotate the entire particle field
    meshRef.current.rotation.y = time * 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.2} />
    </instancedMesh>
  );
};

export default function Background3D({ transformRef }: { transformRef?: React.RefObject<{ x: number, y: number, scale: number }> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <fog attach="fog" args={['#09090b', 10, 60]} /> {/* Matches zinc-950 */}
        {transformRef && <CameraController transformRef={transformRef} />}
        <WireframeTerrain />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
