import Container from "@/components/container"
import { MagicCard } from "@/components/magicui/magic-card"
import { Download, Check, Calendar, Users, Clock, MapPin, Sparkles } from "lucide-react"
import AnimationContainer from "./animation-container"

const Features = () => {
  return (
    <section className="relative w-full pt-30 py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
        <AnimationContainer className="relative inset-0 -z-10 opacity-20">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug">
            AI-Powered event planning <br /> made <span className="font-subheading italic">simple</span>
          </h2>
          <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
            Transform your event planning with AI-powered automation. Create events faster, generate better experiences,
            and make smarter decisions in minutes.
          </p>
          </AnimationContainer>
        </div>
        

        <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {/* First row */}
            <Container className="col-span-12 md:col-span-5">
              <MagicCard
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">⚡</span>
                      Smart Event Creation
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Efficiently create and manage events with advanced AI tools
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="border-t border-border/30 pt-3 mt-1">
                      <div className="bg-black/30 rounded-xl p-3 relative">
                        <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                          NEW
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="bg-blue-500/30 p-2 rounded-lg">
                            <Calendar className="size-4 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Tech Conference</div>
                            <div className="text-xs text-muted-foreground">Today, 10:25</div>
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
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">📊</span>
                      Attendance Insights
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Gain deep insights into your event attendance and engagement
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="relative h-[120px] w-full">
                      <div className="absolute bottom-0 left-0 right-0 h-full">
                        <div className="relative h-full">
                          <div className="absolute bottom-0 left-0 right-0 flex items-end h-full">
                            <div className="w-full h-full relative">
                              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 text-[10px]">
                                <div className="text-muted-foreground">-5</div>
                                <div className="text-muted-foreground">0</div>
                                <div className="text-muted-foreground">5</div>
                                <div className="text-muted-foreground">10</div>
                                <div className="text-muted-foreground">20</div>
                                <div className="text-muted-foreground">25</div>
                              </div>
                              <svg className="w-full h-[100px]" viewBox="0 0 300 100" preserveAspectRatio="none">
                                <path
                                  d="M0,80 C20,70 40,90 60,85 C80,80 100,70 120,75 C140,80 160,70 180,60 C200,50 220,40 240,30 C260,20 280,10 300,5"
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="2"
                                />
                                <circle cx="240" cy="30" r="5" fill="#3b82f6" />
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
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">📁</span>
                      Event Resources
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Manage your event materials with ease</p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-full p-1.5">
                          <Download className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">Event Schedule.pdf</div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-blue-500 rounded-full w-[85%]"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-full p-1.5">
                          <Download className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">Speaker Bios.pdf</div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 rounded-full p-1.5">
                          <Download className="size-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs">Venue Map.pdf</div>
                          <div className="h-1 bg-gray-700 rounded-full w-full mt-1">
                            <div className="h-full bg-blue-500 rounded-full w-[45%]"></div>
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
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">📈</span>
                      Engagement Analytics
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Track and analyze your event engagement in real-time
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        <div className="bg-blue-500/20 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          This week
                        </div>
                        <div className="bg-black/40 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          Last week
                        </div>
                        <div className="bg-black/40 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                          This month
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/30 p-3 rounded-xl">
                          <div className="h-[80px] flex items-end gap-3 pt-2">
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[20px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">RSVPs</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[40px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">Target</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[60px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">Attended</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-xl">
                          <div className="h-[80px] flex items-end gap-3 pt-2">
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[40px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">Sessions</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[20px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">Avg</div>
                            </div>
                            <div className="flex flex-col items-center gap-1 flex-1">
                              <div className="w-full bg-gray-800/50 h-[30px] rounded"></div>
                              <div className="text-[10px] text-muted-foreground">Rating</div>
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
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">⚡</span>
                      Smart Scheduling
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">AI-powered scheduling for optimal event timing</p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Clock className="size-5 text-blue-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Users className="size-5 text-blue-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <MapPin className="size-5 text-blue-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Calendar className="size-5 text-blue-400" />
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 relative flex items-center justify-center">
                        <Sparkles className="size-5 text-blue-400" />
                        <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-0.5">
                          <Check className="size-3 text-white" />
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 h-16 flex items-center justify-center">
                        <Users className="size-5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Container>

            <Container className="col-span-12 md:col-span-7">
              <MagicCard
                gradientFrom="#38bdf8"
                gradientTo="#3b82f6"
                className="p-4 h-full rounded-2xl border border-border/50 hover:border-border/100 transition-colors bg-black/90"
                gradientColor="rgba(59,130,246,0.1)"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-primary">🎯</span>
                      Attendee Matching
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    AI-powered networking suggestions for event attendees
                  </p>

                  <div className="mt-auto w-full overflow-hidden rounded-lg flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-blue-500/20 rounded-full p-1.5 text-blue-400">
                          <Users className="size-3" />
                        </div>
                        <div className="text-xs">Sarah Johnson - AI Research Lead</div>
                        <div className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          98% match
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-blue-500/20 rounded-full p-1.5 text-blue-400">
                          <Users className="size-3" />
                        </div>
                        <div className="text-xs">Michael Chen - Product Manager</div>
                        <div className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          87% match
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <div className="bg-blue-500/20 rounded-full p-1.5 text-blue-400">
                          <Users className="size-3" />
                        </div>
                        <div className="text-xs">Alex Rivera - UX Designer</div>
                        <div className="ml-auto text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          76% match
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
  )
}

export default Features
