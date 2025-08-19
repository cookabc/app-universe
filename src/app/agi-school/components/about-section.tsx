import { BrainIcon, SchoolIcon } from 'lucide-react'
import Link from 'next/link'

export default function AboutSection() {
    return (
        <section id="courses" className="py-20 bg-background text-foreground">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">About Our School</h2>
                <div className="flex flex-col items-center">
                    <BrainIcon className="w-24 h-24 mb-4 text-primary" />
                    <p className="text-lg text-center max-w-2xl">
                        At AGI School, we are dedicated to advancing the field of Artificial General Intelligence. Our
                        cutting-edge curriculum and expert instructors provide students with the knowledge and skills
                        needed to shape the future of AI.
                    </p>
                    <Link
                        href="/agi-school/about"
                        className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded flex items-center"
                    >
                        <SchoolIcon className="mr-2" />
                        Learn More About Us
                    </Link>
                </div>
            </div>
        </section>
    )
}
