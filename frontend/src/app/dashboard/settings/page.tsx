"use client";

import {
    Settings,
    Bell,
    Lock,
    Zap,
    Globe,
    ChevronRight,
    Camera
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const sections = [
        { name: "Genel Ayarlar", icon: Settings, desc: "Şube bilgileri ve çalışma saatleri" },
        { name: "Bildirimler", icon: Bell, desc: "E-posta ve SMS randevu bildirimleri" },
        { name: "Güvenlik", icon: Lock, desc: "Şifre ve giriş güvenliği ayarları" },
        { name: "Entegrasyonlar", icon: Zap, desc: "Diğer sistemlerle bağlantı kurun" },
        { name: "Dil & Bölge", icon: Globe, desc: "Sistem dilini ve zaman dilimini ayarlayın" },
    ];

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Ayarlar</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Sistem ayarlarınızı buradan özelleştirebilirsiniz.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl p-8 flex items-center gap-8">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-[2rem] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary-600 transition-all group-hover:bg-primary-50">
                        <Camera size={32} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center shadow-lg">
                        <Plus size={14} className="text-primary-600" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">Oğuzhan Şubesi</h2>
                    <p className="text-neutral-500 font-medium">Standart Plan • 2/2 Kullanıcı Aktif</p>
                    <button className="mt-3 text-sm font-bold text-primary-600 hover:text-primary-500 transition-colors">Şube Resmini Güncelle</button>
                </div>
            </div>

            {/* Settings List */}
            <div className="space-y-4">
                {sections.map((section, i) => (
                    <motion.div
                        key={section.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 flex items-center justify-between group cursor-pointer hover:shadow-lg hover:border-primary-100 dark:hover:border-primary-900 transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-all">
                                <section.icon size={22} />
                            </div>
                            <div>
                                <h4 className="font-black text-neutral-900 dark:text-white">{section.name}</h4>
                                <p className="text-xs text-neutral-500 font-medium">{section.desc}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-300 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function Plus({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
