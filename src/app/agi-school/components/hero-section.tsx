import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative py-20 bg-gradient-to-br from-background to-secondary text-foreground">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to AGI School</h1>
                <p className="text-xl mb-8">Shaping the Future of Artificial General Intelligence</p>
                <Link
                    href="#courses"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                >
                    Explore Courses
                </Link>
            </div>
        </section>
    )
}
