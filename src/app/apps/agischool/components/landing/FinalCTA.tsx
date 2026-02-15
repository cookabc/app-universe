/**
 * [INPUT]: 依赖 lucide-react 图标、shadcn/ui Button 组件
 * [OUTPUT]: 对外提供 FinalCTA 最终行动号召组件
 * [POS]: landing/ 的转化组件，页面底部 CTA
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

export function FinalCTA() {
  return (
    <section className="w-full py-20 md:py-28 px-4 flex justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 -z-10" />
      <div className="absolute inset-0 bg-background-light dark:bg-background-dark/90 -z-10" />

      <div className="max-w-4xl w-full text-center relative">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 size-20 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 size-20 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wide text-primary">
            Start Your AI Journey Today
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-text-main dark:text-white mb-6">
          Ready to Unlock Your
          <span className="block text-primary mt-2">AI Superpowers?</span>
        </h2>

        {/* Description */}
        <p className="text-lg text-text-muted dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Join 10,000+ students already mastering AI skills. Start with free tutorials,
          then unlock premium projects and personalized learning paths.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="gradient" size="lg" className="gap-2 h-14 px-8 text-base rounded-xl">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-xl">
            View Pricing
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="text-sm text-text-muted dark:text-gray-500 mt-8">
          No credit card required • Cancel anytime • 14-day free trial
        </p>
      </div>
    </section>
  )
}
