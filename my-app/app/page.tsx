'use client'

import dynamic from 'next/dynamic'

// Dynamically import the 3D component with no SSR
const KiddieDaycare3DLanding = dynamic(
  () => import('@/components/kiddie-daycare-3d-landing'),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <KiddieDaycare3DLanding />
    </main>
  )
}