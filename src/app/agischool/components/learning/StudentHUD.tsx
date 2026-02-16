import { Backpack, Clock, Crosshair, Flame, Map, MessageSquare, Minus, Plus, Star, Target } from 'lucide-react'

export function StudentHUD() {
    return (
        <>
            {/* Left Panel: Student Status */}
            <div className="absolute top-6 left-6 w-80 flex flex-col gap-4 pointer-events-none z-30">
                {/* Profile Card */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-soft border border-white/50 pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-xl size-14 shadow-inner"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSDRJQBZsC8g75jfS3hdlnX-imkkDj1WGuS5Qvo6a5XxonEV8BGJdbT6bU0rpHNFY3qElVKdawDMc-G7Xz_g4O1p9K27PesPKfqn7LxtNoiy0jDqHgpN-TnZ7H0PCNsDqJ1CxVVRWxmP2gUnAl17gRZwv-VSoR1YpUCDZ4FTAH-9XjWZJsgAoSBkHi1I6fHIBeUPOWEqVT5CJz2bPD5cCLvpQ2w4-1QDMgUkF3iX_lGrBBSFc4eAsFUN3D6MloU91P05lKskvo2KY")',
                            }}
                        ></div>
                        <div className="flex flex-col">
                            <h1 className="text-text-main text-lg font-bold leading-tight">Alex Chen</h1>
                            <p className="text-primary text-sm font-medium">Level 5 - Data Detective</p>
                        </div>
                        <div className="ml-auto flex flex-col items-center justify-center bg-orange-50 text-orange-500 p-2 rounded-lg">
                            <Flame className="w-5 h-5" fill="currentColor" />
                            <span className="text-xs font-bold">12</span>
                        </div>
                    </div>
                    {/* XP Progress */}
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Experience
                            </span>
                            <span className="text-xs font-bold text-text-main">650 / 1000 XP</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1000"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-1">
                            Next Reward: <span className="text-primary font-medium">Golden Neural Net Badge</span>
                        </p>
                    </div>
                </div>

                {/* Current Mission Quick View */}
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-soft border border-white/50 pointer-events-auto group hover:bg-white transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                            <Target className="w-5 h-5" />
                        </div>
                        <p className="text-text-main text-sm font-bold uppercase tracking-wide">Active Mission</p>
                    </div>
                    <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
                        Neural Networks Basics
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                        Learn how artificial neurons simulate the human brain to process information.
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-text-secondary bg-background-light p-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>25 mins</span>
                        <span className="mx-1">•</span>
                        <Star className="w-4 h-4" />
                        <span>150 XP</span>
                    </div>
                </div>

                {/* Side Menu (Collapsed Style) */}
                <div className="flex gap-2 pointer-events-auto">
                    <button className="flex-1 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-soft border border-white/50 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white group transition-all">
                        <Map className="w-5 h-5 text-text-secondary group-hover:text-white" />
                        <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                            World Map
                        </span>
                    </button>
                    <button className="flex-1 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-soft border border-white/50 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white group transition-all">
                        <MessageSquare className="w-5 h-5 text-text-secondary group-hover:text-white" />
                        <span className="text-xs font-medium text-text-secondary group-hover:text-white">Feedback</span>
                    </button>
                    <button className="flex-1 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-soft border border-white/50 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white group transition-all">
                        <Backpack className="w-5 h-5 text-text-secondary group-hover:text-white" />
                        <span className="text-xs font-medium text-text-secondary group-hover:text-white">
                            Inventory
                        </span>
                    </button>
                </div>
            </div>

            {/* Bottom Right: Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
                <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-soft border border-white/50 flex flex-col p-1">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-md text-text-main transition-colors"
                        title="Zoom In"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-md text-text-main transition-colors"
                        title="Zoom Out"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                </div>
                <button
                    className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-soft border border-white/50 text-primary hover:bg-primary hover:text-white transition-all"
                    title="Center on Me"
                >
                    <Crosshair className="w-5 h-5" />
                </button>
            </div>
        </>
    )
}
