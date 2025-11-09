import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CheckCircle, Clock, TrendingUp, Plus, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedFetch, createAuthenticatedAPI } from "@/lib/auth-api";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { UserProfile } from "@/components/AuthComponents";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  console.log('👩‍🏫 TEACHER DASHBOARD COMPONENT RENDERED');
  const { userInfo, isAuthenticated } = useAuth();
  const authFetch = useAuthenticatedFetch();
  const api = createAuthenticatedAPI(authFetch);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Use Auth0 user ID instead of hardcoded teacher ID
  const teacherId = userInfo?.id || '';

  const { data: teacherData, isLoading: teacherLoading } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: () => api.teacher.get(teacherId),
    enabled: !!teacherId && isAuthenticated,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['teacher-stats', teacherId],
    queryFn: () => api.teacher.getStats(teacherId),
    enabled: !!teacherId && isAuthenticated,
  });

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ['classes', teacherId],
    queryFn: () => api.class.getAll(teacherId),
    enabled: !!teacherId && isAuthenticated,
  });

  const { data: pendingSubmissionsData } = useQuery({
    queryKey: ['teacher-pending-submissions', teacherId],
    queryFn: () => api.teacher.getPendingSubmissions(teacherId),
    enabled: !!teacherId && isAuthenticated,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ questId, submissionId, data }: { questId: string; submissionId: string; data: { status: 'approved' | 'returned'; teacherId: string } }) =>
      api.quest.reviewSubmission(questId, submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-pending-submissions', teacherId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats', teacherId] });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please log in to access your dashboard</div>
      </div>
    );
  }

  if (teacherLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  // Use mock data for now if API doesn't return data
  const teacher = (teacherData as any)?.teacher || {
    id: teacherId,
    name: userInfo?.name || 'Teacher',
    email: userInfo?.email || 'teacher@example.com'
  };
  
  const stats = (statsData as any)?.stats || {
    activeStudents: 24,
    questsCompleted: 156,
    pendingReviews: 8,
    avgCompletion: 87,
    totalClasses: 3,
    conceptMastery: {
      'Needs vs Wants': 82,
      'Budgeting': 75,
      'Comparison': 88,
      'Goal Setting': 69
    }
  };
  
  const classes = (classesData as any)?.classes || [
    {
      id: 'class-1',
      name: 'Morning Math Class',
      grade: '3rd Grade',
      studentIds: ['1', '2', '3'],
      students: [
        { name: 'Alice', coins: 85 },
        { name: 'Bob', coins: 72 },
        { name: 'Carol', coins: 93 }
      ]
    }
  ];
  
  const allPendingSubmissions = (pendingSubmissionsData as any)?.submissions || [
    {
      id: 'sub-1',
      questId: 'quest-1',
      studentId: 'student-1',
      answer: 'I would choose the needs first.',
      student: { name: 'Alice' },
      quest: { title: 'Needs vs Wants', rewardCoins: 10 },
      createdAt: new Date().toISOString()
    }
  ];

  const handleApprove = async (questId: string, submissionId: string) => {
    try {
      await reviewMutation.mutateAsync({
        questId,
        submissionId,
        data: { status: 'approved', teacherId: teacherId },
      });
      toast.success('Quest approved! Coins awarded to student.');
    } catch (error) {
      toast.error('Failed to approve quest.');
    }
  };

  const handleReturn = async (questId: string, submissionId: string) => {
    try {
      await reviewMutation.mutateAsync({
        questId,
        submissionId,
        data: { status: 'returned', teacherId: teacherId },
      });
      toast.success('Quest returned to student.');
    } catch (error) {
      toast.error('Failed to return quest.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-purple/20 via-playful-yellow/10 to-coral/10">
      {/* Header */}
      <header className="border-b-4 border-deep-blue/20 bg-card/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-deep-blue">Teacher Dashboard</h1>
              <p className="text-deep-blue/70 font-medium text-lg">
                {userInfo?.name || teacher?.name || 'Loading...'} • Grade 3
              </p>
              {userInfo?.email && (
                <p className="text-sm text-deep-blue/50">{userInfo.email}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="border-2 border-deep-blue/30 hover:border-deep-blue hover:bg-light-purple/20 rounded-2xl"
              >
                <Settings className="h-6 w-6 text-deep-blue" />
              </Button>
              <Button className="bg-gradient-to-r from-deep-blue to-light-purple text-white font-bold shadow-lg hover:shadow-xl transition-all rounded-2xl">
                <Plus className="h-5 w-5 mr-2" />
                New Class
              </Button>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-4 border-4 border-light-purple/40 bg-gradient-to-br from-card to-light-purple/10 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <Users className="h-10 w-10 text-deep-blue" />
              <span className="text-4xl font-bold text-deep-blue">
                {statsLoading ? '...' : stats?.activeStudents || 0}
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-deep-blue">Active Students</p>
              <p className="text-sm text-deep-blue/70 font-medium">In all classes</p>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-4 border-success/40 bg-gradient-to-br from-card to-success/10 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-10 w-10 text-success" />
              <span className="text-4xl font-bold text-success">
                {statsLoading ? '...' : stats?.questsCompleted || 0}
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-deep-blue">Quests Completed</p>
              <p className="text-sm text-deep-blue/70 font-medium">This week</p>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-4 border-playful-yellow/40 bg-gradient-to-br from-card to-playful-yellow/10 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <Clock className="h-10 w-10 text-playful-yellow" />
              <span className="text-4xl font-bold text-playful-yellow">
                {statsLoading ? '...' : stats?.pendingReviews || 0}
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-deep-blue">Pending Reviews</p>
              <p className="text-sm text-deep-blue/70 font-medium">Need approval</p>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-4 border-coral/40 bg-gradient-to-br from-card to-coral/10 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-10 w-10 text-coral" />
              <span className="text-4xl font-bold text-coral">
                {statsLoading ? '...' : `${stats?.avgCompletion || 0}%`}
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-deep-blue">Avg. Completion</p>
              <p className="text-sm text-deep-blue/70 font-medium">Across all quests</p>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-14 bg-gradient-to-r from-light-purple/20 to-playful-yellow/20 border-3 border-deep-blue/20">
            <TabsTrigger value="classes" className="text-base font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-deep-blue data-[state=active]:to-light-purple data-[state=active]:text-white rounded-xl">
              Classes
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-base font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-playful-yellow data-[state=active]:to-coral data-[state=active]:text-white rounded-xl">
              Pending
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-success/80 data-[state=active]:text-white rounded-xl">
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Classes</h2>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Create Class
              </Button>
            </div>

            {classesLoading ? (
              <div className="text-center py-8">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-deep-blue/70">No classes yet. Create your first class!</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {classes.map((classItem) => (
                  <Card key={classItem.id} className="p-6 space-y-4 border-2 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {classItem.grade} • Complexity: {classItem.complexity}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/class/${classItem.id}`)}
                      >
                        Manage
                      </Button>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Students</span>
                        <span className="font-semibold text-foreground">
                          {classItem.students?.length || classItem.studentIds.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Join Code</span>
                        <span className="font-semibold text-foreground font-mono">{classItem.joinCode}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Join Code</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded-lg text-center font-mono font-bold text-lg">
                          {classItem.joinCode}
                        </code>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(classItem.joinCode);
                            toast.success('Join code copied!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Pending Reviews</h2>
            
            {allPendingSubmissions.length === 0 ? (
              <div className="text-center py-8 text-deep-blue/70">No pending reviews.</div>
            ) : (
              <div className="space-y-4">
                {allPendingSubmissions.map((submission) => (
                  <Card key={submission.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                          🐼
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-foreground">
                              {submission.student?.name || 'Unknown Student'}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Quest: "{submission.quest?.title || 'Unknown Quest'}"
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {submission.quest?.type} • {submission.quest?.rewardCoins} coins reward
                            </p>
                          </div>
                          <div className="bg-muted p-3 rounded-lg text-sm">
                            <p className="text-muted-foreground italic">{submission.answer}</p>
                          </div>
                          {submission.reflection && (
                            <div className="bg-primary/5 p-3 rounded-lg text-sm border border-primary/20">
                              <p className="text-primary font-medium">Reflection:</p>
                              <p className="text-muted-foreground italic">{submission.reflection}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleReturn(submission.questId, submission.id)}
                          disabled={reviewMutation.isPending}
                        >
                          Return
                        </Button>
                        <Button 
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleApprove(submission.questId, submission.id)}
                          disabled={reviewMutation.isPending}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Class Progress</h2>
            
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Concept Mastery</h3>
                {statsLoading ? (
                  <div className="text-center py-4">Loading progress...</div>
                ) : stats ? (
                  <div className="space-y-4">
                    {Object.entries(stats.conceptMastery).map(([concept, value]) => (
                      <div key={concept} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">{concept}</span>
                          <span className="text-muted-foreground">{value as number}%</span>
                        </div>
                        <Progress value={value as number} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No data available</div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
