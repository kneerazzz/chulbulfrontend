'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Trash2, Calendar, BookOpen, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { api } from '@/lib/api';

interface DailyTopicProps {
  skillPlanId: string;
  day: number;
  currentDay: number;
}

interface TopicData {
  topic: string;
  description: string;
  content: string;
  optionalTip?: string;
  isRegenerated?: boolean;
  generatedAt?: string;
  day?: number;
}

export default function DailyTopic({ skillPlanId, day, currentDay }: DailyTopicProps) {
  const router = useRouter();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Determine access permissions
  const isCurrentDay = day === currentDay;
  const isPastDay = day < currentDay;
  const isFutureDay = day > currentDay;
  const canEdit = isCurrentDay;

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/dailyTopics/c/${skillPlanId}/get-topic?day=${day}`, {
          withCredentials: true
        });
        
        if(!res.data.success){
          toast.error(res.data.message ||"something went wrong.")
        }
        const data = res.data.data;
        setTopic(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [skillPlanId, day]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await api.get(`/dailyTopics/c/${skillPlanId}/regenerate-topic`, {
        withCredentials: true
      });

      if (!res.data.success) throw new Error('Failed to regenerate topic');
      const newTopic = res.data.data;
      setTopic(newTopic);
      toast.success("Topic regenerated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Regeneration failed');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await api.delete(`/dailyTopics/c/${skillPlanId}/delete-topic`, {
        withCredentials: true
      });

      if(!res.data.success){
        toast.error(res.data.message ||"something went wrong.")
      }
      toast.success("Topic deleted successfully");
      setTopic(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Loading Day {day}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-2">
        <AlertTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Error Loading Topic
        </AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!topic) {
    return (
      <Card className="border-2 border-dashed border-muted bg-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Day {day}</CardTitle>
            </div>
            <Badge variant="outline" className="capitalize">
              {isFutureDay ? 'Upcoming' : isPastDay ? 'Completed' : 'Current'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {isFutureDay 
                ? "This day hasn't started yet. Complete previous days to unlock."
                : "No topic has been generated for this day yet."
              }
            </p>
            {!isFutureDay && (
              <Button 
                onClick={() => router.push(`/skillPlans/${skillPlanId}`)}
                variant="outline"
              >
                Generate Topic
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Day {day}: {topic.topic}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isCurrentDay ? 'Current Session' : isPastDay ? 'Completed Session' : 'Upcoming Session'}
              </p>
            </div>
          </div>
          <Badge variant={isCurrentDay ? "default" : "secondary"} className="capitalize">
            {isCurrentDay ? 'Active' : isPastDay ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>

        {topic.description && (
          <p className="text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
            {topic.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for different markdown elements
              h1: ({children}) => (
                <h1 className="text-2xl font-bold mb-4 text-primary border-b-2 border-primary/20 pb-2">
                  {children}
                </h1>
              ),
              h2: ({children}) => (
                <h2 className="text-xl font-semibold mb-3 text-primary mt-6">
                  {children}
                </h2>
              ),
              h3: ({children}) => (
                <h3 className="text-lg font-medium mb-2 text-foreground mt-4">
                  {children}
                </h3>
              ),
              h4: ({children}) => (
                <h4 className="text-base font-medium mb-2 text-foreground mt-3">
                  {children}
                </h4>
              ),
              p: ({children}) => (
                <p className="mb-4 leading-7 text-foreground/90">
                  {children}
                </p>
              ),
              ul: ({children}) => (
                <ul className="mb-4 pl-6 space-y-2 list-disc marker:text-primary">
                  {children}
                </ul>
              ),
              ol: ({children}) => (
                <ol className="mb-4 pl-6 space-y-2 list-decimal marker:text-primary">
                  {children}
                </ol>
              ),
              li: ({children}) => (
                <li className="leading-6 text-foreground/90">
                  {children}
                </li>
              ),
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 py-2 mb-4 bg-muted/30 rounded-r-lg italic text-foreground/80">
                  {children}
                </blockquote>
              ),
              code: ({node, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const inline = !match;
                
                if (inline) {
                  return (
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary" {...props}>
                      {children}
                    </code>
                  );
                }
                
                return (
                  <div className="mb-4">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto border">
                      <code className={`text-sm font-mono ${className}`} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
              strong: ({children}) => (
                <strong className="font-semibold text-primary">
                  {children}
                </strong>
              ),
              em: ({children}) => (
                <em className="italic text-foreground/80">
                  {children}
                </em>
              ),
              table: ({children}) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-border rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({children}) => (
                <thead className="bg-muted">
                  {children}
                </thead>
              ),
              tbody: ({children}) => (
                <tbody className="divide-y divide-border">
                  {children}
                </tbody>
              ),
              th: ({children}) => (
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  {children}
                </th>
              ),
              td: ({children}) => (
                <td className="px-4 py-3 text-foreground/90">
                  {children}
                </td>
              ),
              hr: () => (
                <hr className="my-6 border-border" />
              )
            }}
          >
            {topic.content}
          </ReactMarkdown>
        </div>

        {topic.optionalTip && (
          <Alert className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-200">Pro Tip</AlertTitle>
            <AlertDescription className="text-amber-900 dark:text-amber-300">
              {topic.optionalTip}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {canEdit && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating || deleting}
              className="flex-1 cursor-pointer"
            >
              {regenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={regenerating || deleting}
              className="flex-1 cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        )}

        {topic.isRegenerated && topic.generatedAt && (
          <div className="text-xs text-muted-foreground text-center w-full">
            Regenerated on {new Date(topic.generatedAt).toLocaleDateString()} at{' '}
            {new Date(topic.generatedAt).toLocaleTimeString()}
          </div>
        )}

        {!canEdit && (
          <div className="text-sm text-muted-foreground text-center w-full">
            {isPastDay 
              ? "This session has been completed. Actions are no longer available."
              : "This session hasn't started yet. Complete previous days to unlock."
            }
          </div>
        )}
      </CardFooter>
    </Card>
  );
}