"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, AlertCircle, Loader2, Building2, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"B2C" | "B2B">("B2C");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // B2C Form Data
    const [b2cName, setB2cName] = useState("");
    const [b2cSurname, setB2cSurname] = useState("");
    const [b2cPhone, setB2cPhone] = useState("");
    const [b2cEmail, setB2cEmail] = useState("");
    const [b2cPassword, setB2cPassword] = useState("");

    // B2B Form Data
    const [b2bBranchName, setB2bBranchName] = useState("");
    const [b2bAddress, setB2bAddress] = useState("");
    const [b2bEmail, setB2bEmail] = useState("");
    const [b2bPhone, setB2bPhone] = useState("");
    const [b2bContactName, setB2bContactName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const payload = tab === "B2C"
                ? {
                    type: "B2C",
                    firstName: b2cName,
                    lastName: b2cSurname,
                    phone: b2cPhone,
                    email: b2cEmail,
                    password: b2cPassword,
                }
                : {
                    type: "B2B",
                    branchName: b2bBranchName,
                    address: b2bAddress,
                    email: b2bEmail,
                    phone: b2bPhone,
                    contactName: b2bContactName,
                };

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Kayıt olurken bir hata meydana geldi.");
            }

            setSuccess(true);
            if (tab === "B2C") {
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 selection:bg-primary-500 selection:text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-8 text-center"
                >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-white mb-4">
                        {tab === "B2C" ? "Hesabınız Oluşturuldu!" : "Başvurunuz Alındı!"}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                        {tab === "B2C"
                            ? "Aramıza hoş geldiniz! Müşteri hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz..."
                            : "Şube hesabınız sistemlerimizde oluşturuldu. Lütfen girdiğiniz E-Posta adresinizi kontrol edin, giriş şifrenizi size gönderdik."}
                    </p>
                    <Link href="/login" className="inline-block px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                        Giriş Yap
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 selection:bg-primary-500 selection:text-white pb-20 pt-10">
            <Link href="/" className="mb-8 flex items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Scissors className="text-primary-600 dark:text-primary-500" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
                    Sistem<span className="text-primary-500">Randevu</span>
                </span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
            >
                <div className="flex border-b border-neutral-100 dark:border-neutral-800">
                    <button
                        onClick={() => setTab("B2C")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${tab === "B2C" ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/10 dark:text-primary-400 dark:border-primary-400" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                            }`}
                    >
                        <User size={18} /> Müşteri
                    </button>
                    <button
                        onClick={() => setTab("B2B")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${tab === "B2B" ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/10 dark:text-primary-400 dark:border-primary-400" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                            }`}
                    >
                        <Building2 size={18} /> Şube (Kurumsal)
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">
                            {tab === "B2C" ? "Yeni Hesap Oluştur" : "İşletmenizi Ekleyin"}
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {tab === "B2C" ? "Hemen kayıt olarak güzellik dünyasını keşfedin." : "Şube bilgilerinizi girerek dijital randevu sistemine geçin."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        {tab === "B2C" ? (
                            <>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Ad</label>
                                        <input type="text" required value={b2cName} onChange={e => setB2cName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Soyad</label>
                                        <input type="text" required value={b2cSurname} onChange={e => setB2cSurname(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Telefon Numarası</label>
                                    <input type="tel" required value={b2cPhone} onChange={e => setB2cPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="05XX XXX XX XX" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">E-Posta Adresi</label>
                                    <input type="email" required value={b2cEmail} onChange={e => setB2cEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Şifre</label>
                                    <input type="password" required value={b2cPassword} onChange={e => setB2cPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Şube Adı</label>
                                    <input type="text" required value={b2bBranchName} onChange={e => setB2bBranchName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Örn: ABC Kuaför Beşiktaş" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Şube Adresi</label>
                                    <textarea required value={b2bAddress} onChange={e => setB2bAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 h-24 resize-none" placeholder="Açık adres..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">İletişim (Yetkili Kişi)</label>
                                    <input type="text" required value={b2bContactName} onChange={e => setB2bContactName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Telefon</label>
                                        <input type="tel" required value={b2bPhone} onChange={e => setB2bPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">E-Posta</label>
                                        <input type="email" required value={b2bEmail} onChange={e => setB2bEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                                    </div>
                                </div>
                                <div className="text-xs text-neutral-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 mt-4">
                                    ℹ️ Kayıt işlemi sonrasında sistemimiz güvenli bir şifre oluşturarak yukarıda belirttiğiniz e-posta adresinize gönderecektir.
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 mt-4 rounded-xl transition-all shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (tab === "B2C" ? "Kayıt Ol" : "Şube Başvurusu Yap")}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-6">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="font-bold text-neutral-900 dark:text-white hover:text-primary-500 transition-colors">
                            Giriş Yapın
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
