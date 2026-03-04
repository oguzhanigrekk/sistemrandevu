import ClientHome from "@/components/ClientHome";
import { NavbarAuthButtons, PricingAuthButton } from "@/components/AuthButtons";

export default function Home() {
  return (
    <ClientHome
      navbarAuthBtn={<NavbarAuthButtons />}
      pricingAuthBtn={<PricingAuthButton />}
    />
  );
}
