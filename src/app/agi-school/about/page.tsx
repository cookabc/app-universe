'use client'

import { BrainIcon, FlaskConicalIcon, SchoolIcon, SirenIcon, UsersIcon } from 'lucide-react'

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
    {
        name: 'Collaborative Community',
        description: 'Connect with peers and mentors in our vibrant community',
        icon: UsersIcon,
    },
]

const AboutPage = () => {
    return (
        <main className="relative z-10">
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">About</span>{' '}
                                    <span className="block text-blue-500 xl:inline">AGI School</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    We are pioneers in the field of Artificial General Intelligence education. Our mission
                                    is to equip the next generation of AI researchers and developers with the knowledge
                                    and skills to push the boundaries of what's possible.
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-800 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Our Values</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            What Makes Us Unique
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
        </main>
    )
}

export default AboutPage
