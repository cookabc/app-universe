import { ArrowRight, Clock, Signal, Star, Users } from 'lucide-react'

interface ProjectCardProps {
    image: string
    category: string
    title: string
    description: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    time: string
    students: string
    type?: string
    stars?: number
}

export function ProjectCard({
    image,
    category,
    title,
    description,
    difficulty,
    time,
    students,
    type,
    stars = 5,
}: ProjectCardProps) {
    return (
        <div className="group bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm hover:shadow-lg dark:border dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row gap-5">
                <div
                    className="w-full md:w-64 h-48 md:h-auto shrink-0 rounded-lg bg-cover bg-center overflow-hidden relative"
                    style={{ backgroundImage: `url("${image}")` }}
                >
                    {type && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                            {type}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-primary text-xs font-bold uppercase tracking-wider">{category}</p>
                            <div className="flex gap-1 text-amber-400">
                                {Array.from({ length: stars }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                            {title}
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                            {description}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                <Signal className="w-4 h-4" /> {difficulty}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                <Clock className="w-4 h-4" /> {time}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                <Users className="w-4 h-4" /> {students} Students
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                            View Details <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
