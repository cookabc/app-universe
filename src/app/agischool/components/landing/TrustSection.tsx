import { BookOpen, FlaskConical, School, ShieldCheck } from 'lucide-react'

export function TrustSection() {
    return (
        <section className="w-full border-y border-border bg-white dark:bg-card py-10 px-4 flex justify-center">
            <div className="max-w-[1200px] w-full flex flex-col items-center gap-8">
                <p className="text-sm font-bold text-text-muted dark:text-gray-400 uppercase tracking-wider text-center">
                    Trusted by 50+ Forward-Thinking Schools
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8" /> TechHigh
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <School className="w-8 h-8" /> FutureAcad
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <BookOpen className="w-8 h-8" /> STEM Prep
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <FlaskConical className="w-8 h-8" /> InnovateK12
                    </div>
                </div>
            </div>
        </section>
    )
}
