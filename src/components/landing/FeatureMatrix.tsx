import { Palette, Bot, Eye, BarChart3 } from 'lucide-react'

export function FeatureMatrix() {
  const features = [
    {
      title: "Generative Art",
      desc: "Create stunning visuals from text prompts. Learn diffusion models.",
      tools: "15 Tools",
      icon: <Palette className="w-7 h-7" />,
      colorClass: "bg-purple-100 dark:bg-purple-900/30 text-primary"
    },
    {
      title: "Smart Chatbots",
      desc: "Build your own AI assistant using LLMs. Understand prompt engineering.",
      tools: "8 Tools",
      icon: <Bot className="w-7 h-7" />,
      colorClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
    },
    {
      title: "Computer Vision",
      desc: "Teach computers to see. Face detection and object recognition projects.",
      tools: "12 Tools",
      icon: <Eye className="w-7 h-7" />,
      colorClass: "bg-green-100 dark:bg-green-900/30 text-green-600"
    },
    {
      title: "Data Science",
      desc: "Analyze trends like a pro. Turn raw data into actionable insights.",
      tools: "10 Tools",
      icon: <BarChart3 className="w-7 h-7" />,
      colorClass: "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
    }
  ]

  return (
    <section className="w-full bg-background-light dark:bg-background-dark py-20 px-4 flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-[720px]">
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white">
            Master the AI Capability Matrix
          </h2>
          <p className="text-lg text-text-muted dark:text-gray-400">
            Explore our comprehensive modules designed to take you from novice to expert. Build a diverse portfolio of AI skills.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group relative flex flex-col gap-4 rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20">
              <div className={`size-12 rounded-xl flex items-center justify-center ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main dark:text-white">{feature.title}</h3>
                <p className="text-sm text-text-muted dark:text-gray-400">{feature.desc}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-300">{feature.tools}</span>
                <span className="text-xs font-medium text-primary cursor-pointer group-hover:underline">View Module</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
