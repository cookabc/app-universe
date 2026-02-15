import { Construction } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description?: string
}

export function ComingSoon({ title, description = "This feature is currently under development." }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="bg-primary/10 p-4 rounded-full">
        <Construction className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">{description}</p>
    </div>
  )
}
