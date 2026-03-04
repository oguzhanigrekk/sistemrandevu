"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar,
    Users,
    Settings,
    LogOut,
    MessageCircle,
    Scissors,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { handleSignOut } from "@/app/actions/authActions";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Takvim", href: "/dashboard", icon: Calendar },
        { name: "Çalışanlar", href: "/dashboard/staff", icon: Users },
        { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
    ];

    const whatsappUrl = "https://wa.me/905386975882?text=Merhaba,%20SistemRandevu%20üzerinden%20kullanıcı%20sınırımı%20artırmak%20istiyorum.";

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 fixed h-full z-40">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <Scissors className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-neutral-900 dark:text-white">
                        Sistem<span className="text-primary-500">Randevu</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400"
                                        : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-400"
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-xl font-bold text-sm tracking-tight hover:scale-[1.02] transition-transform"
                    >
                        <MessageCircle size={18} />
                        Kullanıcı Sayısını Artır
                    </a>

                    <form action={handleSignOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-red-500 dark:text-neutral-400 transition-colors font-bold text-sm"
                        >
                            <LogOut size={18} />
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Scissors className="text-primary-600" size={20} />
                    <span className="font-black text-neutral-900 dark:text-white">SistemRandevu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-neutral-600 dark:text-neutral-400">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-neutral-900 z-50 p-6 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-10">
                                <Scissors className="text-primary-600" size={24} />
                                <span className="text-2xl font-black text-neutral-900 dark:text-white">SistemRandevu</span>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold ${isActive
                                                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400"
                                                    : "text-neutral-500 dark:text-neutral-400"
                                                }`}
                                        >
                                            <item.icon size={22} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                                <a
                                    href={whatsappUrl}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-bold mb-4"
                                >
                                    <MessageCircle size={20} />
                                    Limit Artırımı
                                </a>
                                <form action={handleSignOut}>
                                    <button type="submit" className="w-full py-4 text-neutral-500 font-bold flex items-center justify-center gap-2">
                                        <LogOut size={20} /> Çıkış Yap
                                    </button>
                                </form>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 md:p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
