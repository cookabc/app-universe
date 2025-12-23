import { School, Twitter, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-[#e8e8f3] dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-6 flex items-center justify-center rounded bg-primary/10 text-primary">
                <School className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold">AGISchool</h2>
            </div>
            <p className="text-sm text-text-muted dark:text-gray-400">
              Empowering the next generation of innovators with AI literacy.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Platform</h3>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">Courses</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">Projects</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">For Schools</a>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Company</h3>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">About Us</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">Careers</a>
            <a className="text-sm text-text-muted dark:text-gray-400 hover:text-primary" href="#">Blog</a>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">Stay Updated</h3>
            <div className="flex gap-2">
              <input className="flex-1 h-10 px-3 rounded-lg border border-[#d2d1e6] dark:border-gray-700 bg-background-light dark:bg-background-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Enter your email" type="email"/>
              <button className="h-10 px-4 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#e8e8f3] dark:border-gray-800">
          <p className="text-sm text-text-muted dark:text-gray-500">© 2024 AGISchool. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-text-muted dark:text-gray-500 hover:text-primary" href="#">
              <span className="sr-only">Twitter</span>
              <Twitter className="w-5 h-5" />
            </a>
            <a className="text-text-muted dark:text-gray-500 hover:text-primary" href="#">
              <span className="sr-only">GitHub</span>
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
