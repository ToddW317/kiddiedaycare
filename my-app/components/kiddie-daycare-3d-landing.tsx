'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, RoundedBox } from '@react-three/drei'
import { Vector3, Quaternion, Euler } from 'three'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Baby, Book, Palette, Send, Sun, Star, Moon, Clock, Users, Award, Smile, Heart, Coffee, Music } from 'lucide-react'
import { OrbitControls } from "@react-three/drei";
import { Mesh, Group, Material, BufferGeometry } from 'three'

const colors = [
  '#FF6B6B', // Warm red
  '#4ECDC4', // Turquoise
  '#FFD93D', // Bright yellow
  '#95E1D3'  // Mint green
]

interface BlockProps {
  position: [number, number, number]
  color: string
  parentRotation: React.MutableRefObject<{ x: number; y: number }>
}

function Block({ position, color, parentRotation }: BlockProps) {
  const meshRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && parentRotation.current) {
      meshRef.current.rotation.x = parentRotation.current.x
      meshRef.current.rotation.y = parentRotation.current.y
    }
  })

  return (
    <group position={position}>
      {/* Single block with rounded edges */}
      <RoundedBox
        args={[1, 1, 1]}
        radius={0.05}
        smoothness={4}
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          roughness={0.8} // Increased roughness for a matte finish
          metalness={0} // Removed metalness for no shine
        />
      </RoundedBox>
    </group>
  )
}

interface PyramidProps {
  onReveal: () => void
}

function Pyramid({ onReveal }: PyramidProps) {
  const groupRef = useRef<Group>(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Adjusted positions for tighter stacking
  const positions = [
    [0, 0.9, 0],       // Top block - lowered closer to base
    [-0.52, 0, -0.3],  // Bottom left - moved closer to center
    [0.52, 0, -0.3],   // Bottom right - moved closer to center
    [0, 0, 0.6]        // Bottom back - moved closer to center
  ]

  // Continuous rotation animation
  useFrame((state, delta) => {
    if (!isAnimating && groupRef.current) {
      rotationRef.current.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
      rotationRef.current.y += delta * 0.3
      groupRef.current.rotation.x = rotationRef.current.x
      groupRef.current.rotation.y = rotationRef.current.y
    }
  })

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      const duration = 2000
      const startTime = Date.now()

      // Calculate random directions for each block
      const directions = positions.map((_, index) => {
        const angle = (index * Math.PI * 2) / positions.length // Evenly space initial angles
        return new Vector3(
          Math.cos(angle + Math.random() * 0.5),
          Math.random() * 2 - 1,
          Math.sin(angle + Math.random() * 0.5)
        ).normalize()
      })

      const initialPositions = positions.map(pos => new Vector3(...pos))
      const targetPositions = positions.map((_, index) => {
        return new Vector3().copy(initialPositions[index])
          .add(directions[index].multiplyScalar(10))
      })

      const initialRotations = positions.map(() => new Quaternion())
      const targetRotations = positions.map(() => new Quaternion().setFromEuler(
        new Euler(
          Math.random() * Math.PI * 4,
          Math.random() * Math.PI * 4,
          Math.random() * Math.PI * 4
        )
      ))

      const animate = () => {
        const elapsedTime = Date.now() - startTime
        const progress = Math.min(elapsedTime / duration, 1)
        const easeProgress = easeOutCubic(progress)

        if (groupRef.current && groupRef.current.children) {
          groupRef.current.children.forEach((child, index) => {
            const newPosition = new Vector3().lerpVectors(
              initialPositions[index],
              targetPositions[index],
              easeProgress
            )
            child.position.copy(newPosition)

            const newRotation = new Quaternion().slerpQuaternions(
              initialRotations[index],
              targetRotations[index],
              easeProgress
            )
            child.quaternion.copy(newRotation)
          })
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setTimeout(() => onReveal(), 500)
        }
      }

      animate()
    }
  }

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }

  return (
    <group ref={groupRef} onClick={handleClick}>
      {positions.map((position, index) => (
        <Block
          key={index}
          position={position as [number, number, number]}
          color={colors[index]}
          parentRotation={rotationRef}
        />
      ))}
    </group>
  )
}

interface SceneProps {
  onReveal: () => void
}

function Scene({ onReveal }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Pyramid onReveal={onReveal} />
    </>
  )
}

export default function Homepage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', { name, email, message })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 animate-fade-in">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">The Kiddie Daycare</h1>
            <ul className="flex space-x-6">
              <li><a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a></li>
              <li><a href="#programs" className="text-gray-600 hover:text-primary transition-colors">Programs</a></li>
              <li><a href="#facilities" className="text-gray-600 hover:text-primary transition-colors">Facilities</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/videos/kids-playing.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in text-center">
            Welcome to The Kiddie Daycare
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
            Nurturing young minds in a safe, fun, and educational environment
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Schedule a Tour
          </Button>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-24">
        <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Book size={36} />, title: "Playful Learning", description: "Our curriculum is designed to make learning fun and engaging for every child." },
            { icon: <Palette size={36} />, title: "Creative Expression", description: "We encourage children to express themselves through art, music, and imaginative play." },
            { icon: <Baby size={36} />, title: "Nurturing Care", description: "Our experienced staff provides loving attention to every child's unique needs." },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 text-primary">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </section>

        <section id="programs">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Sun size={24} />, title: "Toddler Mornings", age: "1-2 years", description: "Early development activities focusing on sensory experiences and basic social skills." },
              { icon: <Star size={24} />, title: "Preschool Adventures", age: "3-4 years", description: "Preparatory learning experiences including early literacy, numeracy, and creative activities." },
              { icon: <Moon size={24} />, title: "After-School Explorers", age: "5-6 years", description: "Engaging after-school activities that complement school curricula with fun, educational projects." },
            ].map((program, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="mr-4 text-primary">{program.icon}</div>
                  <h3 className="text-xl font-semibold">{program.title}</h3>
                </div>
                <p className="text-sm mb-2 text-gray-500">Age: {program.age}</p>
                <p className="text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="facilities">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Indoor Spaces</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><Heart className="text-primary mr-2" size={20} /> Cozy reading nooks</li>
                <li className="flex items-center"><Palette className="text-primary mr-2" size={20} /> Art studio</li>
                <li className="flex items-center"><Music className="text-primary mr-2" size={20} /> Music room</li>
                <li className="flex items-center"><Coffee className="text-primary mr-2" size={20} /> Nap areas</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Outdoor Areas</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><Sun className="text-primary mr-2" size={20} /> Playground with safe equipment</li>
                <li className="flex items-center"><Smile className="text-primary mr-2" size={20} /> Sandbox and water play area</li>
                <li className="flex items-center"><Palette className="text-primary mr-2" size={20} /> Nature exploration zone</li>
                <li className="flex items-center"><Baby className="text-primary mr-2" size={20} /> Toddler-specific play area</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">What Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Sarah M.", quote: "The Kiddie Daycare has been a second home for my daughter. The staff is incredibly caring and the programs are engaging." },
              { name: "John D.", quote: "I'm amazed at how much my son has learned and grown since joining. The facilities are top-notch and always clean." },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md italic">
                <p className="mb-4">"{testimonial.quote}"</p>
                <p className="text-right font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><Clock className="text-primary mr-2" size={20} /> Hours: Monday-Friday, 7:00 AM - 6:00 PM</li>
                <li className="flex items-center"><Users className="text-primary mr-2" size={20} /> Ages: 1-6 years</li>
                <li className="flex items-center"><Award className="text-primary mr-2" size={20} /> Licensed and accredited facility</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea
                  id="message"
                
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md text-lg flex items-center justify-center transition-colors">
                <Send className="mr-2" size={20} />
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 py-6 mt-24">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 The Kiddie Daycare. All rights reserved.</p>
          <p className="mt-2">123 Sunshine Lane, Happyville, USA 12345 | Phone: (555) 123-4567 | Email: info@kiddiedaycare.com</p>
        </div>
      </footer>
    </div>
  )
}

export function KiddieDaycare_3dLanding() {
  const [showHomepage, setShowHomepage] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const [transitionText, setTransitionText] = useState("Click the pyramid to enter")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleReveal = () => {
    setIsTransitioning(true)
    setTransitionText("Welcome to our magical daycare! ✨")
    setShowHomepage(true)
    setTimeout(() => {
      setOpacity(1)
    }, 1000)
  }

  return (
    <div className="w-full h-screen relative bg-gray-900">
      {/* Homepage with initial opacity 0 */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: opacity }}
      >
        <Homepage />
      </div>

      {/* 3D Scene overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${showHomepage ? 'pointer-events-none' : ''}`}
        style={{ opacity: showHomepage ? 0 : 1 }}
      >
        <Canvas 
          camera={{ 
            position: [0, 2, 8],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
        >
          <Scene onReveal={handleReveal} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className={`text-white text-2xl ${isTransitioning ? 'animate-bounce' : 'animate-pulse'}`}>
            {transitionText}
          </p>
        </div>
      </div>
    </div>
  )
}