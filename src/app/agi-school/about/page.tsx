'use client'

import { BrainIcon, FlaskConicalIcon, SchoolIcon, SirenIcon, UsersIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        <div>
            <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">About</span>{' '}
                    <span className="block text-primary xl:inline">AGI School</span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    We are pioneers in the field of Artificial General Intelligence education. Our mission is to equip
                    the next generation of AI researchers and developers with the knowledge and skills to push the
                    boundaries of what's possible.
                </p>
            </div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Values</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                            What Makes Us Unique
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature) => (
                                <Card key={feature.name}>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <CardTitle>{feature.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
