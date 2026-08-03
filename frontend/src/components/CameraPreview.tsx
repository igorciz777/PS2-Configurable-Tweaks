import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { TweakValues } from '../fields';
import type { TransformField } from '../fields';

interface CameraPreviewProps {
  fields: TransformField[];
  values: TweakValues;
}

function readVector(
  values: TweakValues,
  prefix: string,
  fallback: [number, number, number],
): [number, number, number] {
  return [
    (values[`${prefix}X`] as number) ?? fallback[0],
    (values[`${prefix}Y`] as number) ?? fallback[1],
    (values[`${prefix}Z`] as number) ?? fallback[2],
  ];
}

function DynamicCamera({
  vcp,
  vsp,
  vup,
}: {
  vcp: [number, number, number];
  vsp: [number, number, number];
  vup: [number, number, number];
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(vcp[0], vcp[1], vcp[2]);
    camera.up.set(vup[0], vup[1], vup[2]);
    camera.lookAt(new THREE.Vector3(vsp[0], vsp[1], vsp[2]));
    camera.updateProjectionMatrix();
  });

  return null;
}

function Scene({
  vcp,
  vsp,
  vup,
  vrp,
}: {
  vcp: [number, number, number];
  vsp: [number, number, number];
  vup: [number, number, number];
  vrp: [number, number, number];
}) {
  return (
    <>
      <DynamicCamera vcp={vcp} vsp={vsp} vup={vup} />

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

      <mesh position={vsp}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#40c080" />
      </mesh>

      <mesh position={vrp}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d09040" />
      </mesh>

      <Line points={[vcp, vsp]} color="#40c080" lineWidth={1} />
      <Line points={[vcp, vrp]} color="#d09040" lineWidth={1} />
    </>
  );
}

export function CameraPreview({ fields, values }: CameraPreviewProps) {
  const findField = (id: string) => fields.find(f => f.id === id);

  const vsp = findField('vsp');
  const vrp = findField('vrp');
  const vup = findField('vup');
  const vcp = findField('vcp');

  const vspVec = readVector(values, 'vsp', vsp?.default ?? [-6.5, 1.84, 0]);
  const vrpVec = readVector(values, 'vrp', vrp?.default ?? [0, 0.6, 0]);
  const vupVec = readVector(values, 'vup', vup?.default ?? [0, 1.0, 0]);
  const vcpVec = readVector(values, 'vcp', vcp?.default ?? [0.75, 1.8, 0]);

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
          position: vcpVec,
        }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene vcp={vcpVec} vsp={vspVec} vup={vupVec} vrp={vrpVec} />
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          target={vspVec}
          minDistance={1}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}
