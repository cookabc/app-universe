'use client'

import { BrainIcon, FlaskConicalIcon, SchoolIcon, SirenIcon } from 'lucide-react'

const features = [
    {
        name: 'Cutting-edge Curriculum',
        description: 'Learn the latest in AGI research and development',
        icon: BrainIcon,
    },
    {
        name: 'Expert Instructors',
        description: 'Learn from leading researchers in the field of AI',
        icon: SchoolIcon,
    },
    {
        name: 'Hands-on Projects',
        description: 'Apply your knowledge to real-world AGI challenges',
        icon: FlaskConicalIcon,
    },
    {
        name: 'Innovation Focus',
        description: 'Stay ahead of the curve in AI technology',
        icon: SirenIcon,
    },
]

const HomePage = () => {
    return (
        <main className="relative z-10">
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Welcome to the future of</span>{' '}
                                    <span className="block text-blue-500 xl:inline">Artificial Intelligence</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Unlock the potential of Artificial General Intelligence at AGI School. Join us in
                                    shaping the future of AI technology.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow-sm">
                                        <a
                                            href="#"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            Get started
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-800 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Why Choose AGI School?
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {features.map((feature) => (
                                <div key={feature.name} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-400">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 bg-opacity-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to dive into AGI?</span>
                        <span className="block text-blue-500">Start your journey today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:shrink-0">
                        <div className="inline-flex rounded-md shadow-sm">
                            <a
                                href="#"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Enroll Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePage
