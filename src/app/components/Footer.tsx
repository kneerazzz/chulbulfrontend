import Container from "./ui/container";
import Logo from "./ui/logo";
import { Github, X, Linkedin, Instagram, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-black/80 backdrop-blur-md border-t border-white/10 text-white/80">
            <Container className="mx-auto max-w-[1200px] px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">

                {/* Brand Section */}
                <div className="flex flex-col gap-4 md:col-span-1">
                    <Logo />
                    <p className="text-sm text-gray-400 max-w-sm">
                        Plan, track, and accelerate your learning journey. Structure your growth with personalized skill development plans.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <a 
                            href="https://github.com/kneerazzz" 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <a 
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="X"
                        >
                            <X className="h-4 w-4" />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                        <a 
                            href="https://instagram.com/kneerazzz" 
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Platform Features */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-sm font-semibold text-white">Platform</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <a href="/skills" className="text-gray-400 hover:text-white transition-colors">My Skills</a>
                        <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
                        <a href="/skillPlans" className="text-gray-400 hover:text-white transition-colors">Learning Plans</a>
                        <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Progress Tracking</a>
                        <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Notifications</a>
                        <a href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</a>
                    </div>
                </div>

                {/* Features & Tools */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-sm font-semibold text-white">Features</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <a href="/skills/new" className="text-gray-400 hover:text-white transition-colors">Skill Categories</a>
                        <a href="/skills/new" className="text-gray-400 hover:text-white transition-colors">AI Suggestions</a>
                        <a href="/skills" className="text-gray-400 hover:text-white transition-colors">Learning Analytics</a>
                        <a href="/profile" className="text-gray-400 hover:text-white transition-colors">Streak Tracking</a>
                        <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Achievements</a>
                        <a href="/skillPlans" className="text-gray-400 hover:text-white transition-colors">Integrations</a>
                    </div>
                </div>

                {/* Resources & Support */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-sm font-semibold text-white">Resources</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">About SkillSprint</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
                        <a href="/" className="text-gray-400 hover:text-white transition-colors">Getting Started</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Learning Blog</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
                    </div>
                </div>

                {/* Legal & Contact */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-sm font-semibold text-white">Support</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <a 
                            href="mailto:contact@kneerazzz.dev" 
                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Mail className="h-3 w-3" />
                            Contact Support
                        </a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Help Center</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Feedback</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Report Bug</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/about" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

            </Container>

            {/* Bottom Section */}
            <div className="border-t border-white/10">
                <Container className="mx-auto max-w-[1200px] px-4 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-xs text-white/40">
                            © {new Date().getFullYear()} SkillSprint. All rights reserved. Built with ❤️ for learners.
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                            <span>Made by @kneerazzz</span>
                            <div className="flex items-center gap-2">
                                <span>Built with:</span>
                                <a 
                                    href="https://nextjs.org" 
                                    className="hover:text-white/60 transition-colors flex items-center gap-1"
                                >
                                    Next.js <ExternalLink className="h-3 w-3" />
                                </a>
                                <span>•</span>
                                <a 
                                    href="https://tailwindcss.com" 
                                    className="hover:text-white/60 transition-colors flex items-center gap-1"
                                >
                                    Tailwind <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    )
}

export default Footer;