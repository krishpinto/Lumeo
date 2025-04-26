import Link from "next/link";
import AnimationContainer from "@/components/home/animation-container";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const Footer = () => {
  return (
    <footer className="flex flex-col relative items-center justify-center border-t border-border pt-4 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-16 bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.indigo/8%),transparent)]">
      <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

      <div className="grid gap-4 xl:grid-cols-3 xl:gap-8 w-full">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-start justify-start md:max-w-[200px]">
            <div className="flex items-start">
            </div>
            <p className="text-muted-foreground text-sm text-start">
              Manage your events with ease.
            </p>
            <span className="mt-2 text-neutral-200 text-sm flex items-center">
              Made by{" "}
              <Link href="WIP" className="font-semibold ml-1">
                Krish
              </Link>
              <Link href="https://github.com/krishpinto" className="flex items-center">
                <img src="/image 6.svg" alt="Logo" className="h-12 pl-4 w-auto" />
              </Link>
            </span>
          </div>
        </AnimationContainer>

        <div className="grid grid-cols-2 gap-3 mt-8 md:pl-12 lg:pl-24 xl:pl-40 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.2}>
              <div>
                <h3 className="text-base font-medium text-white">Product</h3>
                <ul className="mt-2 text-sm text-muted-foreground">
                  <li className="mt-1">
                    <Link
                      href="#working"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      How it Works
                    </Link>
                  </li>
                  <li className="mt-1">
                    <Link
                      href="#benefits"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Features
                    </Link>
                  </li>
                  <li className="mt-1">
                    <Link
                      href="#integrations"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Integration
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.5}>
              <div className="mt-6 md:mt-0 flex flex-col">
                <h3 className="text-base font-medium text-white">Company</h3>
                <ul className="mt-2 text-sm text-muted-foreground">
                  <li className="mt-1">
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-all duration-300 whitespace-nowrap"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mt-1">
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-all duration-300 whitespace-nowrap"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border/40 pt-4 md:pt-6 md:flex md:items-center md:justify-between w-full">
        <AnimationContainer delay={0.6}>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Lumeo INC. All rights reserved.
          </p>
        </AnimationContainer>
      </div>

      <div className="h-[12rem] lg:h-[12rem] hidden md:flex items-center pl-5 justify-center">
        <TextHoverEffect text="LUMEO" />
      </div>
    </footer>
  );
};

export default Footer;