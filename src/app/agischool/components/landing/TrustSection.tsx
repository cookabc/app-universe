import { BookOpen, FlaskConical, School, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TrustSection() {
    const { t } = useTranslation()
    const schools = t('agischool.trust.schools', { returnObjects: true }) as string[]
    return (
        <section className="w-full border-y border-border bg-white dark:bg-card py-10 px-4 flex justify-center">
            <div className="max-w-[1200px] w-full flex flex-col items-center gap-8">
                <p className="text-sm font-bold text-text-muted dark:text-gray-400 uppercase tracking-wider text-center">
                    {t('agischool.trust.title')}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8" /> {schools[0] || ''}
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <School className="w-8 h-8" /> {schools[1] || ''}
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <BookOpen className="w-8 h-8" /> {schools[2] || ''}
                    </div>
                    <div className="text-2xl font-black text-text-main dark:text-white flex items-center gap-2">
                        <FlaskConical className="w-8 h-8" /> {schools[3] || ''}
                    </div>
                </div>
            </div>
        </section>
    )
}
