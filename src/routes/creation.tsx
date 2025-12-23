import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusCircle, Home } from 'lucide-react'
import { CreationHeader } from '../components/creation/layout/CreationHeader'
import { ProjectCard } from '../components/creation/ProjectCard'
import { GamificationCard, ActiveMissionCard, DailyChallengeCard } from '../components/creation/SidebarWidgets'

export const Route = createFileRoute('/creation')({
  component: CreationPage,
})

const projects = [
  {
    id: 1,
    title: 'Mars Colony Architect',
    description: 'Help astronauts design a sustainable base using AI generation tools. You will learn about environmental constraints and prompt engineering to create life-support structures.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXcwVFg7aPg76GNg2NNHcNmumxvN3zkda5hL0EXlEkrh4sWGF43tsucWTYP1b6cqRMNYlV3SNye3IZ-NAS2BOkcKT5iWtUz9zntACOsYW4sbr6DUA_L-c8IcEUvFzDTEbRzsuL4Y_qOykTk4weLVo3maszd4Mu8XlwXbZzcOPtJsmdn2yOReDmV0adh9A1RyZ9BglCYMOJA-_U-WfRcTJdRME4y3vAlturh6LhS9t_fhCKdPr8Z5cr8K8OSPMKWyX7kheVlGjeVZM',
    category: 'Engineering & AI',
    difficulty: 'Intermediate' as const,
    time: '45 Mins',
    students: '1.2k',
    type: 'PBL',
    stars: 5
  },
  {
    id: 2,
    title: 'AI Symphony Composer',
    description: 'Learn the basics of musical theory and use AI to compose your own unique soundtrack for a video game level.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_nKlT96payK2mTVnukR1UcgCaR3tbJ5TYMYbBrCpGoAWR63Wrx88aktmxe9h1TlViWhTcfSgBqAt76oSf2JC5hQYZ7AisQLxkGp0YbCLyUZxwc8FWjUpQ3nJHXptyYfqFh2xiLgOvYOShOILq-b3AhRQltxDZ3RGxhLUEJxjBbC3OWRPnK7bq4FeUTEz90KpUxvdDdLnxUu8a_LGLZack-a38JLkBkc7f-dIXz8ztIUhuenHfD6FDxWqkey2bBjk5b1BUAwDnQy4',
    category: 'Arts & Music',
    difficulty: 'Beginner' as const,
    time: '30 Mins',
    students: '850',
    type: 'Creative',
    stars: 5
  },
  {
    id: 3,
    title: 'Ancient History Chatbot',
    description: 'Bring history to life! Train a chatbot to speak like a historical figure using real source texts and prompt context.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRUYlrOv3AwUgHU6j7rO60aKtACZfYyLSqSKN5wPtetVvPZf0scFQOtu5PWcVHTHz0bUDMjjfGGaHg_X8Fe7el-JEHOmVZ_4AbVUdw7dZscYGxesNemy3SnHKRa51jyxjvI8sUm1E4w9CEo1yaO311gPqPeDbMVgEhLMjegBuj8UaAUjHnnHV03gs0g89Y__Zv0Og7L4XcGKTEWji4gSMdUc9MU9vf-gJKl6wPtu7iuE9b9j0HnS6b1-Um8pLMWjU-_eJON76q_E',
    category: 'Humanities',
    difficulty: 'Advanced' as const,
    time: '1 Hr 15 Mins',
    students: '530',
    type: 'Chatbot',
    stars: 5
  }
]

function CreationPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#121121] transition-colors duration-200 font-sans">
      <CreationHeader />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-[18px] h-[18px]" />
            Home
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Create (PBL)</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              创作坊 <span className="text-2xl md:text-3xl font-normal text-gray-500 dark:text-gray-400 opacity-60">Creation Workshop</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl">
              Embark on project-based learning missions. Use AI tools to solve real-world problems and build your portfolio.
            </p>
          </div>
          <button className="hidden md:flex bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/30 transition-all items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            New Custom Project
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Project Library (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <button className="group relative flex items-center justify-center gap-2 rounded-full bg-primary text-white px-5 py-2 transition-all">
                <span className="text-sm font-bold">All Missions</span>
              </button>
              {['Beginner', 'Intermediate', 'Advanced'].map((filter) => (
                <button 
                  key={filter}
                  className="group relative flex items-center justify-center gap-2 rounded-full bg-white dark:bg-surface-dark border border-transparent hover:border-primary/30 text-gray-500 dark:text-gray-400 px-5 py-2 transition-all shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-medium group-hover:text-primary">{filter}</span>
                </button>
              ))}
            </div>

            {/* Project List */}
            <div className="flex flex-col gap-5">
              {projects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Dashboard (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            <GamificationCard />
            <ActiveMissionCard />
            <DailyChallengeCard />
          </div>
        </div>
      </main>
    </div>
  )
}
