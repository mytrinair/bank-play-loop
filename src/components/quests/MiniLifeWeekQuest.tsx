import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Coins, Calendar, Heart, Star, Trophy, X, HelpCircle } from 'lucide-react';
import QuestHelper from '../QuestHelper';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface DayEvent {
  type: 'earn' | 'surprise';
  title: string;
  description: string;
  options: Array<{
    text: string;
    coins: number;
    badge?: string;
  }>;
}

interface DayPlan {
  lunch: number;
  fun: number;
  save: number;
}

interface GameState {
  currentDay: number;
  coins: number;
  totalEarned: number;
  totalSpentNeeds: number;
  totalSpentWants: number;
  totalSaved: number;
  selectedGoal: {
    name: string;
    cost: number;
    emoji: string;
  };
  avatar: string;
  dailyActions: number;
  reflections: string[];
  badges: string[];
}

const GOALS = [
  { name: 'Backpack', cost: 30, emoji: '🎒' },
  { name: 'Headphones', cost: 35, emoji: '🎧' },
  { name: 'Art Kit', cost: 40, emoji: '🎨' }
];

const AVATARS = ['👤', '👦', '👧', '🧑', '👨', '👩'];

const DAY_EVENTS: Record<number, DayEvent[]> = {
  1: [
    {
      type: 'earn',
      title: 'Art Room Helper',
      description: 'Your teacher asks for help cleaning the art room after class. Do you help?',
      options: [
        { text: 'Yes, I\'ll help!', coins: 3 },
        { text: 'No, I\'m too busy', coins: 0 }
      ]
    },
    {
      type: 'surprise',
      title: 'Lucky Find!',
      description: 'You found a coin on the playground!',
      options: [{ text: 'Pick it up', coins: 2 }]
    }
  ],
  2: [
    {
      type: 'earn',
      title: 'Homework Helper',
      description: 'You help a friend with homework. They offer to pay you.',
      options: [
        { text: 'Accept payment', coins: 2 },
        { text: 'Help for free', coins: 0, badge: 'Kind Helper' }
      ]
    },
    {
      type: 'surprise',
      title: 'Bake Sale!',
      description: 'There\'s a bake sale at lunch! Do you buy a treat?',
      options: [
        { text: 'Buy a cookie', coins: -3 },
        { text: 'Skip it today', coins: 0 }
      ]
    }
  ],
  3: [
    {
      type: 'earn',
      title: 'Recycling Project',
      description: 'Class recycling project pays for participation.',
      options: [
        { text: 'Participate actively', coins: 4 },
        { text: 'Just watch', coins: 0 }
      ]
    },
    {
      type: 'surprise',
      title: 'Forgotten Lunch',
      description: 'You forgot your lunchbox at home!',
      options: [
        { text: 'Buy emergency lunch', coins: -4 },
        { text: 'Ask friend to share', coins: -1 }
      ]
    }
  ],
  4: [
    {
      type: 'earn',
      title: 'Library Assistant',
      description: 'Help organize books in the library.',
      options: [
        { text: 'Help for an hour', coins: 3 },
        { text: 'Too busy today', coins: 0 }
      ]
    },
    {
      type: 'surprise',
      title: 'Friend\'s Birthday',
      description: 'It\'s your friend\'s birthday! Bring a small gift?',
      options: [
        { text: 'Buy a nice gift', coins: -3, badge: 'Thoughtful Friend' },
        { text: 'Make a card instead', coins: 0 }
      ]
    }
  ],
  5: [
    {
      type: 'earn',
      title: 'Final Day Bonus',
      description: 'Extra credit project opportunity!',
      options: [
        { text: 'Do the project', coins: 5 },
        { text: 'Skip it', coins: 0 }
      ]
    },
    {
      type: 'surprise',
      title: 'Bike Trouble',
      description: 'Your bike tire is flat! Repair costs money.',
      options: [
        { text: 'Pay for repair', coins: -3 },
        { text: 'Walk today', coins: 0 }
      ]
    }
  ]
};

const FUN_OPTIONS = [
  { name: 'Park (Free)', cost: 0 },
  { name: 'Candy Store', cost: 4 },
  { name: 'Movie Ticket', cost: 5 },
  { name: 'Game Arcade', cost: 6 },
  { name: 'School Trip', cost: 10, availableDay: 3 }
];

export default function MiniLifeWeekQuest({ onComplete, onClose }: QuestProps) {
  const [gamePhase, setGamePhase] = useState<'intro' | 'setup' | 'planning' | 'events' | 'reflection' | 'summary'>('intro');
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    coins: 25,
    totalEarned: 0,
    totalSpentNeeds: 0,
    totalSpentWants: 0,
    totalSaved: 0,
    selectedGoal: { name: '', cost: 0, emoji: '' },
    avatar: '👤',
    dailyActions: 0,
    reflections: [],
    badges: []
  });
  const [currentEvent, setCurrentEvent] = useState(0);
  const [dayPlan, setDayPlan] = useState<DayPlan>({ lunch: 6, fun: 0, save: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);

  const playSound = (type: 'success' | 'error' | 'coin') => {
    // Simple audio feedback
    const audio = new Audio();
    if (type === 'success') audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dz';
    else if (type === 'error') audio.src = 'data:audio/wav;base64,UklGRuoCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoCAABBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D';
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleAvatarSelect = (avatar: string) => {
    setGameState(prev => ({ ...prev, avatar }));
    playSound('success');
  };

  const handleGoalSelect = (goal: typeof GOALS[0]) => {
    setGameState(prev => ({ ...prev, selectedGoal: goal }));
    playSound('success');
  };

  const handlePlanChange = (type: keyof DayPlan, value: number) => {
    const newPlan = { ...dayPlan, [type]: value };
    const total = newPlan.lunch + newPlan.fun + newPlan.save;
    
    if (total <= gameState.coins) {
      setDayPlan(newPlan);
    }
  };

  const confirmDayPlan = () => {
    const total = dayPlan.lunch + dayPlan.fun + dayPlan.save;
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - total,
      totalSpentNeeds: prev.totalSpentNeeds + dayPlan.lunch,
      totalSpentWants: prev.totalSpentWants + dayPlan.fun,
      totalSaved: prev.totalSaved + dayPlan.save
    }));
    
    setGamePhase('events');
    setCurrentEvent(0);
    playSound('success');
  };

  const handleEventChoice = (choice: { text: string; coins: number; badge?: string }) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins + choice.coins,
        dailyActions: prev.dailyActions + 1
      };

      if (choice.coins > 0) {
        newState.totalEarned += choice.coins;
      } else if (choice.coins < 0) {
        newState.totalSpentNeeds += Math.abs(choice.coins);
      }

      if (choice.badge && !prev.badges.includes(choice.badge)) {
        newState.badges = [...prev.badges, choice.badge];
      }

      return newState;
    });

    playSound(choice.coins >= 0 ? 'coin' : 'error');
    
    const dayEvents = DAY_EVENTS[gameState.currentDay] || [];
    if (currentEvent < dayEvents.length - 1) {
      setCurrentEvent(prev => prev + 1);
    } else {
      setGamePhase('reflection');
    }
  };

  const handleReflection = (reflection: string) => {
    setGameState(prev => ({
      ...prev,
      reflections: [...prev.reflections, reflection]
    }));

    if (gameState.currentDay < 5) {
      setGameState(prev => ({ ...prev, currentDay: prev.currentDay + 1 }));
      setDayPlan({ lunch: 6, fun: 0, save: 0 });
      setGamePhase('planning');
    } else {
      setGamePhase('summary');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    playSound('success');
  };

  const completeQuest = () => {
    const goalReached = gameState.totalSaved >= gameState.selectedGoal.cost;
    const bonusCoins = goalReached ? 20 : 10;
    const badge = goalReached ? 'Goal Achiever' : 'Life Planner';
    
    playSound('success');
    onComplete({
      coins: bonusCoins,
      badge: badge
    });
    onClose(); // Close the quest after completion
  };

  const getDayName = (day: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[day - 1] || 'Day';
  };

  const goalProgress = gameState.selectedGoal.cost > 0 ? (gameState.totalSaved / gameState.selectedGoal.cost) * 100 : 0;
  const remainingCoins = gameState.coins - (dayPlan.lunch + dayPlan.fun + dayPlan.save);
  const canAffordPlan = remainingCoins >= 0;

  const renderQuestContent = () => {
    if (gamePhase === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-purple-800">The Mini-Life Week</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🏠</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">25 coins</span>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              Welcome to <strong>The Mini-Life Week!</strong> You've got 25 coins to make it through five days — 
              earn, spend, save, and see how your week turns out.
            </p>
            
            <Button 
              onClick={() => setGamePhase('setup')} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            >
              Begin Your Week
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (gamePhase === 'setup') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-800">Life Setup</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Avatar Selection */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map((avatar, index) => (
                  <Button
                    key={index}
                    variant={gameState.avatar === avatar ? "default" : "outline"}
                    className="h-16 text-2xl"
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    {avatar}
                  </Button>
                ))}
              </div>
            </div>

            {/* Goal Selection */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Pick Your Dream Goal</h3>
              <div className="space-y-3">
                {GOALS.map((goal, index) => (
                  <Button
                    key={index}
                    variant={gameState.selectedGoal.name === goal.name ? "default" : "outline"}
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleGoalSelect(goal)}
                  >
                    <span className="text-2xl mr-3">{goal.emoji}</span>
                    <div className="text-left">
                      <div className="font-semibold">{goal.name}</div>
                      <div className="text-sm text-gray-500">{goal.cost} coins</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have to reach your goal this week — but saving a little each day can bring you closer!
            </p>
            <Button 
              onClick={() => setGamePhase('planning')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Start Monday
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (gamePhase === 'planning') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-orange-800">
              {getDayName(gameState.currentDay)} Planning
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-lg">{gameState.coins} coins</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-600 mb-6">
              Every day, you'll make choices — how to spend your coins, and what to save. 
              Some things you need, others are just for fun. Ready?
            </p>

            <div className="space-y-6">
              {/* Lunch - Required */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    🍎 Lunch (Required)
                  </span>
                  <span className="font-bold">{dayPlan.lunch} coins</span>
                </div>
                <p className="text-sm text-gray-500">You need lunch every day!</p>
              </div>

              {/* Fun - Optional */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    🎉 Fun (Optional)
                  </span>
                  <span className="font-bold">{dayPlan.fun} coins</span>
                </div>
                <div className="space-y-2">
                  {FUN_OPTIONS
                    .filter(option => !option.availableDay || gameState.currentDay >= option.availableDay)
                    .map((option, index) => (
                    <Button
                      key={index}
                      variant={dayPlan.fun === option.cost ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlanChange('fun', option.cost)}
                      disabled={gameState.coins < (dayPlan.lunch + option.cost + dayPlan.save)}
                    >
                      {option.name} ({option.cost} coins)
                    </Button>
                  ))}
                </div>
              </div>

              {/* Save - Optional */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    🏦 Save
                  </span>
                  <span className="font-bold">{dayPlan.save} coins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, gameState.coins - dayPlan.lunch - dayPlan.fun)}
                  value={dayPlan.save}
                  onChange={(e) => handlePlanChange('save', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span>Goal: {gameState.selectedGoal.emoji} {gameState.selectedGoal.name}</span>
                  <span>{Math.max(0, gameState.coins - dayPlan.lunch - dayPlan.fun)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Remaining coins:</span>
                <span className={`font-bold ${canAffordPlan ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingCoins}
                </span>
              </div>
              {!canAffordPlan && (
                <p className="text-red-600 text-sm mt-2">
                  ⚠️ Careful — you'll need coins for the rest of the week!
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={confirmDayPlan}
                disabled={!canAffordPlan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Lock In Day Plan
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (gamePhase === 'events') {
    const dayEvents = DAY_EVENTS[gameState.currentDay] || [];
    const event = dayEvents[currentEvent];

    if (!event) {
      setGamePhase('reflection');
      return null;
    }

    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-800">
              {getDayName(gameState.currentDay)} - {event.type === 'earn' ? 'Opportunity' : 'Surprise!'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-lg">{gameState.coins} coins</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">
              {event.type === 'earn' ? '💼' : '🎲'}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-6">{event.description}</p>

            <div className="space-y-3">
              {event.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleEventChoice(option)}
                  className="w-full p-4 h-auto"
                  variant={option.coins >= 0 ? "default" : "destructive"}
                >
                  <div className="text-left w-full">
                    <div className="font-semibold">{option.text}</div>
                    <div className="text-sm">
                      {option.coins > 0 && `+${option.coins} coins`}
                      {option.coins < 0 && `${option.coins} coins`}
                      {option.coins === 0 && 'No change'}
                      {option.badge && ` • Earn "${option.badge}" badge`}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Progress 
              value={(gameState.dailyActions / 4) * 100} 
              className="w-64 mx-auto mb-2" 
            />
            <p className="text-sm text-gray-500">
              Daily Actions: {gameState.dailyActions} of 4 complete
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (gamePhase === 'reflection') {
    const reflectionOptions = [
      "I saved more than I expected.",
      "I spent too much on fun.",
      "I'm planning better for tomorrow.",
      "The surprises were challenging!",
      "I'm learning to budget better."
    ];

    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-purple-800">
              {getDayName(gameState.currentDay)} Evening Reflection
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🌅</div>
              <h3 className="text-xl font-semibold mb-4">Daily Summary</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-bold text-green-600">Earned</div>
                <div className="text-2xl">+{gameState.totalEarned}</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="font-bold text-red-600">Spent</div>
                <div className="text-2xl">-{gameState.totalSpentNeeds + gameState.totalSpentWants}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-600">Saved</div>
                <div className="text-2xl">+{gameState.totalSaved}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span>Goal Progress ({gameState.selectedGoal.emoji} {gameState.selectedGoal.name})</span>
                <span>{gameState.totalSaved} / {gameState.selectedGoal.cost}</span>
              </div>
              <Progress value={goalProgress} className="h-3" />
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">How did you do today?</h4>
              <div className="grid gap-2">
                {reflectionOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleReflection(option)}
                    className="text-left justify-start h-auto p-3"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (gamePhase === 'summary') {
    const goalReached = gameState.totalSaved >= gameState.selectedGoal.cost;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-yellow-50 to-green-50 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-bounce text-4xl absolute top-4 left-4">🎉</div>
            <div className="animate-bounce text-4xl absolute top-8 right-8" style={{ animationDelay: '0.5s' }}>🎊</div>
            <div className="animate-bounce text-4xl absolute bottom-8 left-8" style={{ animationDelay: '1s' }}>⭐</div>
            <div className="animate-bounce text-4xl absolute bottom-4 right-4" style={{ animationDelay: '1.5s' }}>🏆</div>
          </div>
        )}
        
        <div className="space-y-6 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Week Complete! 🎉</h2>
            <div className="text-6xl mb-4">{gameState.selectedGoal.emoji}</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">Final Summary</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Coins Earned:</span>
                  <span className="font-bold text-green-600">+{gameState.totalEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent on Needs:</span>
                  <span className="font-bold text-blue-600">-{gameState.totalSpentNeeds}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent on Wants:</span>
                  <span className="font-bold text-purple-600">-{gameState.totalSpentWants}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Saved:</span>
                  <span className="font-bold text-yellow-600">+{gameState.totalSaved}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Final Balance:</span>
                    <span className="font-bold text-lg">{gameState.coins} coins</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Goal Progress:</span>
                    <span>{goalReached ? '✅ Complete!' : `${Math.round(goalProgress)}%`}</span>
                  </div>
                  <Progress value={goalProgress} className="h-3" />
                </div>
                
                {gameState.badges.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Badges Earned:</p>
                    <div className="flex flex-wrap gap-2">
                      {gameState.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">
              {goalReached ? '🏆' : '🏅'}
            </div>
            <div className="text-2xl font-bold mb-2">
              {goalReached ? 'Goal Achiever!' : 'Life Planner!'}
            </div>
            <p className="text-gray-600 mb-4">
              {goalReached 
                ? 'Amazing! You reached your goal and learned valuable money management skills!'
                : 'Great job! You learned to plan, adapt, and save for what matters.'}
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="italic text-blue-800">
                "Every choice — big or small — shapes your week. Plan, adapt, and save for what truly matters."
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => {
                  setGamePhase('intro');
                  setGameState({
                    currentDay: 1,
                    coins: 25,
                    totalEarned: 0,
                    totalSpentNeeds: 0,
                    totalSpentWants: 0,
                    totalSaved: 0,
                    selectedGoal: GOALS[0],
                    avatar: AVATARS[0],
                    dailyActions: 0,
                    reflections: [],
                    badges: []
                  });
                }}
                variant="outline"
              >
                Play Again
              </Button>
              <Button onClick={completeQuest}>
                Close Quest
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
  };

  return (
    <>
      {renderQuestContent()}
      
      {/* Floating Help Button - appears in all phases */}
      <Button
        onClick={() => setIsHelperOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full p-3 shadow-lg"
        title="Get help with your quest!"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {/* Quest Helper */}
      <QuestHelper
        currentPhase={gamePhase}
        currentDay={gameState.currentDay}
        questContext={{
          coins: gameState.coins,
          dayPlan: dayPlan,
          currentEvent: DAY_EVENTS[gameState.currentDay]?.[currentEvent],
          savingsGoal: gameState.selectedGoal,
          totalSaved: gameState.totalSaved,
          totalEarned: gameState.totalEarned,
          totalSpentNeeds: gameState.totalSpentNeeds,
          totalSpentWants: gameState.totalSpentWants,
          earnedBadges: gameState.earnedBadges,
          dailyPlans: gameState.dailyPlans
        }}
        isOpen={isHelperOpen}
        onClose={() => setIsHelperOpen(false)}
      />
    </>
  );
}