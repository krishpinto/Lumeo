import { COMPANIES } from "@/lib/data";
import React from "react";
import Image from "next/image";
import AnimationContainer from "./animation-container";
import MaxWidthWrapper from "./max-width-wrapper";

const companies = () => {
  return (
    <div>
      <MaxWidthWrapper>
        <AnimationContainer delay={0.4}>
          <div className="py-14">
            <div className="mx-auto px-4 md:px-8">
              <h2 className="text-center text-sm font-medium font-heading  uppercase">
                Trusted by the best in the industry
              </h2>
              <div className="mt-8 opacity-55">
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-16 justify-center">
                  {COMPANIES.map((company) => (
                    <li key={company.name}>
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={80}
                        height={80}
                        quality={100}
                        className="w-28 h-auto"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default companies;
