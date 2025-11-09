import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Target, ShoppingBag, BookOpen, Settings, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedFetch, createAuthenticatedAPI } from "@/lib/auth-api";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { UserProfile } from "@/components/AuthComponents";
import { useNavigate } from "react-router-dom";
import { NavLink } from '../components/NavLink';
import NeedsVsWantsQuest from "../components/quests/NeedsVsWantsQuest";
import MiniLifeWeekQuest from "../components/quests/MiniLifeWeekQuest";
import GardenTimeQuest from "../components/quests/GardenTimeQuest";
import SnackStandQuest from "../components/quests/SnackStandQuest";
import FirstGoalPosterQuest from "../components/quests/FirstGoalPosterQuest";
import BirthdayMoneyQuest from "../components/quests/BirthdayMoneyQuest";
import MiniWeekBudgetQuest from "../components/quests/MiniWeekBudgetQuest";
import SurpriseExpenseQuest from "../components/quests/SurpriseExpenseQuest";
import SmartShopperQuest from "../components/quests/SmartShopperQuest";
import DojoUpgradeQuest from "../components/quests/DojoUpgradeQuest";
import React from 'react';

const StudentDashboard = () => {
  console.log('🎓 STUDENT DASHBOARD COMPONENT RENDERED');
  const { userInfo, isAuthenticated } = useAuth();
  const authFetch = useAuthenticatedFetch();
  const api = createAuthenticatedAPI(authFetch);
  const navigate = useNavigate();
  
  // Use Auth0 user ID instead of hardcoded student ID
  const studentId = userInfo?.id || '';
  
  // Quest game state
  const [showNeedsVsWantsQuest, setShowNeedsVsWantsQuest] = useState(false);
  const [showMiniLifeWeekQuest, setShowMiniLifeWeekQuest] = useState(false);
  const [showGardenTimeQuest, setShowGardenTimeQuest] = useState(false);
  const [showSnackStandQuest, setShowSnackStandQuest] = useState(false);
  const [showFirstGoalPosterQuest, setShowFirstGoalPosterQuest] = useState(false);
  const [showBirthdayMoneyQuest, setShowBirthdayMoneyQuest] = useState(false);
  const [showMiniWeekBudgetQuest, setShowMiniWeekBudgetQuest] = useState(false);
  const [showSurpriseExpenseQuest, setShowSurpriseExpenseQuest] = useState(false);
  const [showSmartShopperQuest, setShowSmartShopperQuest] = useState(false);
  const [showDojoUpgradeQuest, setShowDojoUpgradeQuest] = useState(false);
  const [currentCoins, setCurrentCoins] = useState(() => {
    // Load coins from localStorage or default to 50
    const savedCoins = localStorage.getItem(`student-${studentId}-coins`);
    return savedCoins ? parseInt(savedCoins) : 50;
  });

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
    coins: currentCoins, // Use state-managed coins that persist in localStorage
    saveAmount: 30,
    spendAmount: 20,
    currentGoal: {
      id: 'goal-1',
      name: 'New Backpack',
      targetAmount: 100,
      currentAmount: 30
    }
  };

  // Handle quest completion
  const handleQuestComplete = (reward: { coins: number; badge: string }, questId?: string) => {
    // Update coins in state and localStorage
    const newCoins = currentCoins + reward.coins;
    setCurrentCoins(newCoins);
    localStorage.setItem(`student-${studentId}-coins`, newCoins.toString());
    
    // Store badge in localStorage (simple array of earned badges)
    const existingBadges = JSON.parse(localStorage.getItem(`student-${studentId}-badges`) || '[]');
    if (!existingBadges.includes(reward.badge)) {
      existingBadges.push(reward.badge);
      localStorage.setItem(`student-${studentId}-badges`, JSON.stringify(existingBadges));
    }
    
    // Store quest completion data for teacher dashboard
    if (questId) {
      const questCompletionData = {
        completed: true,
        completedAt: new Date().toISOString(),
        coinsEarned: reward.coins,
        badgeEarned: reward.badge
      };
      localStorage.setItem(`student-${studentId}-${questId}-completed`, JSON.stringify(questCompletionData));
    }
    
    // Show success message
    alert(`🎉 Quest Complete! You earned ${reward.coins} coins and the ${reward.badge} badge!`);
    
    // Close all quest modals
    setShowNeedsVsWantsQuest(false);
    setShowMiniLifeWeekQuest(false);
    setShowGardenTimeQuest(false);
    setShowSnackStandQuest(false);
    setShowFirstGoalPosterQuest(false);
    setShowBirthdayMoneyQuest(false);
    setShowMiniWeekBudgetQuest(false);
    setShowSurpriseExpenseQuest(false);
    setShowSmartShopperQuest(false);
    setShowDojoUpgradeQuest(false);
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
      title: 'Garden Time!',
      description: 'You just earned 15 coins for helping clean the class garden. What do you want to do with the money?',
      type: 'Saving vs Spending',
      rewardCoins: 15
    },
    {
      id: 'quest-3',
      title: 'The Snack Stand Dilemma',
      description: 'After school, you want a snack. What snack should you get?',
      type: 'Opportunity Cost',
      rewardCoins: 15
    },
    {
      id: 'quest-4',
      title: 'My First Goal Poster',
      description: 'Set the goal and decide how much to save per week.',
      type: 'Goal Planning',
      rewardCoins: 20
    },
    {
      id: 'quest-5',
      title: "It's Your Birthday",
      description: 'You got 25 coins for your birthday. How are you going to spend your birthday money?',
      type: 'Long-term vs Short-term',
      rewardCoins: 25
    },
    {
      id: 'quest-6',
      title: 'The Mini-Week Budget',
      description: 'You earn 20 coins each "week." Create your weekly plan.',
      type: 'Budget Balancing',
      rewardCoins: 25
    },
    {
      id: 'quest-7',
      title: 'The Surprise Expense',
      description: "Your pet's toy broke — replacement costs 6 coins. How are you going to pay for the replacement?",
      type: 'Unexpected Expenses',
      rewardCoins: 20
    },
    {
      id: 'quest-8',
      title: 'The Smart Shopper Challenge',
      description: 'Two backpacks are on sale, both are a different price and quality. Choose which to buy and explain why.',
      type: 'Value Comparison',
      rewardCoins: 25
    },
    {
      id: 'quest-9',
      title: 'My Dojo Upgrade Plan',
      description: 'Design your dojo room. Each item has a price and make sure not to go over budget.',
      type: 'Budget Constraints',
      rewardCoins: 30
    },
    {
      id: 'quest-10',
      title: 'The Mini-Life Week',
      description: 'Live a full week making money choices - earn, spend, save for 5 days!',
      type: 'Life Simulation',
      rewardCoins: 20
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
                  Grade 3 • Mrs. Nair's Class
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
            
            <div className="pt-4 border-t-2 border-coral/30 space-y-3">
              <Button 
                onClick={() => navigate('/room')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" 
                size="lg"
              >
                <Home className="h-5 w-5 mr-2" />
                My Room
              </Button>
              <Button 
                onClick={() => navigate('/store')}
                className="w-full bg-gradient-to-r from-coral to-coral/80 hover:from-coral/90 hover:to-coral/70 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" 
                size="lg"
              >
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
                  'Saving vs Spending': {
                    bg: 'from-green-500/20 to-emerald-500/20',
                    border: 'border-green-500/30',
                    text: 'text-green-600',
                  },
                  'Opportunity Cost': {
                    bg: 'from-orange-400/20 to-amber-400/20',
                    border: 'border-orange-400/30',
                    text: 'text-orange-600',
                  },
                  'Goal Planning': {
                    bg: 'from-light-purple/20 to-deep-blue/20',
                    border: 'border-light-purple/30',
                    text: 'text-light-purple',
                  },
                  'Long-term vs Short-term': {
                    bg: 'from-pink-400/20 to-rose-400/20',
                    border: 'border-pink-400/30',
                    text: 'text-pink-600',
                  },
                  'Budget Balancing': {
                    bg: 'from-success/20 to-success/10',
                    border: 'border-success/30',
                    text: 'text-success',
                  },
                  'Unexpected Expenses': {
                    bg: 'from-red-400/20 to-red-500/20',
                    border: 'border-red-400/30',
                    text: 'text-red-600',
                  },
                  'Value Comparison': {
                    bg: 'from-blue-400/20 to-cyan-400/20',
                    border: 'border-blue-400/30',
                    text: 'text-blue-600',
                  },
                  'Budget Constraints': {
                    bg: 'from-purple-400/20 to-indigo-400/20',
                    border: 'border-purple-400/30',
                    text: 'text-purple-600',
                  },
                  'Life Simulation': {
                    bg: 'from-teal-400/20 to-emerald-400/20',
                    border: 'border-teal-400/30',
                    text: 'text-teal-600',
                  },
                };
                
                const colors = typeColors[quest.type] || typeColors['Needs vs Wants'];
                const typeEmojis: Record<string, string> = {
                  'Needs vs Wants': '🤔',
                  'Saving vs Spending': '🌱',
                  'Opportunity Cost': '⚖️',
                  'Goal Planning': '🎯',
                  'Long-term vs Short-term': '⏰',
                  'Budget Balancing': '💰',
                  'Unexpected Expenses': '😱',
                  'Value Comparison': '🔍',
                  'Budget Constraints': '📐',
                  'Life Simulation': '�',
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
                      <Button 
                        className="bg-gradient-to-r from-light-purple to-deep-blue text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        onClick={() => {
                          // Map quest IDs and types to their respective quest components
                          switch (quest.id) {
                            case 'quest-1':
                              setShowNeedsVsWantsQuest(true);
                              break;
                            case 'quest-2':
                              setShowGardenTimeQuest(true);
                              break;
                            case 'quest-3':
                              setShowSnackStandQuest(true);
                              break;
                            case 'quest-4':
                              setShowFirstGoalPosterQuest(true);
                              break;
                            case 'quest-5':
                              setShowBirthdayMoneyQuest(true);
                              break;
                            case 'quest-6':
                              setShowMiniWeekBudgetQuest(true);
                              break;
                            case 'quest-7':
                              setShowSurpriseExpenseQuest(true);
                              break;
                            case 'quest-8':
                              setShowSmartShopperQuest(true);
                              break;
                            case 'quest-9':
                              setShowDojoUpgradeQuest(true);
                              break;
                            case 'quest-10':
                              setShowMiniLifeWeekQuest(true);
                              break;
                            default:
                              // Fallback for type-based matching
                              switch (quest.type) {
                                case 'Needs vs Wants':
                                  setShowNeedsVsWantsQuest(true);
                                  break;
                                case 'Saving vs Spending':
                                  setShowGardenTimeQuest(true);
                                  break;
                                case 'Opportunity Cost':
                                  setShowSnackStandQuest(true);
                                  break;
                                case 'Goal Planning':
                                  setShowFirstGoalPosterQuest(true);
                                  break;
                                case 'Long-term vs Short-term':
                                  setShowBirthdayMoneyQuest(true);
                                  break;
                                case 'Budget Balancing':
                                  setShowMiniWeekBudgetQuest(true);
                                  break;
                                case 'Unexpected Expenses':
                                  setShowSurpriseExpenseQuest(true);
                                  break;
                                case 'Value Comparison':
                                  setShowSmartShopperQuest(true);
                                  break;
                                case 'Budget Constraints':
                                  setShowDojoUpgradeQuest(true);
                                  break;
                                case 'Life Simulation':
                                  setShowMiniLifeWeekQuest(true);
                                  break;
                                default:
                                  alert('This quest is coming soon!');
                              }
                          }
                        }}
                      >
                        {quest.type === 'Needs vs Wants' ? 'Play Game →' : 
                         quest.type === 'Life Simulation' ? 'Start Week →' : 
                         quest.type === 'Saving vs Spending' ? 'Make Choices →' :
                         quest.type === 'Opportunity Cost' ? 'Choose Snack →' :
                         quest.type === 'Goal Planning' ? 'Plan Goal →' :
                         quest.type === 'Long-term vs Short-term' ? 'Spend Money →' :
                         quest.type === 'Budget Balancing' ? 'Budget Week →' :
                         quest.type === 'Unexpected Expenses' ? 'Handle Crisis →' :
                         quest.type === 'Value Comparison' ? 'Go Shopping →' :
                         quest.type === 'Budget Constraints' ? 'Upgrade Dojo →' :
                         'Start Quest →'}
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

      {/* Quest Modal Overlays */}
      {showNeedsVsWantsQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <NeedsVsWantsQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-1')}
              onClose={() => setShowNeedsVsWantsQuest(false)}
            />
          </div>
        </div>
      )}

      {showGardenTimeQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <GardenTimeQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-2')}
              onClose={() => setShowGardenTimeQuest(false)}
            />
          </div>
        </div>
      )}

      {showSnackStandQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <SnackStandQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-3')}
              onClose={() => setShowSnackStandQuest(false)}
            />
          </div>
        </div>
      )}

      {showFirstGoalPosterQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <FirstGoalPosterQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-4')}
              onClose={() => setShowFirstGoalPosterQuest(false)}
            />
          </div>
        </div>
      )}

      {showBirthdayMoneyQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <BirthdayMoneyQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-5')}
              onClose={() => setShowBirthdayMoneyQuest(false)}
            />
          </div>
        </div>
      )}

      {showMiniWeekBudgetQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <MiniWeekBudgetQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-6')}
              onClose={() => setShowMiniWeekBudgetQuest(false)}
            />
          </div>
        </div>
      )}

      {showSurpriseExpenseQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <SurpriseExpenseQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-7')}
              onClose={() => setShowSurpriseExpenseQuest(false)}
            />
          </div>
        </div>
      )}

      {showSmartShopperQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <SmartShopperQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-8')}
              onClose={() => setShowSmartShopperQuest(false)}
            />
          </div>
        </div>
      )}

      {showDojoUpgradeQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <DojoUpgradeQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-9')}
              onClose={() => setShowDojoUpgradeQuest(false)}
            />
          </div>
        </div>
      )}

      {showMiniLifeWeekQuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-auto">
            <MiniLifeWeekQuest 
              onComplete={(reward) => handleQuestComplete(reward, 'quest-10')}
              onClose={() => setShowMiniLifeWeekQuest(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
