/**
 * [INPUT]: 依赖 landing 组件模块
 * [OUTPUT]: 对外提供首页路由组件
 * [POS]: routes/ 的首页路由，Landing Page 组合
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/landing/Hero'
import { TrustSection } from '@/components/landing/TrustSection'
import { FeatureMatrix } from '@/components/landing/FeatureMatrix'
import { GamifiedJourney } from '@/components/landing/GamifiedJourney'
import { StudentWork } from '@/components/landing/StudentWork'
import { FinalCTA } from '@/components/landing/FinalCTA'

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
      <FinalCTA />
    </>
  )
}
