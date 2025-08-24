"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skill, SkillPlan } from "@/types";
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
  TrendingUp,
  Loader2,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Award,
  FileText,
  Clock,
  CheckCircle,
  PlayCircle,
  BookmarkPlus
} from "lucide-react";
import { api } from "@/lib/api";

export default function SkillDetailPage({ params }: { params: Promise<{ skillId: string }> }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [skillPlan, setSkillPlan] = useState<SkillPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  async function deleteSkill() {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      await api.delete(`/skills/c/${skillId}/delete-skill`, {
        withCredentials: true
      });

      toast.success("Skill deleted successfully");
      router.push("/skills");

    } catch (error: any) {
      console.log(error);
      toast.error("Failed to delete skill");
    } finally {
      setActionLoading(false);
    }
  }

  async function createSkillPlan() {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      router.push(`/skills/${skillId}/create-plan`);
    } catch (error) {
      console.error("Error navigating to create plan", error);
      toast.error("Failed to navigate to create plan");
    } finally {
      setActionLoading(false);
    }
  }

  async function updateSkill() {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const resolvedParams = await params;
      const { skillId } = resolvedParams;

      router.push(`/skills/${skillId}/update`);

    } catch (error) {
      console.error("Error navigating to update skill", error);
      toast.error("Failed to navigate to update skill");
    } finally {
      setActionLoading(false);
    }
  }

  async function viewSkillPlan() {
    if (actionLoading || !skillPlan) return;
    setActionLoading(true);
    
    try {
      router.push(`/skillPlans/${skillPlan._id}`);
    } catch (error) {
      console.error("Error navigating to skill plan", error);
      toast.error("Failed to navigate to skill plan");
    } finally {
      setActionLoading(false);
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

        setSkill(response.data.data.skill);
        setSkillPlan(response.data.data.skillPlan || null);
      } catch (error: any) {
        console.error("[Frontend] Full error details:", {
          message: error.message,
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        setError("Failed to load skill");
        toast.error("Failed to load skill details");
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

  // Calculate skill plan progress if it exists
  const getSkillPlanProgress = () => {
    if (!skillPlan) return 0;
    
    const completedDays = skillPlan.completedDays?.length || 0;
    const totalDays = skillPlan.durationInDays || 30;
    
    return Math.round((completedDays / totalDays) * 100);
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
  const planProgress = getSkillPlanProgress();

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
            <div className="flex items-center gap-3 flex-wrap">
              <Badge 
                variant="outline" 
                className="text-sm px-3 py-1 bg-neutral-800 text-gray-300 border-neutral-600 capitalize"
              >
                {skill.category.replace("-", " ")}
              </Badge>
              <Badge className={`${levelInfo.color} border font-medium`}>
                {levelInfo.label}
              </Badge>
              {skillPlan && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {skillPlan.isCompleted ? 'Plan Completed' : 'Plan Active'}
                </Badge>
              )}
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
                {/* Skill Proficiency Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">Skill Proficiency</span>
                    <span className="text-sm">{Math.round(skillProgress)}%</span>
                  </div>
                  <Progress value={skillProgress} className="h-2 bg-neutral-700" />
                </div>

                {/* Plan Progress (if exists) */}
                {skillPlan && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-sm font-medium">Learning Plan Progress</span>
                      <span className="text-sm">{planProgress}%</span>
                    </div>
                    <Progress value={planProgress} className="h-2 bg-neutral-700" />
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        Day {skillPlan.currentDay} of {skillPlan.durationInDays} 
                        {skillPlan.isCompleted && " • Completed!"}
                      </span>
                    </div>
                  </div>
                )}

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
                    <p className="font-semibold text-white text-lg">
                      {skillPlan ? `${planProgress}%` : `${Math.round(skillProgress)}%`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {skillPlan ? 'Plan Progress' : 'Skill Level'}
                    </p>
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
                  {skillPlan && (
                    <>
                      <div>
                        <h4 className="font-medium text-white mb-1">Target Level</h4>
                        <p className="text-gray-400 capitalize">{skillPlan.targetLevel}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">Plan Duration</h4>
                        <p className="text-gray-400">{skillPlan.durationInDays} days</p>
                      </div>
                    </>
                  )}
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
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={updateSkill}
                  disabled={actionLoading}
                  variant="outline" 
                  className="w-full justify-start gap-2 bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:text-white disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit Skill
                </Button>
                <Button 
                  onClick={deleteSkill}
                  disabled={actionLoading}
                  variant="outline" 
                  className="w-full justify-start gap-2 text-red-400 border-red-500/30 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Skill
                </Button>
              </CardContent>
            </Card>

            {/* Learning Plan Section */}
            {skillPlan ? (
              <Card className="bg-neutral-900 border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5 text-green-400" />
                    Learning Plan
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    {skillPlan.isCompleted 
                      ? 'Congratulations! You completed your learning plan.' 
                      : 'You have an active learning plan for this skill'
                    }
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Plan Status */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                    skillPlan.isCompleted 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}>
                    <div className={`h-5 w-5 flex-shrink-0 ${
                      skillPlan.isCompleted ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {skillPlan.isCompleted ? <CheckCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        skillPlan.isCompleted ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {skillPlan.isCompleted ? 'Plan Completed!' : 'Plan Active'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {skillPlan.isCompleted 
                          ? `Completed in ${skillPlan.completedDays?.length || 0} days`
                          : `Day ${skillPlan.currentDay} of ${skillPlan.durationInDays}`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Plan Progress Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">{planProgress}%</span>
                    </div>
                    <Progress value={planProgress} className="h-1 bg-neutral-700" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{skillPlan.completedDays?.length || 0} completed</span>
                      <span>{skillPlan.durationInDays} total days</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={viewSkillPlan}
                    disabled={actionLoading}
                    className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 border-0 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    {skillPlan.isCompleted ? 'View Completed Plan' : 'Continue Learning Plan'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BookmarkPlus className="h-5 w-5 text-gray-400" />
                    Start Learning
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    Create a structured learning plan to improve this skill systematically
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">What you&apos;ll get:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Personalized daily learning topics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Progress tracking and streaks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Structured learning path</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={createSkillPlan}
                    disabled={actionLoading}
                    className="w-full gap-2 bg-white text-black hover:bg-gray-100 border-0 disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Create Learning Plan
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Level Breakdown Card */}
            <Card className="bg-neutral-900 border-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-white">Proficiency Levels</CardTitle>
                <p className="text-gray-400 text-sm">Track your skill development journey</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[
                    { level: "beginner", description: "Learning basics", percentage: 25 },
                    { level: "intermediate", description: "Good working knowledge", percentage: 50 },
                    { level: "advanced", description: "Strong expertise", percentage: 75 },
                    { level: "expert", description: "Master level", percentage: 100 }
                  ].map((item) => {
                    const isCurrent = skill.level.toLowerCase() === item.level;
                    const levelColor = getLevelColor(item.level);
                    
                    return (
                      <div key={item.level} className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                        isCurrent ? 'bg-neutral-800 border border-neutral-600' : 'hover:bg-neutral-800/50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            isCurrent ? levelColor.color.split(' ')[0] : "bg-neutral-700"
                          }`}></div>
                          <span className={`text-sm ${isCurrent ? "font-bold text-white" : "text-gray-400"}`}>
                            {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs ${isCurrent ? "font-bold text-white" : "text-gray-500"}`}>
                            {item.description}
                          </span>
                          <div className={`text-xs ${isCurrent ? "text-white" : "text-gray-500"}`}>
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-3 border-t border-neutral-700">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                      Current: <span className={`font-medium ${levelInfo.color.split(' ')[1]}`}>{levelInfo.label}</span>
                    </p>
                    {skillPlan && (
                      <p className="text-sm text-gray-400">
                        Target: <span className="font-medium text-blue-400 capitalize">{skillPlan.targetLevel}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}