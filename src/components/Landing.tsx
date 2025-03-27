"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Code, Users, BookOpen, MessageCircle, Calendar, Globe, Github, School, PlaneTakeoff, LucidePlaneTakeoff, SatelliteDish, Satellite, Users2, TrendingUp, EarthIcon, PlaneLandingIcon, Globe2 } from "lucide-react"
import {
  Zap,
  Inbox,
  Search,
  CalendarCheck,
  Wallet,
  HeartPulse,
  Sparkles,
  Fingerprint,
  CircuitBoard,
  Rocket,
  ArrowRight,
  HeartHandshake,
  Star,
  Quote,
  GraduationCap,
  ChevronDown,
  X,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { db, auth, googleProvider } from "../firebase"
import { collection, getDocs } from "firebase/firestore"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth"
import WaitlistModal from "./WaitList"

interface LandingProps {
  setLoginState: (state: boolean) => void
  setOnboardingComplete: (complete: boolean) => void
}

export default function Landing({ setLoginState, setOnboardingComplete }: LandingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)

  const Avatars = [
    {
      user: {
        profile1: "https://api.dicebear.com/9.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05",
        profile2: "https://api.dicebear.com/9.x/pixel-art/svg",
        profile3: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Jane",
      },
    },
  ]

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      const scrollPercentRounded = Math.round(scrollPercent * 100)
      setScrollProgress(scrollPercentRounded)

      // Determine active section
      const sections = ["hero", "features", "how-it-works", "testimonials", "faq"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchEmails = async () => {
      const waitlistRef = collection(db, "waitlist")
      const snapshot = await getDocs(waitlistRef)
      const emailList = snapshot.docs.map((doc) => doc.data().email)
      setEmails(emailList.slice(0, 5)) // Show first 5 emails
    }

    fetchEmails()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginState(true)
        closeModal()
      }
    })

    return () => unsubscribe()
  }, [setLoginState])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setError("")
    setEmail("")
    setPassword("")
    setIsLoading(false)
  }

  // Simulate auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckingUser(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Show loading state while checking
  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 to-teal-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm">Ot.</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-sky-500 to-teal-500 z-[999] transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" onClick={() => scrollToSection("hero")} className="flex items-center space-x-2 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-25 blur-lg transition-all duration-500"></div>
              <span className="text-xl font-semibold text-gray-900 relative">
                <span className="text-sky-600 font-[700]">Orbitt.</span>
              </span>
            </a>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink
                href="#features"
                isActive={activeSection === "features"}
                onClick={() => scrollToSection("features")}
              >
                Features
              </NavLink>
              <NavLink
                href="#how-it-works"
                isActive={activeSection === "how-it-works"}
                onClick={() => scrollToSection("how-it-works")}
              >
                How It Works
              </NavLink>
              <NavLink
                href="#testimonials"
                isActive={activeSection === "testimonials"}
                onClick={() => scrollToSection("testimonials")}
              >
                Testimonials
              </NavLink>
              <NavLink href="#faq" isActive={activeSection === "faq"} onClick={() => scrollToSection("faq")}>
                FAQ
              </NavLink>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-300"
                asChild
              >
                <a href="https://github.com/vvc10">
                  <Github className="h-5 w-5" />
                </a>
              </Button> */}

              <Button
                onClick={() => {
                  setIsSignUp(true)
                  setIsModalOpen(true)
                }}
                className="bg-gradient-to-r from-sky-600 to-teal-500 text-white 
                     hover:from-sky-700 hover:to-teal-600 hidden sm:flex
                     rounded-full px-6 shadow-sm hover:shadow-md transition-all duration-300 relative group"
              >
                <span className="relative z-10">Join Launchpad</span>
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></span>
              </Button>

              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a
                href="#features"
                onClick={() => scrollToSection("features")}
                className="text-base font-medium text-gray-600 hover:text-sky-600 transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => scrollToSection("how-it-works")}
                className="text-base font-medium text-gray-600 hover:text-sky-600 transition-colors py-2"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={() => scrollToSection("testimonials")}
                className="text-base font-medium text-gray-600 hover:text-sky-600 transition-colors py-2"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={() => scrollToSection("faq")}
                className="text-base font-medium text-gray-600 hover:text-sky-600 transition-colors py-2"
              >
                FAQ
              </a>
              <Button
                onClick={() => {
                  setIsSignUp(true)
                  setIsModalOpen(true)
                  setIsMenuOpen(false)
                }}
                className="bg-gradient-to-r from-sky-600 to-teal-500 text-white 
                     hover:from-sky-700 hover:to-teal-600 
                     rounded-full shadow-sm hover:shadow-md"
              >
                Join Launchpad
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#e0f2fe_0%,_#f0fdfa_25%,_#ffffff_50%)] -z-10"></div>

          {/* Abstract Shapes */}
          <div className="absolute top-20 right-0 -z-10 opacity-20 animate-float">
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-sky-300 to-teal-300 blur-3xl"></div>
          </div>
          <div className="absolute bottom-0 left-0 -z-10 opacity-20 animate-float-delay">
            <div className="w-64 h-64 rounded-full bg-gradient-to-r from-teal-300 to-sky-300 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex-1 text-center lg:text-left"
              >
                <Badge className="mb-6 rounded-full bg-gradient-to-r from-sky-50 to-teal-50 text-teal-800 px-4 py-1.5 border-0 ">
                  🌌 #1 Student Galaxy Platform
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                  <span className="inline-block relative">
                    Launch
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-indigo-200 opacity-50 rounded-full"></div>
                  </span>
                  <span className="mx-2">,</span>
                  <span className="inline-block relative">
                    Connect
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-purple-200 opacity-50 rounded-full"></div>
                  </span>
                  <span className="mx-2">,</span>
                  <span className="relative">
                    Orbitt
                    <span className="absolute -top-2 -right-8 text-4xl animate-pulse">🪐</span>
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Join your campus galaxy where Moons (communities) collide. Earn Stars for contributions,
                  boost posts with Gravity, and launch your college journey into lightspeed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button
                    onClick={() => {
                      setIsSignUp(true)
                      setIsModalOpen(true)
                    }}
                    size="lg"
                    className="relative group overflow-hidden bg-gradient-to-r from-sky-600 to-teal-500 text-white 
                     hover:from-sky-700 hover:to-teal-600  rounded-full px-8 shadow-lg transition-all duration-300 hover:shadow-stardust"
                  >
                    <span className="relative z-10 flex items-center">
                      Join Launchpad
                      <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md"></span>
                  </Button>

                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="relative group overflow-hidden border-2 border-gray-200 hover:border-indigo-200 rounded-full px-8 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Moons
                      <span className="ml-2">🌕</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </Button> */}
                </div>

                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {Avatars.map((i, index) =>
                      Object.values(i.user).map((profile, idx) => (
                        <div
                          key={`${index}-${idx}`}
                          className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden hover:scale-110 transition-transform hover:z-10"
                        >
                          <img
                            src={profile || "/placeholder.svg"}
                            alt={`User avatar ${idx + 1}`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ))
                    )}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-50 to-teal-50   
                     hover:from-sky-50 hover:to-teal-50  border-2 border-white shadow-sm flex items-center justify-center text-teal-700 font-medium text-xs hover:scale-110 transition-transform">
                      200+
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold text-teal-600">astronauts</span> exploring their campus universe
                    <span className="inline-block ml-1">🌠</span>
                  </span>
                </div>
              </motion.div>

              {/* Right Content (Dashboard Preview) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 w-full max-w-xl"
              >
                <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-indigo-800/60 bg-gradient-to-br from-gray-900 via-space-900 to-indigo-900">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-indigo-900/40 border-b border-indigo-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-pulse animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-pulse animate-pulse delay-100"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-pulse animate-pulse delay-200"></div>
                    </div>
                    <div className="text-[0.65rem] font-medium text-indigo-300/80 tracking-wide">
                      orbitt://dashboard
                    </div>
                    <div className="w-16"></div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="relative p-4 bg-gradient-to-br from-space-900/80 via-indigo-900/40 to-space-900/80">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Active Missions Card */}
                      <div className="col-span-2 bg-space-800/30 p-3 rounded-xl border border-indigo-800/50 shadow-galaxy hover:border-indigo-700/60 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-sm text-indigo-200 flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-purple-400" />
                            Your Moons
                          </h3>
                          <span className="text-xs text-indigo-400/80">3 in progress</span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3 p-2.5 bg-indigo-900/20 rounded-lg border border-indigo-800/40 hover:border-indigo-700/60 transition-colors">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-md bg-indigo-800/40 flex items-center justify-center">
                                <Satellite className="w-4 h-4 text-indigo-400" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-medium text-indigo-100">CS101 GHMT</div>
                              <div className="text-[0.7rem] text-indigo-400/90">20 astros active</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2.5 bg-purple-900/20 rounded-lg border border-purple-800/40 hover:border-purple-700/60 transition-colors">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-md bg-purple-800/40 flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-400" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-medium text-purple-100">Hackathon Crew Assembly</div>
                              <div className="text-[0.7rem] text-purple-400/90"> 42 astros active</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stardust Card */}
                      <div className="bg-space-800/30 p-3 rounded-xl border border-indigo-800/50 shadow-galaxy hover:border-indigo-700/60 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <Star className="w-4 h-4 text-amber-400/90" />
                          </div>
                          <h3 className="font-semibold text-sm text-amber-100/90">Star Bank</h3>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xl font-bold text-amber-200/90">1,428</div>
                          <div className="flex items-center gap-1 text-[0.7rem] text-amber-400/80">
                            <TrendingUp className="w-3.5 h-3.5" />
                            +320 this cycle
                          </div>
                        </div>
                      </div>

                      {/* Comms Card */}
                      <div className="bg-space-800/30 p-3 rounded-xl border border-indigo-800/50 shadow-galaxy hover:border-indigo-700/60 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-sky-500/10 rounded-lg border border-sky-500/20">
                            <SatelliteDish className="w-4 h-4 text-sky-400/90" />
                          </div>
                          <h3 className="font-semibold text-sm text-sky-100/90">Blackholes</h3>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-sky-300/90">
                            <span>Unread Transmissions</span>
                            <span className="bg-sky-900/30 px-1.5 py-0.5 rounded-full">5</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-purple-300/90">
                            <span>Crew Channels</span>
                            <span className="bg-purple-900/30 px-1.5 py-0.5 rounded-full">3</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Starfield Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/20 rounded-full animate-star-twinkle"></div>
                      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-star-twinkle delay-1000"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="bg-gray-50 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute -z-10 opacity-30 w-full h-full bg-[url('/grid-pattern.svg')]"></div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                number="50K"
                label="Students"
                icon={<Users className="w-5 h-5 text-sky-700/80" />}
                gradient="from-sky-600 to-teal-500"
                delay={0.1}
              />

              <StatCard
                number="200+"
                label="Universities"
                icon={<School className="w-5 h-5 text-teal-700/80" />}
                gradient="from-teal-600 to-sky-500"
                delay={0.2}
              />

              <StatCard
                number="5K+"
                label="Study Groups"
                icon={<Users2 className="w-5 h-5 text-sky-700/80" />}
                gradient="from-sky-600 to-teal-500"
                delay={0.3}
              />

              <StatCard
                number="1M+"
                label="Resources"
                icon={<BookOpen className="w-5 h-5 text-teal-700/80" />}
                gradient="from-teal-600 to-sky-500"
                delay={0.4}
              />
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        {/* Right Content (Dashboard Preview) */}
        <section id="features" className="py-20 bg-indigo-50 relative overflow-hidden">
          {/* Subtle Space Effects */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100 blur-3xl opacity-50 -z-10"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Badge className="mb-4 rounded-full bg-white text-teal-600 border border-teal-50 px-4 py-1.5 font-medium shadow-sm">
                  <Rocket className="mr-2 h-4 w-4" />
                  Why Choose Orbitt?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Your Campus
                  <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent mx-2">
                    Universe
                  </span>
                  Simplified
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Everything you need to navigate campus life, organized in one place
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Inbox}
                title="Smart Inbox"
                description="Never miss important updates - we sort emails, chats & alerts by priority"
                delay={0.1}
              />



              <FeatureCard
                icon={CalendarCheck}
                title="Gravity Alerts"
                description="Auto-schedules study time around your classes & deadlines"
                delay={0.3}
              />

              <FeatureCard
                icon={Users}
                title="Moons"
                description="Join Your planet (Campus) & explore different related moons for your interests - from basketball to book clubs"
                delay={0.4}
              />

              <FeatureCard
                icon={Wallet}
                title="Orbitt Market"
                description="Buy/sell textbooks, dorm items & find student-friendly gigs"
                delay={0.5}
              />

              <FeatureCard
                icon={HeartPulse}
                title="Moon Support"
                description="24/7 access to counseling, health resources & peer support"
                delay={0.6}
              />
              <FeatureCard
                icon={Globe2}
                title="Black Holes"
                description="Private, anonymous spaces for sensitive topics (mental health, finances, etc.)"
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative py-20 bg-gradient-to-b from-teal-50 to-white overflow-hidden">
          {/* Space Background Elements */}
          <div className="absolute inset-0 -z-10 opacity-15 bg-[url('/star-pattern.svg')]"></div>
          <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-teal-300 rounded-full animate-star-twinkle"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Badge className="mb-4 rounded-full bg-teal-50 text-teal-600 px-4 py-1.5 font-medium shadow-sm border border-indigo-200">
                  <Rocket className="mr-2 h-4 w-4" />
                  How Orbitt works?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Your Campus
                  <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mx-2">
                    Universe
                  </span>
                  Awaits
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Join the campus orbit faster than grabbing coffee between classes
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {/* Step 1 - Launch */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-200 relative overflow-hidden"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <Satellite className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                    Setup
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    Secure student ID verification via .edu email or else
                  </p>
                </div>
              </motion.div>

              {/* Step 2 - Connect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 relative overflow-hidden"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-purple-50 group-hover:bg-purple-100 transition-colors">
                    <PlaneTakeoff className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                    Orbitt Sync
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    Join your planet & get excess to all other moons (communities) orbitting around your planet.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 - Explore */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-pink-200 relative overflow-hidden"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-pink-50 group-hover:bg-pink-100 transition-colors">
                    <PlaneTakeoff className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                    Cosmic Activation
                  </h3>
                  <p className="text-gray-600 mb-4 text-center">
                    Personalized campus feed goes live instantly
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Button
                  className="rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white 
            hover:from-sky-500 hover:to-teal-400 px-8 py-4 shadow-lg hover:shadow-xl
            transform hover:scale-105 transition-all duration-300 group"
                  onClick={() => {
                    setIsSignUp(true)
                    setIsModalOpen(true)
                  }}
                >
                  <span className="flex items-center">
                    Launch Your Orbit
                    <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent -z-10"></div>
          <div className="absolute inset-0 -z-10 opacity-30 bg-[url('/grid-pattern.svg')]"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Badge className="mb-4 rounded-full bg-teal-50 text-teal-500 px-4 py-1.5 font-medium">
                  <Rocket className="mr-2 h-4 w-4" />
                  Testimonials
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Students
                  <span className="bg-gradient-to-r from-sky-500 to-teal-600 bg-clip-text text-transparent mx-2">
                    Orbitt
                  </span>
                  With Us
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Join 50K+ students navigating campus life with ease
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="From lost in communication black holes to organized orbit - Orbitt saved my academic journey!"
                name="Akash Gupta"
                role="Biochemistry · Stellar University"
                avatar="https://api.dicebear.com/9.x/pixel-art/svg?seed=Akash&hair=short01"
                rating={4.9}
                delay={0.1}
              />
              <TestimonialCard
                quote="Found my study crew faster than a comet's tail! These orbit groups are magic 🌠"
                name="Vedant Patil"
                role="Computer Science · Tech Orbit Institute"
                avatar="https://api.dicebear.com/9.x/pixel-art/svg?seed=Vedant&hair=short02"
                rating={5}
                delay={0.2}
              />
              <TestimonialCard
                quote="Orbitt became my campus navigation system - finally found order in the chaos!"
                name="Pankaj Yadav"
                role="Engineering · Cosmic College"
                avatar="https://api.dicebear.com/9.x/pixel-art/svg?seed=Pankaj&hair=short03"
                rating={4.8}
                delay={0.3}
              />
            </div>

            {/* Trust Badges */}
            {/* <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-75">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white rounded-full shadow-sm border border-teal-100"
      >
        <Star className="h-4 w-4 text-amber-400" />
        <span>4.9/5 Galaxy Rating</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white rounded-full shadow-sm border border-sky-100"
      >
        <Users2 className="h-4 w-4 text-indigo-600" />
        <span>50K+ Campus Astronauts</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white rounded-full shadow-sm border border-cyan-100"
      >
        <Globe className="h-4 w-4 text-cyan-600" />
        <span>200+ Campus Orbits</span>
      </motion.div>
    </div> */}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent -z-10"></div>
          <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-64 h-64 rounded-full bg-gradient-to-br from-sky-100 to-teal-100 blur-3xl opacity-70 -z-10"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Badge className="mb-4 rounded-full bg-teal-50 text-teal-500 px-4 py-1.5 font-medium">FAQ</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Got questions? We've got answers.</p>
              </motion.div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <FaqItem
                question="Is orbitt free for students?"
                answer="Yes, orbitt is completely free for verified students. We offer premium features for a small monthly fee, but all core functionality is available in the free plan."
                delay={0.1}
              />
              <FaqItem
                question="How do I verify my student status?"
                answer="Simply sign up with your university email address (.edu or equivalent). We'll send you a verification link to confirm your student status."
                delay={0.2}
              />
              <FaqItem
                question="Can I use orbitt if my university isn't listed?"
                answer="If your university isn't listed, you can request to add it. We're constantly expanding our university database."
                delay={0.3}
              />
              <FaqItem
                question="Is my data secure on orbitt?"
                answer="We take data security very seriously. All your personal information and shared resources are encrypted and protected according to industry standards."
                delay={0.4}
              />
              <FaqItem
                question="Can professors join orbitt?"
                answer="Yes, professors can join with their university email. We offer special features for educators to create course groups and share official materials."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-teal-500 -z-10"></div>
          <div className="absolute inset-0 bg-[url('/star-pattern.svg')] opacity-20 -z-10"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  Ready to Launch Your Campus Orbitt?
                  <Rocket className="ml-3 inline-block h-12 w-12 text-cyan-200 animate-float" />
                </h2>

                <p className="text-lg md:text-xl text-cyan-50 mb-8">
                  Join 200+ students navigating their campus universe
                  <EarthIcon className="ml-2 inline-block h-6 w-6 text-white/80" />
                </p>

                <Button
                  onClick={() => {
                    setIsSignUp(true)
                    setIsModalOpen(true)
                  }}
                  className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-sky-600 
            hover:bg-gray-50 hover:shadow-2xl transform hover:scale-105 
            transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Free Journey
                    <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0%,transparent_100%)]" />
                </Button>
              </motion.div>

              {/* Space Background Elements */}
              <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xl">orbitt</span>
              </div>
              <p className="text-gray-400 mb-4">Connecting students. Empowering education.</p>
              <div className="flex gap-4">
                <SocialLink icon="facebook" />
                <SocialLink icon="twitter" />
                <SocialLink icon="instagram" />
                <SocialLink icon="github" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2 flex flex-row gap-3 items-center text-center">
                <FooterLink text="Features" />
                <FooterLink text="Pricing" />
                <FooterLink text="Testimonials" />
                <FooterLink text="FAQ" />
              </ul>
            </div>


          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} orbitt. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

// Helper Components
function NavLink({ href, children, isActive, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors relative ${isActive
        ? "text-sky-600 after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-sky-600"
        : "text-gray-600 hover:text-sky-600 after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-sky-600 hover:after:w-full after:transition-all"
        }`}
    >
      {children}
    </a>
  )
}

function StatCard({ number, label, icon, gradient, delay = 0 }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group p-6 text-center relative overflow-hidden rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md"
    >
      <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {number}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        {icon}
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,hsl(210,80%,96%)_0%,transparent_100%)]" />
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden border border-gray-100 hover:border-sky-100"
    >
      <div className="relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-sky-50 to-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-sky-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-gradient-to-tl from-sky-50 via-white to-teal-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

function TestimonialCard({ quote, name, role, avatar, rating, delay = 0 }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-sky-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-sky-50 to-teal-50 w-32 h-32 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Quote className="w-8 h-8 text-sky-100 mb-4" />
      <p className="text-gray-700 mb-6 relative">{quote}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
    </motion.div>
  )
}

function FaqItem({ question, answer, delay = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="border-b border-gray-200 pb-4"
    >
      <button
        className="flex rounded-sm justify-between items-center w-full py-4 text-left font-semibold group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="group-hover:text-sky-600 transition-colors">{question}</span>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-sky-100 transition-all ${isOpen ? "bg-sky-100" : ""}`}
        >
          <ChevronDown
            className={`w-5 h-5 text-gray-500 group-hover:text-sky-600 transition-all ${isOpen ? "transform rotate-180 text-sky-600" : ""
              }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 text-gray-600 pb-4 pl-4 border-l-2 border-sky-100">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SocialLink({ icon }) {
  const icons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1
.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
  }

  return (
    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
      {icons[icon]}
    </a>
  )
}

function FooterLink({ text }) {
  return (
    <li>
      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
        {text}
      </a>
    </li>
  )
}

