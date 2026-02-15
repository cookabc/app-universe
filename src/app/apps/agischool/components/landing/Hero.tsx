/**
 * [INPUT]: 依赖 lucide-react 图标、shadcn/ui Button/Badge 组件、FadeIn 动画组件
 * [OUTPUT]: 对外提供 Hero 首屏营销组件（带动画）
 * [POS]: landing/ 的核心转化组件，展示价值主张和 CTA
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { FadeIn } from '../common/FadeIn'

export function Hero() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark py-12 lg:py-20 px-4 flex justify-center">
      <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 lg:order-1 order-2">
          <FadeIn>
            <div className="flex flex-col gap-4 text-left">
              <Badge variant="secondary" className="inline-flex items-center gap-2 self-start w-fit bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">AI for Future Creators</span>
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-text-main dark:text-white">
                Unlock Your <br/>
                <span className="text-primary">AI Superpowers</span> Today
              </h1>

              <p className="text-lg text-text-muted dark:text-gray-300 max-w-[540px] leading-relaxed">
                The systematic AI literacy platform for K12 students. Learn through gamified paths, master real tools, and build projects that matter.
              </p>
            </div>
          </FadeIn>

          {/* CTA Buttons - 微拟物渐变样式 */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button variant="gradient" size="lg" className="gap-2">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 h-12 px-8 rounded-xl">
                <PlayCircle className="w-5 h-5" />
                <span>Watch Demo</span>
              </Button>
            </div>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={0.2}>
            <div className="flex items-center gap-3 mt-4 text-sm text-text-muted dark:text-gray-400">
              <div className="flex -space-x-2">
                <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgyWlPV0as9whzhV1NH6emO5N_8U3k6LPqd5RJEtjKTiPN6OyLcELDca9VcF98iZCDTeGyTT_oungYcbL2zFjvjyuxyrCuffdWYuCsA8kND8-TBseu1H9zGIfPF9rwrG_BFls1xGDL2VPA_a061oOMRkdn_hsTUg6i-ElD6z-p_hzecJo8wQRVsYpv-RYHYAsf2t7a7gufxrTyn16TaM1-DS4U4f6PMy4kOfJ744ISDCyYd7BrLIyUqHTiB0ezy9CBG2UZAwYE7i0")'}}></div>
                <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKq7GlHEwPGUOX5Vb5tKrXlqSw6tq-XAyESDXLma_ejmHGFSIVH4SLnkxtV4GRVOiImx45Jxv4YLAUs3ZJCRKECxPGrBG0QLStwcw7yxOa2zEFaZRxACg0RCSd_e6syC_KIFX9ErxmZ6A_G9QE0aRw86SJ6XsyxeSYckFfJ38dVJRYjP-HhNmDJJ4gEeHCaUwhR7DXqYfI0yYHIUh-tNJpZw0A7_5EtzjPNbF2zxvOBJ2TlwrOJzOSz4uY2O8kNrKEGVOHZdAwMms")'}}></div>
                <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAp2Z0vCdpPFp_eYLGT6ywbBUgDOqIf9dDYntMNEdF2ANmWO8oGjkehwqip00Z4SpAomsL6A28pvhJeMVTLRgi5D_Ol0hCRa9QUeEymNIGWG-_Oh_AKY2ONMFirku8eSZgxZVrQOvvXbx3KWk59V2m8GEFL0VK2AV626WothST6rR_0KXchc-8iFczy5Lc77XogxMVGzuLF0GgWZjCxzX63wU7IP1A5PkCN-tEi32twON-4dWA_13IcPQEIJz1m1LaS6_clfODFrXc")'}}></div>
              </div>
              <p>Joined by 10,000+ students this month</p>
            </div>
          </FadeIn>
        </div>

        {/* Right Image */}
        <FadeIn delay={0.3} y={40}>
          <div className="w-full lg:order-2 order-1 flex justify-center relative">
            {/* Decorative blob background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-400/20 blur-3xl rounded-full scale-75 animate-pulse"></div>

            {/* Hero Image */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-surface-light dark:bg-surface-dark flex items-center justify-center">
              <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZJFeGc6cPMlEFk0F7HFNKF61zytpmAawe9cTJikM1gR1t3FbS9NJnzSykHHAiZmjsgkDvh1xkSIUanv7_G7PAUGfl9l287dX_RlJwp-fdHJyzXM50ZMT5QsH-1FfalEcekaecziMnjfLhS_GVKPIrVT8fdLp7sDoCo0XtDT7AcAYxoUIvMaeV1x5deZT7hFnYqwRlI-GlIwOSCo7-YFhN0rNc9KZmBkytgbGxz2LUpqJBI1xZLllTgQvFTrc1Wtf-8R6L2n4yZB4")'}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
