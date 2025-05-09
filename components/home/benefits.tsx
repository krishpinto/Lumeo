import { cn } from "@/lib/utils";
import { LucideIcon, Brain, Clock, Megaphone, Coins, Shield, ChartBar } from "lucide-react";
import Container from "@/components/container";
import { SectionBadge } from "@/components/ui/section-bade";

// Updated benefits for event planning platform
const EVENT_BENEFITS = [
  {
    title: "AI-Powered Efficiency",
    description: "Save up to 70% of planning time with our intelligent automation tools that handle repetitive tasks.",
    icon: Brain
  },
  {
    title: "Time-Saving Templates",
    description: "Access pre-built event templates customized for conferences, weddings, corporate meetings, and more.",
    icon: Clock
  },
  {
    title: "Professional Marketing",
    description: "Instantly create compelling promotional content that drives higher attendance rates.",
    icon: Megaphone
  },
  {
    title: "Cost Reduction",
    description: "Reduce planning costs by 30% through optimized resource allocation and budget management.",
    icon: Coins
  },
  {
    title: "Stress-Free Planning",
    description: "Eliminate uncertainty with comprehensive checklists and automated reminders for critical deadlines.",
    icon: Shield
  },
  {
    title: "Data-Driven Insights",
    description: "Make informed decisions with detailed analytics on every aspect of your event planning process.",
    icon: ChartBar
  }
];

const Benefits = () => {
    return (
        <div className="flex flex-col pl-58 pr-58 items-center justify-center py-12 md:py-16 lg:py-24 w-full">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Benefits" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
                        Why choose our platform
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
                        Experience the advantages of AI-powered event planning that saves time, reduces costs, and delivers exceptional events
                    </p>
                </div>
            </Container>
            <Container>
                <div className="mt-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full relative">
                        {EVENT_BENEFITS.map((perk, index) => (
                            <Perk key={index} index={index} {...perk} />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
};

const Perk = ({
    title,
    description,
    icon: Icon,
    index,
}: {
    title: string;
    description: string;
    icon: LucideIcon;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r transform-gpu py-10 relative group/feature border-neutral-800",
                (index === 0 || index === 3) && "lg:border-l",
                index < 3 && "lg:border-b"
            )}
        >
            {index < 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-80 from-violet-950/25 to-transparent pointer-events-none" />
            )}
            {index >= 3 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-80 from-violet-950/25 to-transparent pointer-events-none" />
            )}
            <div className="group-hover/feature:-translate-y-1 transform-gpu transition-all duration-300 flex flex-col w-full">
                <div className="mb-4 relative z-10 px-10">
                    <Icon strokeWidth={1.3} className="w-10 h-10 origin-left transform-gpu text-neutral-500 transition-all duration-300 ease-in-out group-hover/feature:scale-75 group-hover/feature:text-foreground" />
                </div>
                <div className="text-lg font-medium font-heading mb-2 relative z-10 px-10">
                    <div className="absolute left-0 -inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-violet-600 transition-all duration-500 origin-center" />
                    <span className="group-hover/feature:-translate-y- group-hover/feature:text- transition duration-500 inline-block heading">
                        {title}
                    </span>
                </div>
                <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default Benefits;