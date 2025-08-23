"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, Calendar, Target, CheckCircle, Lock } from "lucide-react";
import Loading from "./loading";
import { toast } from "sonner";

// Components
import DailyTopic from "./topic-content";
import Notes from "./notes";
import Actions from "./actions";
import { api } from "@/lib/api";

interface SkillPlanDetail {
  _id: string;
  skill: {
    _id: string;
    title: string;
    category: string;
    description: string;
  };
  targetLevel: string;
  durationInDays: number;
  currentDay: number;
  completedDays: number[];
  isCompleted: boolean;
  createdAt: string;
  lastDeliveredNote: Date;
  progress: number;
}

export default function DailySessionPage() {
  const params = useParams();
  const router = useRouter();
  const skillPlanId = params.skillPlanId as string;
  const day = Number(params.dayId);
  const [notesContent, setNotesContent] = useState("");
  const [skillPlan, setSkillPlan] = useState<SkillPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCompleteSuccess = () => {
    toast.success(`Day ${day} marked as complete!`);
    router.push(`/skillPlans/${skillPlanId}`);
  };

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/skillplans/c/${skillPlanId}/get-skill-plan`);
        if (!res.data.success) {
          toast.error(res.data.message || "something went wrong.");
        }
        setSkillPlan(res.data.data);
      } catch (err) {
        console.error("Failed to fetch skill plan:", err);
        toast.error("Failed to load skill plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlan();
  }, [skillPlanId]);

  if (loading) {
    return <Loading />;
  }

  if (!skillPlan) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Skill plan not found</p>
        <Button onClick={() => router.push("/skillPlans")}>
          Back to All Plans
        </Button>
      </div>
    );
  }

  const currentDay = skillPlan.currentDay;
  const isPastDay = day < currentDay;
  const isToday = day === currentDay;
  const isFutureDay = day > currentDay;
  const isCompletedDay = skillPlan.completedDays.includes(day);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Plan
          </Button>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{skillPlan.skill.title}</h1>
            <p className="text-sm text-muted-foreground">{skillPlan.skill.category}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-muted px-3 py-2 rounded-lg">
          {isFutureDay && <Lock className="h-4 w-4 text-amber-500" />}
          {isToday && <Target className="h-4 w-4 text-blue-500" />}
          {(isPastDay || isCompletedDay) && <CheckCircle className="h-4 w-4 text-green-500" />}
          
          <div className="text-sm">
            {isFutureDay && "Upcoming Day"}
            {isToday && "Current Day"}
            {(isPastDay || isCompletedDay) && "Completed Day"}
          </div>
          
          <div className="h-4 w-px bg-border mx-2"></div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Day {day} of {skillPlan.durationInDays}</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Today's Content
                </CardTitle>
                <CardDescription>
                  Study materials and resources for day {day}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                }>
                  <DailyTopic
                    skillPlanId={skillPlanId}
                    day={day}
                    currentDay={currentDay}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column - 1/3 width on large screens */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>
                  Record your thoughts and key takeaways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                }>
                  <Notes
                    skillPlanId={skillPlanId}
                    day={day}
                    onNotesChange={setNotesContent}
                    currentDay={currentDay}
                  />
                </Suspense>
              </CardContent>
            </Card>

            {/* Status and Actions Section */}
            {isToday && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Actions</CardTitle>
                  <CardDescription>
                    Complete your daily session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Actions
                    skillPlanId={skillPlanId}
                    day={day}
                    currentDay={currentDay}
                    notesContent={notesContent}
                    onComplete={handleCompleteSuccess}
                  />
                </CardContent>
              </Card>
            )}

            {(isPastDay || isCompletedDay) && (
              <Card className="bg-muted/50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Day Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    This day has been completed. You can review the content and
                    notes, but no further actions are available.
                  </p>
                  <Button
                    onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
                    className="w-full"
                    variant="outline"
                  >
                    Return to Plan Overview
                  </Button>
                </CardContent>
              </Card>
            )}

            {isFutureDay && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                    <Lock className="h-5 w-5" />
                    Upcoming Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 text-sm">
                    This day hasn&apos;t started yet. Complete the current day to
                    unlock future sessions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
}