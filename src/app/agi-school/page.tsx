import { BookOpen, Cpu, Users, Zap } from 'lucide-react'

export default function Home() {
    const features = [
        {
            icon: Cpu,
            title: 'Cutting-edge Curriculum',
            description: 'Learn the latest in AGI technologies and theories',
        },
        {
            icon: BookOpen,
            title: 'Expert Instructors',
            description: 'Learn from leading researchers and practitioners in the field',
        },
        {
            icon: Users,
            title: 'Collaborative Environment',
            description: 'Work on real-world projects with peers and mentors',
        },
        {
            icon: Zap,
            title: 'Hands-on Experience',
            description: 'Gain practical skills through our state-of-the-art AI labs',
        },
    ]
    return (
        <main className="flex-grow">
            <section className="relative text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to AGI School</h1>
                    <p className="text-xl mb-8">Shaping the Future of Artificial General Intelligence</p>
                    <a href="#courses" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Explore Courses
                    </a>
                </div>
            </section>
            <section id="courses" className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose AGI School?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg">
                                <feature.icon className="w-12 h-12 mb-4 text-blue-400" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
