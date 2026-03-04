"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Scissors, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                username: email,
                password: password,
            });

            if (res?.error) {
                setError("Girdiğiniz e-posta veya şifre hatalı.");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            setError("Bir hata oluştu, lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 selection:bg-primary-500 selection:text-white">
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
                className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">Hoş Geldiniz</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Hesabınıza giriş yaparak randevularınızı yönetin.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                            E-Posta Adresi
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                            placeholder="ornek@mail.com"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Şifre
                            </label>
                            <Link href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                                Şifremi Unuttum
                            </Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary-600/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : "Giriş Yap"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Hesabınız yok mu?{" "}
                    <Link href="/register" className="font-bold text-neutral-900 dark:text-white hover:text-primary-500 transition-colors">
                        Hemen Kayıt Olun
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
