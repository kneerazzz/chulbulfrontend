"use client";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Users, 
  Code, 
  Database, 
  Cloud, 
  Smartphone,
  ArrowRight,
  Mail,
  Github,
  Twitter,
  Zap,
  Award,
  BookOpen,
  Lightbulb,
  ChevronLeft,
  Plus,
  Instagram,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  const features = [
    {
      icon: Target,
      title: "Skill Plans",
      description: "Create personalized learning plans with clear target levels and realistic timelines.",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visual dashboards and detailed analytics to monitor your learning journey.",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Get intelligent recommendations to optimize your learning path and accelerate growth.",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Celebrate milestones and track your expertise across different skill domains.",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    }
  ];

  const techStack = [
    { name: "Next.js", category: "Frontend", icon: Code },
    { name: "TypeScript", category: "Language", icon: Code },
    { name: "TailwindCSS", category: "Styling", icon: Smartphone },
    { name: "Node.js", category: "Runtime", icon: Database },
    { name: "Express", category: "Backend", icon: Database },
    { name: "MongoDB", category: "Database", icon: Database },
    { name: "Zustand", category: "State", icon: Brain },
    { name: "Cloudinary", category: "Media", icon: Cloud }
  ];

  const steps = [
    { number: "01", title: "Sign Up", description: "Create your account and set up your profile" },
    { number: "02", title: "Choose Skills", description: "Select skills you want to develop and improve" },
    { number: "03", title: "Create Plans", description: "Set target levels and create structured learning plans" },
    { number: "04", title: "Track Progress", description: "Monitor your growth with detailed analytics and insights" },
    { number: "05", title: "Level Up", description: "Achieve your goals and unlock new skill levels" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()} 
              className="h-10 w-10 text-gray-400 hover:text-white hover:bg-neutral-800 mr-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-5xl font-bold text-white">SkillSprint</h1>
            </div>
          </div>
          
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Accelerate your learning journey with AI-powered skill tracking and personalized development plans
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-medium">
              🚀 AI-Powered
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
              📊 Progress Tracking
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-medium">
              🎯 Goal-Oriented
            </Badge>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              We believe that everyone has the potential to master new skills. SkillSprint transforms 
              the overwhelming process of learning into a structured, trackable, and rewarding journey. 
              By combining intelligent planning with progress visualization, we help you turn your 
              learning goals into measurable achievements.
            </p>
          </CardContent>
        </Card>

        {/* Core Features */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to plan, track, and accelerate your skill development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get started in 5 simple steps and begin your skill development journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-200">
                      <span className="text-white font-bold">{step.number}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Who It's For */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Who It's For</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Perfect for anyone who wants to structure their learning and see tangible progress
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Students",
                description: "Structure your academic learning and track skill development alongside your coursework.",
                color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
              },
              {
                icon: Code,
                title: "Professionals",
                description: "Advance your career by systematically developing new competencies and expertise.",
                color: "bg-green-500/20 text-green-400 border-green-500/30"
              },
              {
                icon: Users,
                title: "Hobbyists",
                description: "Turn your interests into structured learning experiences with clear progression paths.",
                color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
              }
            ].map((audience, index) => {
              const IconComponent = audience.icon;
              return (
                <Card key={index} className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-2xl border mx-auto mb-4 w-fit ${audience.color} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{audience.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Built With</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powered by modern technologies for performance, scalability, and user experience
            </p>
          </div>
          
          <Card className="bg-neutral-900 border-neutral-800 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {techStack.map((tech, index) => {
                  const IconComponent = tech.icon;
                  return (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className="p-4 bg-neutral-800 rounded-2xl border border-neutral-700 group-hover:border-neutral-600 group-hover:bg-neutral-700 transition-all duration-200 mb-3">
                        <IconComponent className="h-8 w-8 text-gray-400 group-hover:text-white mx-auto transition-colors duration-200" />
                      </div>
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                        {tech.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{tech.category}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="space-y-8">
          <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Have questions, suggestions, or found a bug? We'd love to hear from you!
              </p>
              
              <div className="flex justify-center gap-6">
                <Button onClick={() => router.push("https://github.com/kneerazzz")} variant="outline" className="bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
                <Button onClick={() => router.push("https://www.instagram.com/kneerazzz/")} variant="outline" className="bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white">
                  <Instagram className="h-4 w-4 mr-2" />
                  @kneerazzz
                </Button>
                <Button onClick={() => router.push("https://youtu.be/dQw4w9WgXcQ?si=6odd2YEYWpuhh90V")} variant="outline" className="bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white" >
                  <X className="h-4 w-4 mr-2" />
                   kneerazzz
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support - kneeraxzz@gmail.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Sprint Ahead?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already accelerating their skill development with SkillSprint
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push("/skills")}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Target className="h-5 w-5 mr-2" />
              View My Skills
            </Button>
            <Button 
              onClick={() => router.push("/skills/new")}
              variant="outline"
              className="bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white px-8 py-3 rounded-xl text-lg font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Skill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}