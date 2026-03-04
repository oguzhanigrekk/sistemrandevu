"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    User,
    Scissors
} from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<"day" | "week" | "month">("week");

    const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 09:00 - 20:00

    // Mock appointments
    const appointments = [
        { id: 1, time: "10:00", duration: "60dk", customer: "Ahmet Yılmaz", service: "Saç Kesimi", color: "bg-blue-500" },
        { id: 2, time: "13:30", duration: "90dk", customer: "Mehmet Demir", service: "Boya & Bakım", color: "bg-purple-500" },
        { id: 3, time: "16:00", duration: "30dk", customer: "Can Kara", service: "Sakal Tıraşı", color: "bg-emerald-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Randevu Takvimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Şube randevularınızı buradan yönetebilirsiniz.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95 text-sm">
                    <Plus size={18} />
                    Yeni Randevu
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                        <button className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all text-neutral-600 dark:text-neutral-400">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all text-neutral-600 dark:text-neutral-400">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white text-lg">
                        Mart 2026
                    </span>
                </div>

                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1.5">
                    {(["day", "week", "month"] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${view === v
                                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                                }`}
                        >
                            {v === "day" ? "Gün" : v === "week" ? "Hafta" : "Ay"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Grid (Week View Placeholder) */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl overflow-hidden">
                <div className="grid grid-cols-8 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="p-4 border-r border-neutral-100 dark:border-neutral-800"></div>
                    {days.map((day, i) => (
                        <div key={day} className="p-4 text-center border-r last:border-0 border-neutral-100 dark:border-neutral-800">
                            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{day}</span>
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg ${i === 2 ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-neutral-900 dark:text-white'}`}>
                                {i + 17}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="relative h-[600px] overflow-y-auto scrollbar-hide">
                    {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-8 border-b border-neutral-50 dark:border-neutral-800/50 min-h-[100px]">
                            <div className="p-4 text-right border-r border-neutral-100 dark:border-neutral-800">
                                <span className="text-sm font-bold text-neutral-400">{hour}:00</span>
                            </div>
                            {days.map((_, i) => (
                                <div key={i} className="p-2 border-r last:border-0 border-neutral-50 dark:border-neutral-800/50 relative group">
                                    {/* Mock Appointment on Wednesday at 10:00 or 13:00 etc */}
                                    {i === 2 && hour === 10 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-x-2 top-2 bottom-2 bg-primary-500/10 border-l-4 border-primary-500 p-3 rounded-xl z-10 cursor-pointer hover:bg-primary-500/20 transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter">Ahmet Yılmaz</span>
                                                <Scissors size={10} className="text-primary-500" />
                                            </div>
                                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Saç Kesimi</p>
                                            <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-500">
                                                <Clock size={10} /> 10:00 - 11:00
                                            </div>
                                        </motion.div>
                                    )}

                                    {i === 4 && hour === 14 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute inset-x-2 top-2 bottom-2 bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-xl z-10 cursor-pointer hover:bg-indigo-500/20 transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Buse Aydın</span>
                                                <User size={10} className="text-indigo-500" />
                                            </div>
                                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Genel Bakım</p>
                                            <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-500">
                                                <Clock size={10} /> 14:00 - 15:30
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity">
                                        <Plus size={24} className="text-neutral-200 dark:text-neutral-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
