import type { AppData } from '@/data/apps'
import { motion } from 'framer-motion'

const AppCard = ({ app }: { app: AppData }) => (
    <motion.div
        key={app.name}
        className="relative overflow-hidden rounded-xl border border-gray-700 shadow-xl bg-black/10 backdrop-blur-sm"
        whileHover={{
            scale: 1.05,
            y: -5,
            backgroundImage: 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
        }}
        initial={{
            opacity: 0,
            y: 50,
            backgroundImage: 'none',
        }}
        animate={{
            opacity: 1,
            y: 0,
            backgroundImage: 'none',
        }}
        transition={{
            duration: 0.1,
            backgroundImage: { duration: 0 },
        }}
    >
        <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: app.color }}>
                    {app.name}
                </h3>
                <p className="text-gray-300/90">{app.description}</p>
            </div>
            <motion.a
                href={app.path}
                className="group inline-flex items-center justify-center px-4 py-2 mt-6 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 font-medium transition-all duration-200 ease-in-out"
                whileHover={{ scale: 1.02 }}
                title={`Open ${app.name}`}
            >
                <span className="mr-2">Open</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <title>Open</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </motion.a>
        </div>
    </motion.div>
)

export const AppGrid = ({ apps }: { apps: AppData[] }) => (
    <section className="px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apps.map((app) => (
            <AppCard key={app.name} app={app} />
        ))}
    </section>
)
