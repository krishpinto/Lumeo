import Hero from "@/components/home/hero";
import Companies from "@/components/home/companies";
import Features from "@/components/home/features";
import Benefits from "@/components/home/benefits";
import Integration from "@/components/home/integration";
import  Footer  from "@/components/home/footer";

export default function Home() {
  const user = null; // Replace 'null' with the actual logic to determine if a user is logged in

  return (
    <div className="relative">
      {/* Grid background with gradient mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />
      <div className="absolute scrollbar-hide pt-30 size-full">
        <Hero />
        <Companies />
        <section id="working"><Features /></section>
        <section id="benefits"><Benefits /></section>
        <section id="integrations"><Integration /></section>
        <Footer />
      </div>
    </div>
  );
}
