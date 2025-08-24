"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Plus, 
  BookOpen, 
  Target, 
  Calendar, 
  TrendingUp,
  Loader2,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Award,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

export default function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function deleteSkill() {
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      await api.delete(`/skills/c/${skillId}/delete-skill`, {
        withCredentials: true
      });

      toast.success("Skill deleted successfully");
      router.push("/skills");

    } catch (error: any) {
      setError("Failed to delete skill");
      console.log(error)
      toast.error("Failed to delete skill");
    }
  }

  async function createSkillPlan() {
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      router.push(`/skills/${skillId}/create-plan`);
    } catch (error) {
      console.error("Error in create-plan", error);
      setError("Failed to create-plan");
    }
  }

  async function updateSkill() {
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      router.push(`/skills/${skillId}/update`);

    } catch (error) {
      console.error("Error in updating skill", error);
      setError("Failed to update skill");
    }
  }

  useEffect(() => {
    async function fetchSkill() {
      try {
        const resolvedParams = await params;
        const { skillId } = resolvedParams;

        const response = await api.get(`/skills/c/${skillId}/get-skill`, {
          withCredentials: true
        });

        setSkill(response.data.data);
      } catch (error: any) {
        console.error("[Frontend] Full error details:", {
          message: error.message,
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        setError("Failed to load skill");
      } finally {
        setLoading(false);
      }
    }

    fetchSkill();
  }, [params]);

  // Get level color and label
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return { 
          color: "bg-red-500/20 text-red-400 border-red-500/30", 
          label: "Beginner" 
        };
      case "intermediate":
        return { 
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
          label: "Intermediate" 
        };
      case "advanced":
        return { 
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
          label: "Advanced" 
        };
      case "expert":
        return { 
          color: "bg-green-500/20 text-green-400 border-green-500/30", 
          label: "Expert" 
        };
      default:
        return { 
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30", 
          label: "Beginner" 
        };
    }
  };

  // Get level progress percentage (out of 4 levels)
  const getLevelProgress = (level: string): number => {
    switch (level.toLowerCase()) {
      case "beginner": return 25;
      case "intermediate": return 50;
      case "advanced": return 75;
      case "expert": return 100;
      default: return 25;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 text-lg">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-neutral-900 border-neutral-700 shadow-lg max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Skill Not Found</h3>
            <p className="text-gray-400 mb-6">
              The skill you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button 
              onClick={() => router.push("/skills")} 
              className="bg-white text-black hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Skills
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelInfo = getLevelColor(skill.level);
  const skillProgress = getLevelProgress(skill.level);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-neutral-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{skill.title}</h1>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className="text-sm px-3 py-1 bg-neutral-800 text-gray-300 border-neutral-600 capitalize"
              >
                {skill.category.replace("-", " ")}
              </Badge>
              <Badge className={`${levelInfo.color} border font-medium`}>
                {levelInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Overview Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Overall Proficiency</span>
                    <span className="text-sm">{Math.round(skillProgress)}%</span>
                  </div>
                  <Progress value={skillProgress} className="h-2 bg-neutral-700" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Target className="h-4 w-4" />
                      <span className="text-xs">Current Level</span>
                    </div>
                    <p className="font-semibold text-white text-lg">{levelInfo.label}</p>
                    <p className="text-xs text-gray-400">Proficiency</p>
                  </div>
                  
                  <div className="flex flex-col gap-1 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs">Progress</span>
                    </div>
                    <p className="font-semibold text-white text-lg">{Math.round(skillProgress)}%</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                  
                  <div className="flex flex-col gap-1 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Award className="h-4 w-4" />
                      <span className="text-xs">Category</span>
                    </div>
                    <p className="font-semibold text-white text-sm capitalize">{skill.category.replace("-", " ")}</p>
                    <p className="text-xs text-gray-400">Domain</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  Description & Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {skill.description || "No description available for this skill."}
                  </p>
                </div>
                
                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                  <div>
                    <h4 className="font-medium text-white mb-1">Skill Category</h4>
                    <p className="text-gray-400 capitalize">{skill.category.replace("-", " ")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Proficiency Level</h4>
                    <p className="text-gray-400">{levelInfo.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                  Plan Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={updateSkill}
                  variant="outline" 
                  className="w-full justify-start gap-2 bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                  Edit Skill
                </Button>
                <Button 
                  onClick={deleteSkill}
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-400 border-red-500/30 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Skill
                </Button>
              </CardContent>
            </Card>

            {/* Create Plan Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  Learning Plan
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Create a structured learning plan to improve this skill
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={createSkillPlan}
                  className="w-full gap-2 bg-white text-black hover:bg-gray-100 border-0"
                >
                  <Plus className="h-4 w-4" />
                  Create Learning Plan
                </Button>
              </CardContent>
            </Card>

            {/* Level Breakdown Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-white">Level Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[
                    { level: "beginner", range: "1-3", description: "Learning basics" },
                    { level: "intermediate", range: "4-6", description: "Good working knowledge" },
                    { level: "advanced", range: "7-8", description: "Strong expertise" },
                    { level: "expert", range: "9-10", description: "Master level" }
                  ].map((item) => {
                    const isCurrent = skill.level.toLowerCase() === item.level;
                    const levelColor = getLevelColor(item.level);
                    
                    return (
                      <div key={item.level} className="flex justify-between items-center py-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${isCurrent ? levelColor.color.split(' ')[0] : "bg-neutral-700"}`}></div>
                          <span className={`text-sm ${isCurrent ? "font-bold text-white" : "text-gray-400"}`}>
                            {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                          </span>
                        </div>
                        <span className={`text-xs ${isCurrent ? "font-bold text-white" : "text-gray-500"}`}>
                          {item.range}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-3 border-t border-neutral-700">
                  <p className="text-sm text-gray-400">
                    Current: <span className={`font-medium ${levelInfo.color.split(' ')[1]}`}>{levelInfo.label}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}