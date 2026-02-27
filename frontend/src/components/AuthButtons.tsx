import { auth } from "@/auth";
import { handleSignIn, handleSignOut } from "@/app/actions/authActions";

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
        <form action={handleSignIn} className="flex">
            <button type="submit" className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-primary-600 text-white hover:bg-primary-500 transition-all shadow-md">
                Giriş Yap / Kayıt Ol
            </button>
        </form>
    )
}

export async function PricingAuthButton() {
    return (
        <form action={handleSignIn} className="w-full sm:w-auto flex">
            <button type="submit" className="w-full sm:w-auto px-10 py-3 rounded-full bg-primary-600 text-white font-bold shadow-lg hover:bg-primary-500 hover:scale-105 transition-all text-center">
                Hemen Satın Al (Standart)
            </button>
        </form>
    )
}
