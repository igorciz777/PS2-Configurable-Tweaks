import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { TweakValues } from '../fields';

interface CameraPreviewProps {
  prefix: string;
  values: TweakValues;
  fallbacks?: {
    vsp?: [number, number, number];
    vrp?: [number, number, number];
    vup?: [number, number, number];
    vcp?: [number, number, number];
  };
}

function readVector(
  values: TweakValues,
  prefix: string,
  key: string,
  fallback: [number, number, number],
): [number, number, number] {
  return [
    (values[`${prefix}${key}X`] as number) ?? fallback[0],
    (values[`${prefix}${key}Y`] as number) ?? fallback[1],
    (values[`${prefix}${key}Z`] as number) ?? fallback[2],
  ];
}

function DynamicCamera({
  vsp,
  vrp,
  vup,
}: {
  vsp: [number, number, number];
  vrp: [number, number, number];
  vup: [number, number, number];
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(vsp[0], vsp[1], vsp[2]);
    camera.up.set(vup[0], vup[1], vup[2]);
    camera.lookAt(new THREE.Vector3(vrp[0], vrp[1], vrp[2]));
    camera.updateProjectionMatrix();
  });

  return null;
}

function Scene({
  vsp,
  vrp,
  vup,
  vcp,
}: {
  vsp: [number, number, number];
  vrp: [number, number, number];
  vup: [number, number, number];
  vcp: [number, number, number];
}) {
  return (
    <>
      <DynamicCamera vsp={vsp} vrp={vrp} vup={vup} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.6} />
      </mesh>

      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#4a7dff"
        sectionSize={5}
        sectionColor="#6a6e94"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
        position={[0, 0.01, 0]}
      />

      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.6, 1.2]} />
        <meshStandardMaterial color="#4a7dff" />
      </mesh>

      <mesh position={vrp}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#40c080" />
      </mesh>

      <mesh position={vcp}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d09040" />
      </mesh>

      <Line points={[vsp, vrp]} color="#40c080" lineWidth={1} />
      <Line points={[vsp, vcp]} color="#d09040" lineWidth={1} />
    </>
  );
}

export function CameraPreview({ prefix, values, fallbacks }: CameraPreviewProps) {
  const f = fallbacks ?? {};
  const vspVec = readVector(values, prefix, 'vsp', f.vsp ?? [-6.5, 1.84, 0]);
  const vrpVec = readVector(values, prefix, 'vrp', f.vrp ?? [0, 0.6, 0]);
  const vupVec = readVector(values, prefix, 'vup', f.vup ?? [0, 1.0, 0]);
  const vcpVec = readVector(values, prefix, 'vcp', f.vcp ?? [0.75, 1.8, 0]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(80,90,160,0.1)',
      }}
    >
      <Canvas
        camera={{
          fov: 50,
          near: 0.1,
          far: 200,
          position: vspVec,
        }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene vsp={vspVec} vrp={vrpVec} vup={vupVec} vcp={vcpVec} />
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          target={vrpVec}
          minDistance={1}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}
