import { BrainIcon } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="relative z-10 bg-gray-800/50" aria-label="Primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/agi-school" className="text-2xl font-bold">
                            <div className="shrink-0">
                                <BrainIcon className="h-8 w-8 text-blue-500" />
                            </div>
                        </Link>
                        <div className="ml-4 text-xl font-bold">AGI School</div>
                    </div>
                    <div className="flex">
                        <Link
                            href="/agi-school"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-blue-400"
                        >
                            Home
                        </Link>
                        <Link
                            href="/agi-school#courses"
                            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-blue-400"
                        >
                            Courses
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
