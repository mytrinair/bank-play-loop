import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Target, ShoppingBag, BookOpen, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedFetch, createAuthenticatedAPI } from "@/lib/auth-api";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { UserProfile } from "@/components/AuthComponents";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  console.log('🎓 STUDENT DASHBOARD COMPONENT RENDERED');
  const { userInfo, isAuthenticated } = useAuth();
  const authFetch = useAuthenticatedFetch();
  const api = createAuthenticatedAPI(authFetch);
  const navigate = useNavigate();

  // Use Auth0 user ID instead of hardcoded student ID
  const studentId = userInfo?.id || '';

  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => api.student.get(studentId),
    enabled: !!studentId && isAuthenticated,
  });

  const { data: questsData, isLoading: questsLoading } = useQuery({
    queryKey: ['student-quests', studentId],
    queryFn: () => api.student.getQuests(studentId),
    enabled: !!studentId && isAuthenticated,
  });

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['student-activities', studentId],
    queryFn: () => api.student.getActivities(studentId),
    enabled: !!studentId && isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please log in to access your dashboard</div>
      </div>
    );
  }

  if (studentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  // Use mock student data for now if API doesn't return student data
  const student = (studentData as any)?.student || {
    id: studentId,
    name: userInfo?.name || 'Student',
    avatarId: 'default',
    coins: 50,
    saveAmount: 30,
    spendAmount: 20,
    currentGoal: {
      id: 'goal-1',
      name: 'New Backpack',
      targetAmount: 100,
      currentAmount: 30
    }
  };

  const quests = (questsData as any)?.quests || [
    {
      id: 'quest-1',
      title: 'Needs vs Wants Challenge',
      description: 'Help Sarah decide between needs and wants at the store',
      type: 'Needs vs Wants',
      rewardCoins: 10
    },
    {
      id: 'quest-2',
      title: 'Budget Planning',
      description: 'Create a budget for the school fair',
      type: 'Budgeting',
      rewardCoins: 15
    }
  ];
  
  const activities = (activitiesData as any)?.activities || [
    {
      id: 'activity-1',
      description: 'Completed "Shopping Trip" quest',
      coins: 10,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Calculate goal progress
  const goalProgress = student.currentGoal
    ? Math.round((student.currentGoal.currentAmount / student.currentGoal.targetAmount) * 100)
    : 0;
  
  const coinsRemaining = student.currentGoal
    ? Math.max(0, student.currentGoal.targetAmount - student.currentGoal.currentAmount)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-purple/30 via-playful-yellow/20 to-coral/20">
      {/* Header */}
      <header className="border-b-4 border-deep-blue/20 bg-card/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-playful-yellow via-coral to-light-purple flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform">
                {userInfo?.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt={userInfo.name} 
                    className="h-16 w-16 rounded-3xl object-cover"
                  />
                ) : (
                  student.avatarId === 'panda' ? '🐼' : '👤'
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-deep-blue">
                  Welcome back, {userInfo?.name || student.name}!
                </h1>
                <p className="text-sm text-deep-blue/70 font-medium">
                  {userInfo?.email && <span>{userInfo.email} • </span>}
                  Grade 3 • Mrs. Johnson's Class
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-r from-playful-yellow/30 to-playful-yellow/20 px-6 py-3 rounded-3xl shadow-md border-2 border-playful-yellow/40">
                <Coins className="h-6 w-6 text-playful-yellow coin-shimmer drop-shadow-md" />
                <span className="font-bold text-deep-blue text-xl">{student.coins} coins</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="border-2 border-deep-blue/30 hover:border-deep-blue hover:bg-light-purple/20 rounded-2xl"
              >
                <Settings className="h-6 w-6 text-deep-blue" />
              </Button>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Money Jars */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Save Jar */}
          <Card className="p-8 space-y-5 border-4 border-success/40 bg-gradient-to-br from-card via-success/5 to-success/10 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-blue">Save Jar</h3>
                  <p className="text-sm text-deep-blue/70 font-medium">For future goals 🎯</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-success">{student.saveAmount}</p>
                <p className="text-sm text-deep-blue/70 font-semibold">coins</p>
              </div>
            </div>
            
            {/* Goal Progress */}
            {student.currentGoal && (
              <div className="space-y-3 pt-4 border-t-2 border-success/30">
                <div className="flex justify-between text-sm">
                  <span className="text-deep-blue/80 font-medium">Current Goal: {student.currentGoal.name}</span>
                  <span className="font-bold text-success text-lg">{goalProgress}%</span>
                </div>
                <Progress value={goalProgress} className="h-4 bg-success/20" />
                {coinsRemaining > 0 ? (
                  <p className="text-sm text-deep-blue/70 font-medium">✨ {coinsRemaining} more coins to reach your goal!</p>
                ) : (
                  <p className="text-sm text-success font-medium">🎉 Goal reached!</p>
                )}
              </div>
            )}
          </Card>

          {/* Spend Jar */}
          <Card className="p-8 space-y-5 border-4 border-coral/40 bg-gradient-to-br from-card via-coral/5 to-coral/10 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-coral to-coral/70 flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-blue">Spend Jar</h3>
                  <p className="text-sm text-deep-blue/70 font-medium">For fun now 🎉</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-coral">{student.spendAmount}</p>
                <p className="text-sm text-deep-blue/70 font-semibold">coins</p>
              </div>
            </div>
            
            <div className="pt-4 border-t-2 border-coral/30">
              <Button className="w-full bg-gradient-to-r from-coral to-coral/80 hover:from-coral/90 hover:to-coral/70 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" size="lg">
                🛍️ Visit Store
              </Button>
            </div>
          </Card>
        </div>

        {/* Today's Quests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gradient-to-r from-light-purple/30 to-playful-yellow/20 p-6 rounded-3xl border-3 border-deep-blue/20">
            <h2 className="text-3xl font-bold text-deep-blue flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-deep-blue" />
              Today's Quests ⭐
            </h2>
            <span className="text-lg text-deep-blue/80 font-bold bg-playful-yellow/30 px-4 py-2 rounded-full">
              {questsLoading ? '...' : `${quests.length} available`}
            </span>
          </div>

          {questsLoading ? (
            <div className="text-center py-8">Loading quests...</div>
          ) : quests.length === 0 ? (
            <div className="text-center py-8 text-deep-blue/70">No quests available at the moment.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {quests.map((quest) => {
                const typeColors: Record<string, { bg: string; border: string; text: string }> = {
                  'Needs vs Wants': {
                    bg: 'from-deep-blue/20 to-light-purple/20',
                    border: 'border-deep-blue/20',
                    text: 'text-deep-blue',
                  },
                  'Budgeting': {
                    bg: 'from-success/20 to-success/10',
                    border: 'border-success/30',
                    text: 'text-success',
                  },
                  'Comparison': {
                    bg: 'from-playful-yellow/20 to-coral/20',
                    border: 'border-playful-yellow/30',
                    text: 'text-playful-yellow',
                  },
                  'Goal Setting': {
                    bg: 'from-light-purple/20 to-deep-blue/20',
                    border: 'border-light-purple/30',
                    text: 'text-light-purple',
                  },
                };
                
                const colors = typeColors[quest.type] || typeColors['Needs vs Wants'];
                const typeEmojis: Record<string, string> = {
                  'Needs vs Wants': '🤔',
                  'Budgeting': '💰',
                  'Comparison': '🔍',
                  'Goal Setting': '🎯',
                };
                
                return (
                  <Card key={quest.id} className="p-8 space-y-5 border-4 border-light-purple/50 hover:border-deep-blue/50 bg-gradient-to-br from-card to-light-purple/10 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colors.bg} ${colors.text} text-sm font-bold border-2 ${colors.border}`}>
                          {quest.type} {typeEmojis[quest.type]}
                        </div>
                        <h3 className="text-2xl font-bold text-deep-blue group-hover:text-light-purple transition-colors">
                          {quest.title}
                        </h3>
                        <p className="text-deep-blue/70 font-medium text-base">
                          {quest.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t-2 border-light-purple/30">
                      <div className="flex items-center gap-3 text-playful-yellow">
                        <Coins className="h-7 w-7 coin-shimmer drop-shadow-md" />
                        <span className="font-bold text-xl text-deep-blue">+{quest.rewardCoins} coins</span>
                      </div>
                      <Button className="bg-gradient-to-r from-light-purple to-deep-blue text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        Start Quest →
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="p-8 space-y-6 border-4 border-playful-yellow/40 bg-gradient-to-br from-card to-playful-yellow/5 shadow-xl">
          <h3 className="text-2xl font-bold text-deep-blue flex items-center gap-2">
            Recent Activity 📜
          </h3>
          {activitiesLoading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-4 text-deep-blue/70">No activities yet.</div>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => {
                const isPositive = (activity.coins || 0) > 0;
                const bgColor = isPositive 
                  ? 'from-success/10 to-success/5 border-success/20 hover:border-success/40'
                  : 'from-coral/10 to-coral/5 border-coral/20 hover:border-coral/40';
                const iconBg = isPositive
                  ? 'from-success to-success/70'
                  : 'from-coral to-coral/70';
                const icon = isPositive ? '✓' : '🛍️';
                
                return (
                  <div key={activity.id} className={`flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r ${bgColor} border-2 transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-2xl shadow-md`}>
                        {icon}
                      </div>
                      <div>
                        <p className="font-bold text-deep-blue text-lg">{activity.description}</p>
                        <p className="text-sm text-deep-blue/70 font-medium">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {activity.coins && (
                      <div className={`font-bold text-xl ${isPositive ? 'text-success' : 'text-coral'}`}>
                        {activity.coins > 0 ? '+' : ''}{activity.coins} coins
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
