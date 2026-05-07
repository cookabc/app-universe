'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function StudentWork() {
    const { t } = useTranslation()
    const projects = [
        {
            title: 'Cyber City Concept',
            author: 'Alex, Grade 10',
            tag: 'Generative Art',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPx1GHLUDXkOmIeR3r5oFBMA4R6VcprXeen3qusREcrLdTQWdq1jk337p7G1L8IRn6AxeJXTHHm0FsY3AnhekRNSTgQpRqtlIcJLbKnBi3rzlUMo14IXOys12nKPFFreZ1b6_2PM83H-J6WfDfebJEx9HX8Sm-jZNpSr26aYEFJ_PmJfkyNCw6MzjHUGkZetmCdHU8jvT4xQ-p5XTZQJsrIK9txrQLYa98xBK1ti0dVmnCrzcnlJZqT5o4NFTSJYYiuGXRxKlaMF8',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9PSgsnSHgm4R8IF8NMOJh8B4QRlUrtQgV-1vGwLLPGebGP2VpbXh8fypMAnE0aPnxZ3Wh5nnyNIC4cnKY1y2LkNoe3lMfSxCT2m4QNy0WHuURJaH-MrxiUmLn4MDMuex_HX_IIupeeAgKOHDMrx7jKfJ7khA-EVgTNkzn-0AvlguCgaJHqANi8JtlneL63IUUn57Wg4eMO4FlPfwmPjWp45DlSOCmv2mZpc4koSL0VrbkvgX_iznykQzs1UkdwHHFTsOSHf52oq0',
        },
        {
            title: 'Homework Helper Bot',
            author: 'Sarah, Grade 8',
            tag: 'NLP',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdkb_Nig2bMjZnRG_6996NHYutsEiMQElEhFtfSVzOoeagPzySK039B_bcU5njxsIlO9bTcdpgaTBJLufgXy0QLwykxQQ3FSCd3ETSLdPH_DYqcm_Y1rCA2llRys63U5DEFA6QNGObmJjEOL9TJrhD4-zUW9aeyjWLcVLj_FFll-kA6DvreKFwgDQn0cnfP_oW_m6FGAdBOHeYcTw8L5WCFuBPVRrW6no87uai2u-fAW_JiQmn5iEq-7FdwUukXHLSEPfIQq1Bm6Y',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfzzbs7QN8EhIagQ36oupKq-sVpUIu3sXLecu5sNgVd0JtUZIUjFsAFSlg5evVCk3Oo0QpHdLMlziHGLnXeXkrl7yu9o2M-o3wBV1GkI-fq3ckdQ7F5AFCl2AuEAsWK6rP6p-6u-unVVZBTPZQQ7kLhe2ykASU6H-yT9WARA1acvlLQX0Dxf1UWp_kT1428TVkuM-9WQGyg8Ui2T42Y1qwPhlnWc0A2hbsMI7_JsFvEhlbkEkeJO3a_1QaOuDRJ7RW5Xm_sXsKVig',
        },
        {
            title: 'Recycle Sorter AI',
            author: 'Marcus, Grade 11',
            tag: 'Computer Vision',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLKTb57IFCnATmy0y79fS9ivgnP1czY8eW3tSHD8B0I0VZ5uxK-m3fxkqxL3Ov7LSmV5vgrdoEq1iHKJxJTP6LScHBODbYVm-WwgQ-uNBfCN9hcAZ0HYmrx6cFyORoOdPl6_XoDM-sZDJmC4pN8NCN7VtBXAtAQa5864cjsC463Az6uKRfjTGSoZ4lCSJ-OSP77OpJOtxF_7QMd0O-P_XCwHnBNDT-AWxVjxgxTWBYJ8tMLdT1ICpTr5V70aOFpp26RHgX1nG5sXE',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Rfbpmt48zHmQakB-q_K0mcDk2-LtMULwVJwT1X6wcllLk6BNUdFvFgBEWwpfAN6dktQrDsGeRH_aUyuDw2m_WRGgd0qd-5coyYWwCSPiTdbm_3v-ZuF2atHhszpSJ8Rgj62l9oMNtNZzv2CSJL5uJIv0dd1GS3-LCTDkQ7iAwHatkBXrNt87irX3JkV7AuMUnJAXsxTrS2-aQgWe3GtwB01HvwH0nnf0IuFZwQ1LgJl7lvxyaQrWO-A-SZqheyakqdlNpdFzIek',
        },
    ]

    return (
        <section className="w-full bg-background-light dark:bg-background-dark py-20 px-4 flex justify-center">
            <div className="max-w-[1200px] w-full flex flex-col gap-10">
                <div className="flex flex-col items-center text-center gap-4">
                    <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-white">
                        {t('agischool.studentWork.title')}
                    </h2>
                    <p className="text-lg text-text-muted dark:text-gray-400 max-w-[600px]">
                        {t('agischool.studentWork.subtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <div key={index} className="group cursor-pointer flex flex-col gap-3">
                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm relative">
                                <div
                                    className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url("${project.image}")` }}
                                ></div>
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                                    {project.tag}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-8 rounded-full bg-gray-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url("${project.avatar}")` }}
                                ></div>
                                <div>
                                    <h4 className="text-sm font-bold text-text-main dark:text-white leading-tight">
                                        {project.title}
                                    </h4>
                                    <p className="text-xs text-text-muted dark:text-gray-400">by {project.author}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <button className="flex items-center gap-2 text-primary font-bold hover:underline">
                        {t('agischool.studentWork.viewAll')} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}
