import Container from "@/components/container";
import { MagicCard } from "@/components/magicui/magic-card";
import {
  CalendarDays,
  DollarSign,
  ListTodo,
  GitBranch,
  FileText,
  Share2,
  Check,
  Calendar,
  Users,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  BarChart3,
  Network,
  Rocket,
} from "lucide-react";
import AnimationContainer from "./animation-container";

const Features = () => {
  return (
    <section className="relative w-full pt-30 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <AnimationContainer className="relative inset-0 -z-10 opacity-20">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug">
              AI-Powered event planning <br /> made{" "}
              <span className="font-subheading italic">simple</span>
            </h2>
            <p className="text-base md:text-lg text-center opacity-65 text-accent-foreground/80 mt-6">
              Transform your event planning with AI-powered automation. Create
              events faster, generate better experiences, and make smarter
              decisions in minutes.
            </p>
          </AnimationContainer>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {/* First row */}
            <Container className="col-span-12 md:col-span-5">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(139,92,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <Zap className="size-5" />
                      </span>
                      Smart Event Scheduling
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Effortlessly plan and schedule events with intelligent date
                    and time optimization
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="border-t border-border/30 pt-3 mt-1">
                      <div className="bg-black/30 rounded-xl p-3 relative">
                        <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-violet-300/20 text-violet-400">
                          POPULAR
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="bg-violet-500/30 p-2 rounded-lg">
                            <CalendarDays className="size-4 text-violet-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Conference Schedule
                            </div>
                            <div className="text-xs text-muted-foreground">
                              May 15-17, 2025
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>

            <Container className="col-span-12 md:col-span-7">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(192, 64, 255, 0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <BarChart3 className="size-5" />
                      </span>
                      Budget Management
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Comprehensive budget tracking and forecasting for optimal
                    financial control
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="relative h-[120px] w-full">
                      <div className="absolute bottom-0 left-0 right-0 h-full">
                        <div className="relative h-full">
                          <div className="absolute bottom-0 left-0 right-0 flex items-end h-full">
                            <div className="w-full h-full relative">
                              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 text-[10px]">
                                <div className="text-muted-foreground">$0</div>
                                <div className="text-muted-foreground">$5K</div>
                                <div className="text-muted-foreground">
                                  $10K
                                </div>
                                <div className="text-muted-foreground">
                                  $15K
                                </div>
                                <div className="text-muted-foreground">
                                  $20K
                                </div>
                                <div className="text-muted-foreground">
                                  $25K
                                </div>
                              </div>
                              <svg
                                className="w-full h-[100px]"
                                viewBox="0 0 300 100"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M0,80 C20,70 40,90 60,85 C80,80 100,70 120,75 C140,80 160,70 180,60 C200,50 220,40 240,30 C260,20 280,10 300,5"
                                  fill="none"
                                  stroke="#8b5cf6"
                                  strokeWidth="2"
                                />
                                <circle cx="240" cy="30" r="5" fill="#8b5cf6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-12 gap-4">
            <Container className="col-span-12 md:col-span-4">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(139,92,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <ListTodo className="size-5" />
                      </span>
                      Task Generation
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    AI-powered task lists tailored to your event type
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-violet-800 rounded-full p-1.5">
                          <Check className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">Book venue and caterers</div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-violet-800 rounded-full w-[85%]"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-violet-600 rounded-full p-1.5">
                          <ListTodo className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">
                            Coordinate with speakers
                          </div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-violet-600 rounded-full w-[65%]"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-900 rounded-full p-1.5">
                          <ListTodo className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">Finalize AV equipment</div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-indigo-500 rounded-full w-[45%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>

            <Container className="col-span-12 md:col-span-8">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(139,92,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <Network className="size-5" />
                      </span>
                      Flow Diagram Generator
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Visual representation of your event flow for optimized
                    planning
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="bg-violet-500/20 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          Event Flow
                        </div>
                        <div className="bg-black/40 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          Guest Journey
                        </div>
                        <div className="bg-black/40 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          Timeline
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/30 p-3 rounded-xl">
                          <div className="h-[80px] flex items-center justify-center">
                            <GitBranch className="size-6 text-violet-400" />
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-xl">
                          <div className="h-[80px] flex items-end gap-3 pt-2">
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[40px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">
                                Check-in
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[20px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">
                                Sessions
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[30px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">
                                Network
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-12 gap-4">
            <Container className="col-span-12 md:col-span-5">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(139,92,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <FileText className="size-5" />
                      </span>
                      Document Generation
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create professional itineraries and invitations instantly
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <FileText className="size-5 text-violet-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Users className="size-5 text-violet-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Calendar className="size-5 text-violet-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Clock className="size-5 text-violet-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 relative flex items-center justify-center">
                        <Sparkles className="size-5 text-violet-400" />
                        <div className="absolute bottom-2 right-2 bg-violet-500 rounded-full p-0.5">
                          <Check className="size-3 text-white" />
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <MapPin className="size-5 text-violet-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>

            <Container className="col-span-12 md:col-span-7">
              <MagicCard
                gradientFrom="#8b5cf6"
                gradientTo="#6366f1"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(139,92,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-violet-400">
                        <Rocket className="size-5" />
                      </span>
                      Social Media Promotion
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    AI-generated marketing content optimized for social
                    platforms
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-violet-500/20 rounded-full p-1.5 text-violet-400">
                          <Share2 className="size-3" />
                        </div>
                        <div className="text-xs">Instagram Post Campaign</div>
                        <div className="ml-auto text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">
                          High engagement
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-violet-500/20 rounded-full p-1.5 text-violet-400">
                          <Share2 className="size-3" />
                        </div>
                        <div className="text-xs">LinkedIn Announcement</div>
                        <div className="ml-auto text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">
                          Professional
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-violet-500/20 rounded-full p-1.5 text-violet-400">
                          <Share2 className="size-3" />
                        </div>
                        <div className="text-xs">Twitter/X Countdown Posts</div>
                        <div className="ml-auto text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">
                          Trending
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Features;