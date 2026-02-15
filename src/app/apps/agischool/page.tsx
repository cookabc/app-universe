'use client'

import React from 'react'
import './globals.css'
import { Hero } from './components/landing/Hero'
import { TrustSection } from './components/landing/TrustSection'
import { FeatureMatrix } from './components/landing/FeatureMatrix'
import { GamifiedJourney } from './components/landing/GamifiedJourney'
import { StudentWork } from './components/landing/StudentWork'
import { FinalCTA } from './components/landing/FinalCTA'

export default function AGISchoolPlusPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Hero />
      <TrustSection />
      <FeatureMatrix />
      <GamifiedJourney />
      <StudentWork />
      <FinalCTA />
    </div>
  )
}
