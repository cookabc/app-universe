import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/landing/Hero'
import { TrustSection } from '@/components/landing/TrustSection'
import { FeatureMatrix } from '@/components/landing/FeatureMatrix'
import { GamifiedJourney } from '@/components/landing/GamifiedJourney'
import { StudentWork } from '@/components/landing/StudentWork'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeatureMatrix />
      <GamifiedJourney />
      <StudentWork />
    </>
  )
}
