import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Coins, Target, Star, Calendar, X, CheckCircle, Sparkles } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Goal {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SavingsPlan {
  goal: Goal;
  weeklyAmount: number;
  weeksNeeded: number;
  totalWeeks: number;
}

const FirstGoalPosterQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'goals' | 'planning' | 'poster' | 'result'>('intro');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [weeklyAmount, setWeeklyAmount] = useState(5);
  const [savingsPlan, setSavingsPlan] = useState<SavingsPlan | null>(null);
  const [currentCoins] = useState(25); // Student's current coins

  const goals: Goal[] = [
    {
      id: 'toy-car',
      name: 'Remote Control Car',
      emoji: '🚗',
      cost: 35,
      description: 'A cool car that you can drive around the house and yard',
      timeframe: 'Perfect for playing inside and outside',
      difficulty: 'medium'
    },
    {
      id: 'art-set',
      name: 'Deluxe Art Set',
      emoji: '🎨',
      cost: 25,
      description: 'Markers, colored pencils, and drawing paper',
      timeframe: 'Great for creative projects',
      difficulty: 'easy'
    },
    {
      id: 'board-game',
      name: 'Fun Board Game',
      emoji: '🎲',
      cost: 30,
      description: 'A strategy game to play with friends and family',
      timeframe: 'Perfect for game nights',
      difficulty: 'medium'
    },
    {
      id: 'book-series',
      name: 'Adventure Book Series',
      emoji: '📚',
      cost: 20,
      description: 'Set of 5 exciting adventure books',
      timeframe: 'Hours of reading fun',
      difficulty: 'easy'
    },
    {
      id: 'sports-gear',
      name: 'Soccer Ball & Goals',
      emoji: '⚽',
      cost: 45,
      description: 'Professional soccer ball with mini goals',
      timeframe: 'Great for outdoor practice',
      difficulty: 'hard'
    },
    {
      id: 'science-kit',
      name: 'Chemistry Lab Kit',
      emoji: '🧪',
      cost: 40,
      description: 'Safe experiments you can do at home',
      timeframe: 'Learn while having fun',
      difficulty: 'hard'
    }
  ];

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentStep('planning');
  };

  const calculatePlan = () => {
    if (!selectedGoal) return;
    
    const remainingCost = Math.max(0, selectedGoal.cost - currentCoins);
    const weeksNeeded = Math.ceil(remainingCost / weeklyAmount);
    const totalWeeks = Math.ceil(selectedGoal.cost / weeklyAmount);
    
    const plan: SavingsPlan = {
      goal: selectedGoal,
      weeklyAmount,
      weeksNeeded,
      totalWeeks
    };
    
    setSavingsPlan(plan);
    setCurrentStep('poster');
  };

  const completeQuest = () => {
    if (!savingsPlan) return;
    
    let points = 20; // Base points
    let badge = 'Goal Setter';
    
    // Award extra points based on planning
    if (savingsPlan.weeklyAmount >= 8) points += 5; // Good weekly saving amount
    if (savingsPlan.weeksNeeded <= 6) points += 5; // Achievable timeframe
    if (savingsPlan.goal.difficulty === 'hard') points += 8; // Ambitious goal
    else if (savingsPlan.goal.difficulty === 'medium') points += 5;
    
    if (points >= 30) {
      badge = 'Master Planner';
    } else if (points >= 25) {
      badge = 'Smart Saver';
    }
    
    onComplete({ coins: points, badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🎯 My First Goal Poster</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-700">Let's Make a Savings Plan!</h3>
              <p className="text-lg text-gray-600">
                Having a goal makes saving money so much more fun! When you know what you're saving for, 
                every coin you put away gets you closer to something awesome.
              </p>
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-purple-700">You currently have {currentCoins} coins</span>
                </div>
                <p className="text-purple-600">Let's see what amazing goal you can work toward!</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('goals')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3"
          >
            Choose my goal! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'goals') {
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🎯 Choose Your Goal</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-center text-gray-600 text-lg">
              Pick something you really want! The more excited you are about your goal, 
              the more motivated you'll be to save for it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const difficultyColor = goal.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-green-200' :
                                    goal.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-red-100 text-red-700 border-red-200';
              
              const canAffordNow = goal.cost <= currentCoins;
              
              return (
                <Card 
                  key={goal.id}
                  className="p-6 cursor-pointer hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-white to-purple-50 hover:scale-105"
                  onClick={() => handleGoalSelect(goal)}
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl">{goal.emoji}</div>
                    <h3 className="font-bold text-xl text-purple-800">{goal.name}</h3>
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                    <p className="text-purple-600 text-sm italic">{goal.timeframe}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold text-lg">{goal.cost} coins</span>
                    </div>
                    
                    <Badge className={`${difficultyColor} border`}>
                      {goal.difficulty === 'easy' ? '⭐ Easy Goal' :
                       goal.difficulty === 'medium' ? '⭐⭐ Medium Goal' :
                       '⭐⭐⭐ Big Challenge'}
                    </Badge>
                    
                    {canAffordNow && (
                      <Badge variant="default" className="bg-green-500">
                        🎉 You can afford this now!
                      </Badge>
                    )}
                    
                    {!canAffordNow && (
                      <div className="text-sm text-gray-500">
                        Need {goal.cost - currentCoins} more coins
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center">
              💡 <strong>Tip:</strong> Choose something that makes you excited! 
              The best goals are ones that make you happy to save for them.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'planning' && selectedGoal) {
    const remainingCost = Math.max(0, selectedGoal.cost - currentCoins);
    const weeksNeeded = Math.ceil(remainingCost / weeklyAmount);
    const totalWeeks = Math.ceil(selectedGoal.cost / weeklyAmount);
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">📊 Make Your Savings Plan</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Selected Goal Display */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{selectedGoal.emoji}</div>
              <h3 className="text-2xl font-bold text-blue-700">Goal: {selectedGoal.name}</h3>
              <p className="text-gray-600">{selectedGoal.description}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">Total cost: {selectedGoal.cost} coins</span>
              </div>
            </div>
          </div>
          
          {/* Current Situation */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-green-800 mb-2">💰 What you have now:</h4>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="text-xl font-bold">{currentCoins} coins</span>
              </div>
            </div>
            
            <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-orange-800 mb-2">🎯 Still need to save:</h4>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                <span className="text-xl font-bold">{remainingCost} coins</span>
              </div>
            </div>
          </div>
          
          {/* Weekly Planning */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
            <h4 className="font-bold text-blue-800 mb-4 text-center">📅 How much will you save each week?</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => setWeeklyAmount(Math.max(1, weeklyAmount - 1))}
                  variant="outline"
                  size="sm"
                >
                  −
                </Button>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">{weeklyAmount} coins</div>
                  <div className="text-sm text-gray-600">per week</div>
                </div>
                <Button 
                  onClick={() => setWeeklyAmount(weeklyAmount + 1)}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="font-bold">
                    {remainingCost === 0 ? 
                      "You can buy it right now! 🎉" : 
                      `You'll reach your goal in ${weeksNeeded} week${weeksNeeded !== 1 ? 's' : ''}!`
                    }
                  </span>
                </div>
                
                {weeksNeeded > 0 && (
                  <div className="text-sm text-gray-600">
                    Save {weeklyAmount} coins × {weeksNeeded} weeks = {weeklyAmount * weeksNeeded} coins needed
                  </div>
                )}
              </div>
              
              {/* Progress Preview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to goal</span>
                  <span>{Math.round((currentCoins / selectedGoal.cost) * 100)}%</span>
                </div>
                <Progress value={(currentCoins / selectedGoal.cost) * 100} className="h-3" />
              </div>
            </div>
          </div>
          
          {/* Helpful Tips */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <h5 className="font-bold text-green-800 mb-2">💡 Quick Tips:</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Save a little each week</li>
                <li>• Ask family for extra chores</li>
                <li>• Skip small purchases you don't need</li>
              </ul>
            </div>
            
            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
              <h5 className="font-bold text-purple-800 mb-2">⭐ Stay Motivated:</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Picture how happy you'll be</li>
                <li>• Track your progress weekly</li>
                <li>• Celebrate small wins</li>
              </ul>
            </div>
          </div>
          
          <Button 
            onClick={calculatePlan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Create My Goal Poster! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'poster' && savingsPlan) {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">📋 Your Goal Poster!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* The Goal Poster */}
          <div className="bg-white p-8 rounded-lg shadow-xl border-4 border-purple-300" style={{ background: 'linear-gradient(135deg, #fff 0%, #f3e8ff 100%)' }}>
            <div className="text-center space-y-6">
              <div className="border-4 border-purple-400 rounded-lg p-4 bg-purple-100">
                <h3 className="text-3xl font-bold text-purple-800 mb-2">MY GOAL POSTER</h3>
                <div className="flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                  <span className="text-purple-700 font-medium">Save • Plan • Achieve</span>
                  <Sparkles className="h-6 w-6 text-purple-500 ml-2" />
                </div>
              </div>
              
              <div className="text-8xl">{savingsPlan.goal.emoji}</div>
              
              <div>
                <h4 className="text-2xl font-bold text-purple-800 mb-1">I'M SAVING FOR:</h4>
                <h5 className="text-3xl font-bold text-pink-600">{savingsPlan.goal.name}</h5>
                <p className="text-gray-600 italic mt-2">{savingsPlan.goal.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 py-4">
                <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
                  <div className="text-2xl font-bold text-yellow-700">{savingsPlan.goal.cost}</div>
                  <div className="text-sm text-yellow-600">TOTAL COINS</div>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
                  <div className="text-2xl font-bold text-blue-700">{savingsPlan.weeklyAmount}</div>
                  <div className="text-sm text-blue-600">COINS PER WEEK</div>
                </div>
                
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                  <div className="text-2xl font-bold text-green-700">
                    {savingsPlan.weeksNeeded === 0 ? '0' : savingsPlan.weeksNeeded}
                  </div>
                  <div className="text-sm text-green-600">
                    {savingsPlan.weeksNeeded === 0 ? 'READY NOW!' : 'WEEKS TO GO'}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-4 rounded-lg border-2 border-purple-300">
                <h6 className="font-bold text-purple-800 mb-2">MY PROGRESS TRACKER</h6>
                <Progress value={(currentCoins / savingsPlan.goal.cost) * 100} className="h-4 mb-2" />
                <div className="text-sm text-purple-700">
                  {currentCoins} of {savingsPlan.goal.cost} coins saved ({Math.round((currentCoins / savingsPlan.goal.cost) * 100)}%)
                </div>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
                <h6 className="font-bold text-red-800 mb-2">💪 I WILL STAY MOTIVATED BY:</h6>
                <div className="text-sm text-red-700 space-y-1">
                  <div>✓ Looking at this poster every day</div>
                  <div>✓ Imagining how happy I'll be when I get my {savingsPlan.goal.name}</div>
                  <div>✓ Celebrating each week I save {savingsPlan.weeklyAmount} coins</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center font-medium">
              🌟 <strong>Amazing work!</strong> You now have a clear plan to reach your goal. 
              Keep this poster somewhere you can see it every day!
            </p>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            I'm ready to start saving! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🎉 Goal Planning Complete!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">You're Now a Goal-Setting Pro!</h3>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Your Goal Plan:</h4>
              <div className="text-blue-700">
                <div>Goal: {savingsPlan?.goal.name} {savingsPlan?.goal.emoji}</div>
                <div>Weekly Savings: {savingsPlan?.weeklyAmount} coins</div>
                <div>Time to Goal: {savingsPlan?.weeksNeeded === 0 ? 'Ready now!' : `${savingsPlan?.weeksNeeded} weeks`}</div>
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <p className="text-yellow-800">
                <strong>💡 What you learned:</strong> Setting clear goals and making a plan makes saving money so much easier! 
                When you know exactly what you're working toward and how to get there, every coin you save feels like progress.
              </p>
            </div>
            
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <p className="text-green-800">
                <strong>🌟 Next steps:</strong> Keep your goal poster where you can see it every day. 
                Track your progress weekly, and don't forget to celebrate when you reach milestones!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🎯
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default FirstGoalPosterQuest;