'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Baby, Book, Palette, Send, Sun, Star, Moon, Clock, Users, Award, Smile, Heart, Coffee, Music } from 'lucide-react'
import { useState } from 'react'

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
        {/* ... rest of the header content ... */}
      </header>

      <section className="relative h-screen w-full overflow-hidden">
        {/* ... rest of the sections ... */}
      </section>

      <main className="container mx-auto px-4 py-12 space-y-24">
        {/* ... rest of the main content ... */}
      </main>

      <footer className="bg-gray-100 py-6 mt-24">
        {/* ... footer content ... */}
      </footer>
    </div>
  )
} 