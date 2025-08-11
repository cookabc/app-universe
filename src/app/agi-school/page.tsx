import Link from 'next/link'
import { BrainIcon, SchoolIcon } from 'lucide-react'

export default function Home() {
    return (
        <section className="grow">
            <section className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to AGI School</h1>
                    <p className="text-xl mb-8">Shaping the Future of Artificial General Intelligence</p>
                    <Link
                        href="#courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Explore Courses
                    </Link>
                </div>
            </section>
            <section id="courses" className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">About Our School</h2>
                    <div className="flex flex-col items-center">
                        <BrainIcon className="w-24 h-24 mb-4 text-blue-400" />
                        <p className="text-lg text-center max-w-2xl">
                            At AGI School, we are dedicated to advancing the field of Artificial General Intelligence.
                            Our cutting-edge curriculum and expert instructors provide students with the knowledge and
                            skills needed to shape the future of AI.
                        </p>
                        <Link
                            href="/agi-school/about"
                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <SchoolIcon className="mr-2" />
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    )
}
