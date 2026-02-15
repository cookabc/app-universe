import { Gamepad2, Play } from 'lucide-react'

export function GamifiedJourney() {
  const steps = [
    {
      id: 1,
      title: "Learn the Basics",
      desc: "Interactive tutorials explaining AI concepts."
    },
    {
      id: 2,
      title: "Complete Quests",
      desc: "Solve puzzles using AI tools to unlock next levels."
    },
    {
      id: 3,
      title: "Build Projects",
      desc: "Create a final project to showcase in your portfolio."
    }
  ]

  return (
    <section className="w-full bg-white dark:bg-surface-dark py-20 px-4 flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase text-primary tracking-wide">Gamified Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight text-text-main dark:text-white">
            Level Up Your Skills Step by Step
          </h2>
          <p className="text-lg text-text-muted dark:text-gray-400">
            No boring lectures. Our platform adapts to your pace, rewarding you with badges and XP as you complete real-world challenges.
          </p>
          <div className="flex flex-col gap-4 mt-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl bg-background-light dark:bg-background-dark border border-transparent hover:border-primary/30 transition-colors">
                <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">{step.id}</div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white">{step.title}</h4>
                  <p className="text-sm text-text-muted dark:text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border-4 border-gray-200 dark:border-gray-800">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBp6EzZK-38XrU8chnISsKrBCkD6_pIkhdpFny80_njxW4UNPTEewugtlhc9F1wDZw1uQJlPuJDsAdfNTL5SJFzMaadgDM5TrPQmOgZKTQZt55_EGU0pJH8FwyfW75ArG5e7OcjuMjZardob3tZY8bRDFlUBK3Y7J6HudMfxGnFFx32JIyTtpg6_GAMq44-P77GFGpQi9MW76tu_nuCYN5mx5ME0p0mDcEMvNQO4tEUoW_46WXpaduo8DWiw9wRh3BYRpndVNViJhA")'}}></div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="size-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
