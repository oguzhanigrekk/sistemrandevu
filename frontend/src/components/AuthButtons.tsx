import { auth } from "@/auth";
import Link from "next/link";
import { handleSignOut } from "@/app/actions/authActions";

export async function NavbarAuthButtons() {
    const session = await auth();

    if (session) {
        return (
            <form action={handleSignOut} className="flex">
                <button type="submit" className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-all shadow-sm">
                    Çıkış Yap
                </button>
            </form>
        )
    }

    return (
        <div className="flex gap-3">
            <Link href="/login" className="px-5 py-2 text-sm font-bold rounded-full bg-primary-600 text-white hover:bg-primary-500 transition-all shadow-md shadow-primary-600/20">
                Giriş Yap
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-bold rounded-full bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm">
                Kayıt Ol
            </Link>
        </div>
    )
}

export async function PricingAuthButton() {
    return (
        <Link href="/register?type=B2B" className="w-full sm:w-auto px-10 py-3 rounded-full bg-primary-600 text-white font-bold shadow-lg hover:bg-primary-500 hover:scale-105 transition-all text-center">
            Hemen Satın Al (Standart)
        </Link>
    )
}
