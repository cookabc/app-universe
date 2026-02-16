import { Plus } from 'lucide-react'

export function DataCollection() {
    const catImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXDT0EO--mab8OwGIO3YQHaeIMjjeZLgoLY1TG80HFlKs7zIFMooUCnycpWWlbz-ctFV1DJged6wJcAngPrklx3rzANWG5hAtwzEykj5t8fuvpT8T5s0OAL_XcuzYuWju5PVQm_Y5W5YFw-EBjQyYPkNvM4GZsiFXCCQsWUL3QCRerZtuJ9PTG5wgnEuEFKT0CoelBmSD14qTteTmcv-wXtgCAfeg_s287jlgKui87ImIFVf61v1yI23MPdDkbl4euZc9hnHTT0cs',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDCU6zVOt0qL4kspvlR-5n_FqfRaj8VwW6_eIQ0T0ZbSnj3yy6Mbe0ye6kPGeziSQgA2nOmKARWbA-lSuzvaZ219v23X0kzGRVsw1buEbj5vaoa118hzVj7YTgNmrQV_D_TuPpBfgW83ZIHsHIKTsTFD8hagYE1yeW2puz7ZcJJydJHxx2rx-qjHh5BreXFGVVpHsZWu1QL8cY-FiiMbeH_xcOC6E11DLkYpuetFYJUPkVtmi2iqADLUiuNqScHHdg7Trx7XiOTIuU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC2q4AohTJ7q25ROs0ejnQWCxjeZVUpunMs11P9xxeAxn16v9W0GDrRHO6st557tOZuKBT--SJ1oQ6zN9otFJmNbAC15pDn_BE7nGlxf9KroDQ5TySB6dvJDjrLLmgfvkwKRWQW5_st1uW0slaO29QOCXHGQrzcAQhxlMFt6g_i6X3tbkbsCenfPHpWAJVau5xoLJ8Peo2WIzfn1Gw1mPM4JJP_H8tj-a41J8u-Q9Ceg9Z25lVkM7OG3N5yAo4KsvCbfeetVq8pvSw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD_1cmsbp0Lu2b9NTyyiP4hkoDo5ojP9ruOhvwDZScpMvi7KFguNlRBTF2vDYOOs6e1bfHwnAHT4Lh-untqCJmvyc7agkjghX3TQVwlyFeFkPTfaPKNPQEbcg1IIo_lTF8JK-frlpxOMyjVFDUYIZu_pS5P8hMDrlyrVFhG24z1UErKSvLm_zNV3RMnFbCfPnTzrkXorpP5RK4tae5dKSPTSTMrjiH36eAaOxARqGNCfbu6SEKstFYJeKXv_dj3qFzQvFyvtNamjjI',
    ]

    const dogImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDfC59smZZHvwPu2oh8VAzlfVfioMCujZfBg94nBjfZRGodSxc_Z7qsRrHM-0IHDvn6rp67RTCrpEAOUUSRIdBjpr-5b14LQVHqDAWAKH_ITsHh99Mt-c2_TrvuBOP0JNI_RK1VugRe1KeqCl8RW32w9imk7RTBc7ii9qKg3clLdOhZ6dGE6GRCixtFEop7D8W96ncCizrvzZdH1ijDBo4MhmN63RluGDKx5CaQZOdjtxjSJEHf9eA2XjFabT64AbeSLTn7bGuiL2o',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCFOxHqNeE6D_gGHO_XsE7RFuQRFC-Ay58Rsj75ANVbOVeUXi8vYDMtPuZ1vI890UJRr2lkZyE5CAp72OT4ueMtdCTDiUL5EWoq708Z0XiLy9XB0hn-sj5b52QynZrNxvXsdJLLyLkT0lFsu84mQoj4j54PmblNlAC0ZIrO0dw2P0eBi0k9RphDX7vhmJon4R89IipFN8tCpiQPrMcYyA02QhmzYVAWFQGknhfIY2noQIOC0aPkCDZQvbqf8PEfwV2079aknpPOCDk',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCU44LtaV33JGruexQOGr5SQyjPHPyd7HfMlJFhqltPxLIhaEimCa9teT0-oTlWIqezVf7wnjEnfaIzunRimwxdEIT_4DtsiDfmsRZEdsN3Uf5d2NTQ7ftfqFYrAd0j32Qkokhshy5z8rJOeQajSbAdRFXTFkF1TskznAQSlWBsIby-Z_538dO0P6D9U_qxUHieJ1PP9g8OGhrNOnKio0rkdWyAG9IT-2Vr8H5gA1hltkP-cdNP2G4KyVafEt4Xv2fqp4X7VgnmVBE',
    ]

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">
                        1
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Data Collection</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                    Ready to Train
                </span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class A: Cats */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-orange-500"></span>
                            Class 1: Cats
                        </label>
                        <span className="text-xs text-gray-500">12 samples</span>
                    </div>
                    <div className="relative h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                        <div className="grid grid-cols-4 gap-1 absolute inset-2 overflow-hidden opacity-40 pointer-events-none">
                            {catImages.map((src, i) => (
                                <img
                                    key={i}
                                    className="rounded object-cover h-full w-full"
                                    src={src}
                                    alt="Cat sample"
                                />
                            ))}
                        </div>
                        <div className="z-10 flex flex-col items-center justify-center p-4 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-sm backdrop-blur-sm">
                            <Plus className="text-primary w-8 h-8 mb-1" />
                            <span className="text-xs font-semibold text-primary">Add Samples</span>
                        </div>
                    </div>
                </div>

                {/* Class B: Dogs */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-500"></span>
                            Class 2: Dogs
                        </label>
                        <span className="text-xs text-gray-500">10 samples</span>
                    </div>
                    <div className="relative h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
                        <div className="grid grid-cols-4 gap-1 absolute inset-2 overflow-hidden opacity-40 pointer-events-none">
                            {dogImages.map((src, i) => (
                                <img
                                    key={i}
                                    className="rounded object-cover h-full w-full"
                                    src={src}
                                    alt="Dog sample"
                                />
                            ))}
                        </div>
                        <div className="z-10 flex flex-col items-center justify-center p-4 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-sm backdrop-blur-sm">
                            <Plus className="text-primary w-8 h-8 mb-1" />
                            <span className="text-xs font-semibold text-primary">Add Samples</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
