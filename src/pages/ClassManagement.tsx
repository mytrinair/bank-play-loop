import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Coins, Trophy, Home, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface StudentData {
  id: string;
  name: string;
  coins: number;
  furniture: string[];
  badges: string[];
  questsCompleted: number;
  lastActive: string;
  questProgress: {
    [questId: string]: {
      completed: boolean;
      completedAt?: string;
      coinsEarned: number;
      badgeEarned?: string;
    };
  };
}

const ClassManagement = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { userInfo } = useAuth();
  const [students, setStudents] = useState<StudentData[]>([]);

  useEffect(() => {
    // Scan localStorage for student data
    const foundStudents: StudentData[] = [];
    
    // Look for student data in localStorage by scanning all keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('-coins')) {
        // Extract student ID from the key pattern: "student-{id}-coins"
        const match = key.match(/^student-(.+)-coins$/);
        if (match) {
          const studentId = match[1];
          
          // Get all student data
          const savedCoins = localStorage.getItem(`student-${studentId}-coins`);
          const savedFurniture = localStorage.getItem(`student-${studentId}-furniture`);
          const savedBadges = localStorage.getItem(`student-${studentId}-badges`);
          
          // Scan for quest completion data
          const questProgress: { [questId: string]: any } = {};
          const questIds = ['quest-1', 'quest-2', 'quest-3', 'quest-4', 'quest-5', 'quest-6', 'quest-7', 'quest-8', 'quest-9', 'quest-10'];
          
          questIds.forEach(questId => {
            const questData = localStorage.getItem(`student-${studentId}-${questId}-completed`);
            if (questData) {
              try {
                const parsedData = JSON.parse(questData);
                questProgress[questId] = {
                  completed: true,
                  completedAt: parsedData.completedAt || new Date().toISOString(),
                  coinsEarned: parsedData.coinsEarned || 0,
                  badgeEarned: parsedData.badgeEarned || null
                };
              } catch (e) {
                questProgress[questId] = {
                  completed: true,
                  completedAt: new Date().toISOString(),
                  coinsEarned: 0,
                  badgeEarned: null
                };
              }
            } else {
              questProgress[questId] = {
                completed: false,
                coinsEarned: 0
              };
            }
          });
          
          // Create student object with real data
          const student: StudentData = {
            id: studentId,
            name: `Student ${studentId.slice(-6)}`, // Use part of ID as name
            coins: savedCoins ? parseInt(savedCoins) : 0,
            furniture: savedFurniture ? JSON.parse(savedFurniture) : [],
            badges: savedBadges ? JSON.parse(savedBadges) : [],
            questsCompleted: 0,
            lastActive: new Date().toISOString(),
            questProgress
          };
          
          // Calculate quests completed based on quest progress data
          student.questsCompleted = Object.values(questProgress).filter(q => q.completed).length;
          
          foundStudents.push(student);
        }
      }
    }
    
    // If no students found in localStorage, show a placeholder
    if (foundStudents.length === 0) {
      foundStudents.push({
        id: 'no-students',
        name: 'No students found',
        coins: 0,
        furniture: [],
        badges: [],
        questsCompleted: 0,
        lastActive: new Date().toISOString()
      });
    }
    
    setStudents(foundStudents);
  }, []);

  const getFurnitureValue = (furniture: string[]) => {
    const prices = {
      sofa: 20,
      bed: 30,
      table: 10,
      rug: 15,
      lamp: 12,
      painting: 18,
      plant: 8
    };
    
    return furniture.reduce((total, item) => {
      return total + (prices[item as keyof typeof prices] || 0);
    }, 0);
  };

  const getActivityLevel = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInHours = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) return { label: 'Active Today', color: 'bg-green-100 text-green-800' };
    if (diffInHours < 168) return { label: 'This Week', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Inactive', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-800">Class Management</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Morning Math Class</span>
          </div>
        </div>
      </div>

      {/* Class Stats */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {students.reduce((sum, s) => sum + s.coins, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Coins</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {students.reduce((sum, s) => sum + s.badges.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Badges</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {students.reduce((sum, s) => sum + s.questsCompleted, 0)}
                </p>
                <p className="text-sm text-gray-600">Quests Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quest Completion Overview */}
        <Card className="mb-8 overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-800">Quest Completion Overview</h2>
            <p className="text-sm text-gray-600">See which quests your students have completed</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['quest-1', 'quest-2', 'quest-3', 'quest-4', 'quest-5', 'quest-6', 'quest-7', 'quest-8', 'quest-9', 'quest-10'].map((questId) => {
                const questNames = {
                  'quest-1': 'Needs vs Wants',
                  'quest-2': 'Garden Time',
                  'quest-3': 'Snack Stand',
                  'quest-4': 'Goal Poster',
                  'quest-5': 'Birthday Money',
                  'quest-6': 'Weekly Budget',
                  'quest-7': 'Surprise Expense',
                  'quest-8': 'Smart Shopper',
                  'quest-9': 'Dojo Upgrade',
                  'quest-10': 'Mini-Life Week'
                };
                
                const completionCount = students.filter(s => s.questProgress?.[questId]?.completed).length;
                const completionRate = students.length > 0 ? Math.round((completionCount / students.length) * 100) : 0;
                
                return (
                  <Card key={questId} className="p-4 text-center">
                    <h3 className="font-semibold text-sm text-gray-800 mb-2">
                      {questNames[questId as keyof typeof questNames]}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {completionCount}/{students.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {completionRate}% complete
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Students List */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Individual Student Progress</h2>
            <p className="text-sm text-gray-600">Monitor your students' financial literacy journey</p>
          </div>
          
          <div className="divide-y">
            {students.map((student) => {
              const activity = getActivityLevel(student.lastActive);
              const furnitureValue = getFurnitureValue(student.furniture);
              
              return (
                <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Student Info */}
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={activity.color}>
                            {activity.label}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Student ID: {student.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="flex items-center gap-8">
                      {/* Coins */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Coins className="h-5 w-5 text-yellow-600" />
                          <span className="text-xl font-bold text-yellow-700">{student.coins}</span>
                        </div>
                        <p className="text-xs text-gray-500">Coins</p>
                      </div>

                      {/* Quests */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-xl font-bold text-green-700">{student.questsCompleted}</span>
                        </div>
                        <p className="text-xs text-gray-500">Quests</p>
                      </div>

                      {/* Badges */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Trophy className="h-5 w-5 text-purple-600" />
                          <span className="text-xl font-bold text-purple-700">{student.badges.length}</span>
                        </div>
                        <p className="text-xs text-gray-500">Badges</p>
                      </div>

                      {/* Room Value */}
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Home className="h-5 w-5 text-blue-600" />
                          <span className="text-xl font-bold text-blue-700">{furnitureValue}</span>
                        </div>
                        <p className="text-xs text-gray-500">Room Value</p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Progress */}
                  <div className="mt-4 space-y-4">
                    {/* Quest Progress Overview */}
                    <Card className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                      <h4 className="font-semibold text-indigo-800 mb-3 text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Quest Progress Overview
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(student.questProgress).map(([questId, progress]) => {
                          const questNames = {
                            'quest-1': 'Needs vs Wants',
                            'quest-2': 'Garden Time',
                            'quest-3': 'Snack Stand',
                            'quest-4': 'Goal Poster',
                            'quest-5': 'Birthday Money',
                            'quest-6': 'Weekly Budget',
                            'quest-7': 'Surprise Expense',
                            'quest-8': 'Smart Shopper',
                            'quest-9': 'Dojo Upgrade',
                            'quest-10': 'Mini-Life Week'
                          };
                          
                          return (
                            <div 
                              key={questId} 
                              className={`p-2 rounded-lg text-center ${
                                progress.completed 
                                  ? 'bg-green-100 border-2 border-green-300' 
                                  : 'bg-gray-100 border-2 border-gray-200'
                              }`}
                              title={`${questNames[questId as keyof typeof questNames]} - ${progress.completed ? 'Completed' : 'Not started'}`}
                            >
                              <div className={`text-xs font-medium ${
                                progress.completed ? 'text-green-800' : 'text-gray-600'
                              }`}>
                                Q{questId.split('-')[1]}
                              </div>
                              <div className="text-lg">
                                {progress.completed ? '✅' : '⭕'}
                              </div>
                              {progress.completed && progress.coinsEarned > 0 && (
                                <div className="text-xs text-green-700 font-bold">
                                  +{progress.coinsEarned}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Badges Earned */}
                      <Card className="p-4 bg-purple-50">
                        <h4 className="font-semibold text-purple-800 mb-2 text-sm">Badges Earned</h4>
                        {student.badges.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {student.badges.map((badge, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                🏅 {badge}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No badges earned yet</p>
                        )}
                      </Card>

                      {/* Room Progress */}
                      <Card className="p-4 bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-2 text-sm">Room Furniture</h4>
                        {student.furniture.length > 0 ? (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>{student.furniture.length}/7</strong> items owned
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {student.furniture.map((item, index) => (
                                <span key={index} className="text-xs bg-blue-100 px-2 py-1 rounded">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Empty room</p>
                        )}
                      </Card>

                      {/* Financial Summary */}
                      <Card className="p-4 bg-green-50">
                        <h4 className="font-semibold text-green-800 mb-2 text-sm">Financial Activity</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Current Coins:</strong> {student.coins}</p>
                          <p><strong>Spent on Room:</strong> {furnitureValue} coins</p>
                          <p><strong>Total Earned:</strong> {student.coins + furnitureValue} coins</p>
                          <p><strong>Quests Completed:</strong> {student.questsCompleted}/10</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Empty State */}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Students Yet</h3>
            <p className="text-gray-500">Students will appear here when they join your class</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;