export function KnowledgeRadar() {
    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-800 p-6 flex flex-col gap-4 col-span-1 lg:col-span-1">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Knowledge Radar</h2>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
                    +12% vs last month
                </span>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center relative py-4">
                <svg
                    className="w-full max-w-[280px]"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 478 200"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background grid for radar */}
                    <path d="M236 21 L36 109 L236 197 L436 109 Z" fill="none" stroke="#e5e7eb" strokeWidth="1"></path>
                    <path d="M236 41 L72 109 L236 177 L400 109 Z" fill="none" stroke="#e5e7eb" strokeWidth="1"></path>

                    {/* Actual chart shape */}
                    <polygon
                        fill="rgba(80, 72, 229, 0.2)"
                        points="236,40 380,80 340,160 130,160 90,80"
                        stroke="#5048e5"
                        strokeWidth="2"
                    ></polygon>

                    {/* Labels */}
                    <text
                        className="dark:fill-gray-400"
                        fill="#545095"
                        fontSize="24"
                        textAnchor="middle"
                        x="236"
                        y="25"
                    >
                        Logic
                    </text>
                    <text className="dark:fill-gray-400" fill="#545095" fontSize="24" textAnchor="start" x="420" y="80">
                        Coding
                    </text>
                    <text
                        className="dark:fill-gray-400"
                        fill="#545095"
                        fontSize="24"
                        textAnchor="middle"
                        x="360"
                        y="190"
                    >
                        Creativity
                    </text>
                    <text
                        className="dark:fill-gray-400"
                        fill="#545095"
                        fontSize="24"
                        textAnchor="middle"
                        x="110"
                        y="190"
                    >
                        Ethics
                    </text>
                    <text className="dark:fill-gray-400" fill="#545095" fontSize="24" textAnchor="end" x="50" y="80">
                        Analysis
                    </text>
                </svg>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">High Proficiency</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Top 10% in Logic & Coding</p>
            </div>
        </section>
    )
}
