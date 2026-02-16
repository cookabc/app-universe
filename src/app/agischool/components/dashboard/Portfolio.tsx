import { ArrowRight, Eye, ImagePlus } from 'lucide-react'

export function Portfolio() {
    return (
        <section className="flex flex-col gap-4 pb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Portfolio</h2>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Portfolio Item 1 */}
                <div className="group flex flex-col gap-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPYGsgph5gQWKWvidP4sLDRKiyIJz0HxVLHURDSFYdPkxmwM5UK0yH5UKeC5WOMLPhmriyVUHllLvKMS0udCOt6-y5g_m2r__jySxYIh_D3dc_hXtsf698G0XwdnlEp5ZsuIrcfyqxXDbGVyOpVk26SqypZLXE9zUZ8n8V9JgplJvZDN11eeqnEq1jterI3wK0bXYYyRt3OIyo8R_F6BuAHLrO_t5AkVS1Pm_fsFqIl7E2GTTCgKBIaZNKF133a-wYf-a-bc6TYtY")',
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            Mars Colony Plan
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Project Based Learning</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Eye className="w-3.5 h-3.5" />
                                <span>234</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Portfolio Item 2 */}
                <div className="group flex flex-col gap-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZpPTj-M5vGVDWaAXi0bnrJv0BX-dj5kiZK2nAii2XY2csxKCKIuJT8hlBK_H8IRrrfTzUtkxyDXfaEJ-VezXAtZ5Z2WylG2ZlMro6rw3MWWgxET0UISr5gYlqK7UEAHvuDSSAlteG9a3ngyR0tY_lwCjVrZx-VjIyFcxEeGAes3fUgZTflX36TjmFdjIouco7etjWV4_XF95nd7-as3Xwwn4f8XeIz7jJIR3hhkXXKy6SCA2ED2Bb5msmZkUVgzJsueaMUM0ds28")',
                            }}
                        ></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            Eco-City Design
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sustainability</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Eye className="w-3.5 h-3.5" />
                                <span>189</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Portfolio Item 3 */}
                <div className="group flex flex-col gap-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBpbtu5HJiEU6OErasuKkAZ_An_Lp2xUFHn_HL8SZRe6WQn0XJt-8c_Qa95jrrBscG09MqfxlQBeDmYPivH-wrCi68ZhtKlMdM_iXIlL4sh1DqqRi7amRPXlW7RAfduDgFSIdg4f9PKBydTcOr4tMacjj-jxVWIFkO8Q-Tci6klbEpoVlQn7c1GHAFnZYfen66QdWR664wr_0CXJHnQiRAKnI5ymy9MdODqCkGe6kAd0mRuekeQ2VxDf1fZTqdZZdOhvKOmi9zsiac")',
                            }}
                        ></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            AI Storybook
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Creative Writing</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Eye className="w-3.5 h-3.5" />
                                <span>542</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Portfolio Item 4 (Placeholder) */}
                <div className="group flex flex-col gap-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                            <ImagePlus className="w-8 h-8" />
                            <span className="text-xs font-bold">Add New Project</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
