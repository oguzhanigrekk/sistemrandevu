"use client";

import { useState } from "react";
import {
    Plus,
    User,
    ShieldCheck,
    Phone,
    Mail,
    MoreVertical,
    AlertCircle,
    MessageCircle,
    Trash2
} from "lucide-react";
import { motion } from "framer-motion";

export default function StaffPage() {
    const [staff, setStaff] = useState([
        { id: 1, name: "Ahmet Yetkili", role: "Şube Yöneticisi", phone: "0532 000 00 00", email: "ahmet@deneme.com", status: "Aktif" },
        { id: 2, name: "Mehmet Berberoğlu", role: "Personel", phone: "0533 111 22 33", email: "mehmet@deneme.com", status: "Aktif" },
    ]);

    const isLimitReached = staff.length >= 2;
    const whatsappUrl = "https://wa.me/905386975882?text=Merhaba,%20çalışan%20limitimi%20artırmak%20istiyorum.";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Çalışan Yönetimi</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Ekibinizi buradan yönetebilir ve yeni personel ekleyebilirsiniz.</p>
                </div>
                <button
                    disabled={isLimitReached}
                    className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl transition-all shadow-lg ${isLimitReached
                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none"
                            : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20 hover:scale-105 active:scale-95"
                        }`}
                >
                    <Plus size={18} />
                    Yeni Çalışan Ekle
                </button>
            </div>

            {isLimitReached && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/50 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-6"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/20">
                        <AlertCircle className="text-white" size={24} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="font-black text-neutral-900 dark:text-white text-lg mb-1">Kullanıcı Sınırına Ulaştınız!</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                            Şu anki planınızda maksimum 2 kullanıcı ekleyebilirsiniz. Daha fazla çalışan eklemek ve kapasitenizi artırmak için WhatsApp üzerinden bizimle iletişime geçin.
                        </p>
                    </div>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-green-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <MessageCircle size={20} />
                        WhatsApp ile Yükselt
                    </a>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((person) => (
                    <motion.div
                        key={person.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-neutral-400 hover:text-red-500 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary-600">
                                <User size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white">{person.name}</h3>
                                    {person.role === "Şube Yöneticisi" && (
                                        <ShieldCheck size={16} className="text-primary-500" title="Yönetici" />
                                    )}
                                </div>
                                <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                                    {person.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-neutral-500 font-bold">
                                <div className="w-8 h-8 rounded-xl bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                                    <Phone size={14} className="text-neutral-400" />
                                </div>
                                {person.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-500 font-bold">
                                <div className="w-8 h-8 rounded-xl bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
                                    <Mail size={14} className="text-neutral-400" />
                                </div>
                                {person.email}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-50 dark:border-neutral-800 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {person.status}
                            </span>
                            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all text-neutral-400">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {!isLimitReached && (
                    <button className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-8 flex flex-col items-center justify-center gap-4 text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-all min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
                            <Plus size={32} />
                        </div>
                        <span className="font-black text-lg">Hemen Ekleyin</span>
                    </button>
                )}
            </div>
        </div>
    );
}
