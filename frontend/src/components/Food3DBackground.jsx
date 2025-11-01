import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Float } from '@react-three/drei'

// Floating Food Items
function Pizza({ position, rotationSpeed = 0.01 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        {/* Pizza Base */}
        <mesh>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
          <meshStandardMaterial color="#F5DEB3" />
        </mesh>
        {/* Pizza Top */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
          <meshStandardMaterial color="#FF6347" />
        </mesh>
        {/* Pepperoni slices */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 0.7
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <mesh key={i} position={[x, 0.2, z]}>
              <circleGeometry args={[0.15, 16]} />
              <meshStandardMaterial color="#8B0000" />
            </mesh>
          )
        })}
      </Float>
    </group>
  )
}

function Burger({ position, rotationSpeed = 0.015 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.25
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
        {/* Bottom Bun */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
          <meshStandardMaterial color="#D4A574" />
        </mesh>
        {/* Patty */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.2, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Top Bun */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F4A460" />
        </mesh>
        {/* Lettuce */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.05, 32]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>
      </Float>
    </group>
  )
}

function Sushi({ position, rotationSpeed = 0.02 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Float speed={1.8} rotationIntensity={1} floatIntensity={2}>
        {/* Rice */}
        <mesh>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#FFF8DC" />
        </mesh>
        {/* Fish */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.4]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      </Float>
    </group>
  )
}

function Donut({ position, rotationSpeed = 0.018 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.rotation.z += rotationSpeed * 0.5
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh>
          <torusGeometry args={[0.5, 0.2, 16, 32]} />
          <meshStandardMaterial color="#DDA0DD" />
        </mesh>
        {/* Icing */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.5, 0.15, 16, 32]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>
        {/* Sprinkles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 0.55
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <mesh key={i} position={[x, 0.35, z]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
              <meshStandardMaterial color={['#FF0000', '#00FF00', '#0000FF', '#FFFF00'][i % 4]} />
            </mesh>
          )
        })}
      </Float>
    </group>
  )
}

function IceCream({ position, rotationSpeed = 0.012 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.25
    }
  })

  return (
    <group ref={meshRef} position={position}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={2.2}>
        {/* Cone */}
        <mesh rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.4, 1.2, 8]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        {/* Scoop 1 */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
        {/* Scoop 2 */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#87CEEB" />
        </mesh>
      </Float>
    </group>
  )
}

// Main Scene Component
function Scene() {
  const foodItems = useMemo(() => [
    { type: 'pizza', position: [-4, 2, -3], rotationSpeed: 0.01 },
    { type: 'burger', position: [4, 1.5, -4], rotationSpeed: 0.015 },
    { type: 'sushi', position: [-5, 0, -5], rotationSpeed: 0.02 },
    { type: 'donut', position: [5, 2.5, -3.5], rotationSpeed: 0.018 },
    { type: 'icecream', position: [-3, -1, -4], rotationSpeed: 0.012 },
    { type: 'pizza', position: [3, -0.5, -5], rotationSpeed: 0.014 },
    { type: 'burger', position: [-6, 1, -2], rotationSpeed: 0.016 },
    { type: 'sushi', position: [6, 0.5, -3], rotationSpeed: 0.019 },
  ], [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#FFE5B4" />
      
      {foodItems.map((item, index) => {
        switch (item.type) {
          case 'pizza':
            return <Pizza key={`pizza-${index}`} position={item.position} rotationSpeed={item.rotationSpeed} />
          case 'burger':
            return <Burger key={`burger-${index}`} position={item.position} rotationSpeed={item.rotationSpeed} />
          case 'sushi':
            return <Sushi key={`sushi-${index}`} position={item.position} rotationSpeed={item.rotationSpeed} />
          case 'donut':
            return <Donut key={`donut-${index}`} position={item.position} rotationSpeed={item.rotationSpeed} />
          case 'icecream':
            return <IceCream key={`icecream-${index}`} position={item.position} rotationSpeed={item.rotationSpeed} />
          default:
            return null
        }
      })}
      
      <fog attach="fog" args={['#ff6b6b', 15, 25]} />
    </>
  )
}

const Food3DBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Food3DBackground

