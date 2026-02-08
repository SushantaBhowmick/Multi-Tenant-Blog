import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Navbar from './Navbar'
import HeroSection from './HeroSection'

const Landing = () => {
  return (
    <div className='min-h-screen bg-background text-foreground selection:vg-primary/20 selection:text-primary'>
      {/* Top AnnounceMent */}
      <div className="w-full border-b bg-muted/50">
        <div className="mx-auto px-4 py-2 text-center text-sm">
            <Badge variant={'secondary'} className='mr-2'>New</Badge>
            Tenants API v2 with org-wide roles is live.
            <Button variant={'link'} className='px-1 align-baseline'>Read changelog →</Button>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      
    </div>
  )
}

export default Landing
