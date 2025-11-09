import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Coins, Heart, Home, Gamepad2, Car, X, CheckCircle, AlertTriangle, Smile, Meh, Frown } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface BudgetItem {
  id: string;
  name: string;
  category: 'needs' | 'wants';
  cost: number;
  emoji: string;
  description: string;
  happiness: 'low' | 'medium' | 'high';
  required?: boolean;
}

interface DayExpense {
  day: number;
  items: BudgetItem[];
  totalSpent: number;
}

const MiniWeekBudgetQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'planning' | 'day' | 'review' | 'result'>('intro');
  const [currentDay, setCurrentDay] = useState(1);
  const [weeklyBudget] = useState(50);
  const [dailyBudget] = useState(10); // 50 / 5 days
  const [weekExpenses, setWeekExpenses] = useState<DayExpense[]>([]);
  const [currentDayItems, setCurrentDayItems] = useState<BudgetItem[]>([]);

  const availableItems: BudgetItem[] = [
    // NEEDS (usually required)
    {
      id: 'lunch',
      name: 'School Lunch',
      category: 'needs',
      cost: 4,
      emoji: '🍎',
      description: 'Healthy meal at school',
      happiness: 'medium',
      required: true
    },
    {
      id: 'bus',
      name: 'Bus Fare',
      category: 'needs',
      cost: 2,
      emoji: '🚌',
      description: 'Getting to and from school',
      happiness: 'low'
    },
    {
      id: 'supplies',
      name: 'School Supplies',
      category: 'needs',
      cost: 3,
      emoji: '✏️',
      description: 'Pencils, paper, etc.',
      happiness: 'low'
    },
    
    // WANTS
    {
      id: 'snack',
      name: 'After-School Snack',
      category: 'wants',
      cost: 2,
      emoji: '🍪',
      description: 'Cookies or chips',
      happiness: 'medium'
    },
    {
      id: 'drink',
      name: 'Special Drink',
      category: 'wants',
      cost: 3,
      emoji: '🥤',
      description: 'Smoothie or fancy juice',
      happiness: 'medium'
    },
    {
      id: 'arcade',
      name: 'Arcade Game',
      category: 'wants',
      cost: 5,
      emoji: '🕹️',
      description: 'Play your favorite game',
      happiness: 'high'
    },
    {
      id: 'candy',
      name: 'Candy Bar',
      category: 'wants',
      cost: 1,
      emoji: '🍫',
      description: 'Sweet chocolate treat',
      happiness: 'medium'
    },
    {
      id: 'comic',
      name: 'Comic Book',
      category: 'wants',
      cost: 4,
      emoji: '📚',
      description: 'New superhero comic',
      happiness: 'high'
    },
    {
      id: 'stickers',
      name: 'Cool Stickers',
      category: 'wants',
      cost: 2,
      emoji: '✨',
      description: 'Shiny holographic stickers',
      happiness: 'medium'
    },
    {
      id: 'toy',
      name: 'Small Toy',
      category: 'wants',
      cost: 6,
      emoji: '🎲',
      description: 'Mini action figure',
      happiness: 'high'
    },
    {
      id: 'friend-treat',
      name: 'Treat for Friend',
      category: 'wants',
      cost: 3,
      emoji: '🎁',
      description: 'Share something nice',
      happiness: 'high'
    }
  ];

  const getDayOptions = (day: number): BudgetItem[] => {
    // Mix required and optional items
    const required = availableItems.filter(item => item.required);
    const optional = availableItems.filter(item => !item.required);
    
    // Shuffle and pick 6-8 items for variety each day
    const shuffled = [...optional].sort(() => Math.random() - 0.5);
    const dayItems = [...required, ...shuffled.slice(0, 6)];
    
    return dayItems;
  };

  const totalWeekSpent = weekExpenses.reduce((sum, day) => sum + day.totalSpent, 0);
  const remainingBudget = weeklyBudget - totalWeekSpent;
  const currentDaySpent = currentDayItems.reduce((sum, item) => sum + item.cost, 0);

  const handleItemToggle = (item: BudgetItem) => {
    const isSelected = currentDayItems.some(i => i.id === item.id);
    if (isSelected) {
      setCurrentDayItems(currentDayItems.filter(i => i.id !== item.id));
    } else {
      const newTotal = currentDaySpent + item.cost;
      if (newTotal <= dailyBudget) {
        setCurrentDayItems([...currentDayItems, item]);
      }
    }
  };

  const finishDay = () => {
    const dayExpense: DayExpense = {
      day: currentDay,
      items: currentDayItems,
      totalSpent: currentDaySpent
    };
    
    setWeekExpenses([...weekExpenses, dayExpense]);
    setCurrentDayItems([]);
    
    if (currentDay < 5) {
      setCurrentDay(currentDay + 1);
    } else {
      setCurrentStep('review');
    }
  };

  const completeQuest = () => {
    let points = 25; // Base points
    let badge = 'Budget Beginner';
    
    // Analyze spending patterns
    const totalSpent = weekExpenses.reduce((sum, day) => sum + day.totalSpent, 0);
    const staysInBudget = weekExpenses.every(day => day.totalSpent <= dailyBudget);
    const balancedSpending = weekExpenses.some(day => 
      day.items.some(item => item.category === 'needs') && 
      day.items.some(item => item.category === 'wants')
    );
    const savedMoney = totalSpent < weeklyBudget;
    const helpedFriend = weekExpenses.some(day => 
      day.items.some(item => item.id === 'friend-treat')
    );
    
    if (staysInBudget) points += 10; // Great discipline
    if (balancedSpending) points += 8; // Good balance
    if (savedMoney) points += 5; // Saving skills
    if (helpedFriend) points += 5; // Kindness bonus
    if (totalSpent <= weeklyBudget * 0.8) points += 7; // Excellent saving
    
    if (points >= 40) {
      badge = 'Budget Master';
    } else if (points >= 35) {
      badge = 'Smart Spender';
    } else if (points >= 30) {
      badge = 'Budget Learner';
    }
    
    onComplete({ coins: Math.min(35, points), badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">📅 Mini-Week Budget Challenge!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">💰</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-700">Your 5-Day Money Challenge</h3>
              <p className="text-lg text-gray-600">
                You have 50 coins for a whole school week (Monday to Friday). 
                Your job is to make it through all 5 days while staying within your budget!
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-5 w-5 text-green-500" />
                    <span className="font-bold text-green-800">Total Budget</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">50 coins</div>
                  <div className="text-sm text-green-600">For 5 school days</div>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-bold text-blue-800">Daily Budget</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">10 coins</div>
                  <div className="text-sm text-blue-600">Per day (roughly)</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
          >
            Let's learn about budgeting! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'learning') {
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🎯 Budget Basics</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🧮</div>
              <h3 className="text-2xl font-bold text-green-700">What is Budgeting?</h3>
              <p className="text-gray-600 mt-2">
                Budgeting means planning how to spend your money wisely so it lasts as long as you need it to!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
                <div className="text-center">
                  <Home className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-bold text-red-800">NEEDS 🚨</h4>
                  <p className="text-red-700 text-sm mt-2">
                    Things you MUST have to live, learn, and stay healthy. 
                    These should come first in your budget.
                  </p>
                  <div className="mt-2 text-xs text-red-600">
                    🍎 Food, 🚌 Transportation, ✏️ School supplies
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-bold text-yellow-800">WANTS 🎉</h4>
                  <p className="text-yellow-700 text-sm mt-2">
                    Things that make you happy but aren't absolutely necessary. 
                    These come after you've covered your needs.
                  </p>
                  <div className="mt-2 text-xs text-yellow-600">
                    🍪 Snacks, 🕹️ Games, 📚 Comics, ✨ Fun stuff
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">🎯 Smart Budget Rules</h4>
              <div className="text-purple-700 text-sm space-y-1">
                <div>• ✅ Cover your NEEDS first (food, school stuff)</div>
                <div>• 💝 Save some coins for WANTS that make you happy</div>
                <div>• 🏦 Try to save a little for emergencies or future goals</div>
                <div>• ⚖️ Balance is key - don't spend everything on day 1!</div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📊 Your Challenge</h4>
              <p className="text-blue-700 text-sm">
                Each day you'll see different items to buy. Some are needs, some are wants. 
                Make smart choices so your money lasts all week AND you still have some fun!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('day')}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
          >
            Start Week 1 - Monday! 📅
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'day') {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayOptions = getDayOptions(currentDay);
    const dailyRemaining = dailyBudget - currentDaySpent;
    
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-800">
              📅 {dayNames[currentDay - 1]} - Day {currentDay}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Week Progress */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Week Progress</span>
              <span className="text-sm text-gray-600">Day {currentDay} of 5</span>
            </div>
            <Progress value={(currentDay - 1) * 20} className="mb-2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-green-500" />
                  <span className="font-bold">{weeklyBudget}</span>
                </div>
                <p className="text-xs text-gray-600">Week Budget</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-red-500" />
                  <span className="font-bold">{totalWeekSpent}</span>
                </div>
                <p className="text-xs text-gray-600">Spent So Far</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span className="font-bold">{remainingBudget}</span>
                </div>
                <p className="text-xs text-gray-600">Week Remaining</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-orange-500" />
                  <span className="font-bold">{dailyRemaining}</span>
                </div>
                <p className="text-xs text-gray-600">Today Left</p>
              </div>
            </div>
          </div>
          
          {/* Daily Shopping */}
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-orange-200">
            <h3 className="font-bold text-orange-800 mb-4">🛍️ Today's Shopping Options</h3>
            
            {/* Current selections */}
            {currentDayItems.length > 0 && (
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-200 mb-4">
                <h4 className="font-bold text-blue-800 text-sm mb-2">🛒 Your Today's Cart:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentDayItems.map((item) => (
                    <Badge 
                      key={item.id}
                      variant="secondary" 
                      className="text-xs p-1 cursor-pointer hover:bg-red-200"
                      onClick={() => handleItemToggle(item)}
                    >
                      {item.emoji} {item.name} ({item.cost} coins) ❌
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-bold">Today's Total: {currentDaySpent} coins</span>
                  <span className="ml-4 text-gray-600">Remaining: {dailyRemaining} coins</span>
                </div>
              </div>
            )}
            
            {/* Item Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {dayOptions.map((item) => {
                const canAfford = item.cost <= dailyRemaining;
                const isSelected = currentDayItems.some(i => i.id === item.id);
                const isRequired = item.required;
                
                const categoryColor = item.category === 'needs' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-yellow-300 bg-yellow-50';
                
                const happinessIcon = item.happiness === 'high' ? '😄' :
                                    item.happiness === 'medium' ? '😊' : '😐';
                
                return (
                  <Card 
                    key={item.id}
                    className={`p-3 cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'ring-2 ring-blue-400 bg-blue-100 border-blue-400' 
                        : canAfford 
                          ? `hover:shadow-md hover:scale-105 ${categoryColor}` 
                          : 'bg-gray-100 border-gray-300 opacity-60'
                    }`}
                    onClick={() => canAfford && handleItemToggle(item)}
                  >
                    <div className="text-center space-y-1">
                      <div className="text-2xl">{item.emoji}</div>
                      <h4 className="font-bold text-xs">{item.name}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                      
                      <div className="flex items-center justify-center gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${item.category === 'needs' ? 'border-red-400 text-red-700' : 'border-yellow-400 text-yellow-700'}`}
                        >
                          {item.category === 'needs' ? 'NEED' : 'WANT'}
                        </Badge>
                      </div>
                      
                      {isRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Required!
                        </Badge>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-bold">{item.cost} coins</span>
                        </div>
                        <div className="text-xs">{happinessIcon} happiness</div>
                      </div>
                      
                      {!canAfford && !isSelected && (
                        <Badge variant="destructive" className="text-xs">
                          Can't afford today
                        </Badge>
                      )}
                      
                      {isSelected && (
                        <Badge variant="default" className="text-xs bg-blue-500">
                          ✓ In cart
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Day completion warning if missing needs */}
          {currentDayItems.length > 0 && !currentDayItems.some(item => item.required) && (
            <div className="bg-red-100 p-3 rounded-lg border-2 border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-bold text-red-800">Don't forget your needs!</span>
              </div>
              <p className="text-red-700 text-sm">Make sure you have lunch money and other essentials.</p>
            </div>
          )}
          
          <Button 
            onClick={finishDay}
            disabled={currentDaySpent === 0}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3"
          >
            Finish {dayNames[currentDay - 1]} →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'review') {
    const totalSpent = weekExpenses.reduce((sum, day) => sum + day.totalSpent, 0);
    const averageDaily = totalSpent / 5;
    const savedTotal = weeklyBudget - totalSpent;
    
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">📊 Week Review</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Budget Week Results</h3>
              
              {/* Week Summary Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                  <Coins className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-green-800">{totalSpent}</div>
                  <div className="text-xs text-green-600">Total Spent</div>
                </div>
                
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                  <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-blue-800">{averageDaily.toFixed(1)}</div>
                  <div className="text-xs text-blue-600">Daily Average</div>
                </div>
                
                <div className="bg-purple-100 p-3 rounded-lg border border-purple-200">
                  <Home className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                  <div className="font-bold text-purple-800">{savedTotal}</div>
                  <div className="text-xs text-purple-600">Money Saved</div>
                </div>
                
                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                  <Heart className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="font-bold text-yellow-800">{weekExpenses.reduce((sum, day) => sum + day.items.length, 0)}</div>
                  <div className="text-xs text-yellow-600">Items Bought</div>
                </div>
              </div>
            </div>
            
            {/* Daily Breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-purple-800">📅 Day-by-Day Breakdown:</h4>
              {weekExpenses.map((day, index) => {
                const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const isOverBudget = day.totalSpent > dailyBudget;
                
                return (
                  <div 
                    key={day.day} 
                    className={`p-3 rounded-lg border-2 ${
                      isOverBudget ? 'bg-red-100 border-red-200' : 'bg-green-100 border-green-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">
                        {dayNames[index]} - Day {day.day}
                      </span>
                      <span className={`font-bold ${isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
                        {day.totalSpent} coins {isOverBudget ? '⚠️' : '✅'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {day.items.map(item => (
                        <Badge 
                          key={`${day.day}-${item.id}`}
                          variant="outline" 
                          className="text-xs"
                        >
                          {item.emoji} {item.name} ({item.cost})
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Analysis */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Budget Analysis:</h4>
              <div className="text-blue-700 text-sm space-y-1">
                {savedTotal > 0 && (
                  <div>✨ Great job! You saved {savedTotal} coins this week.</div>
                )}
                {weekExpenses.every(day => day.totalSpent <= dailyBudget) && (
                  <div>🎉 Perfect! You stayed within budget every single day.</div>
                )}
                {weekExpenses.some(day => day.totalSpent > dailyBudget) && (
                  <div>📝 Some days you went over the daily budget, but that's okay if you balanced it with other days!</div>
                )}
                {weekExpenses.some(day => day.items.some(item => item.category === 'needs')) && (
                  <div>✅ You remembered to buy important things like food and school supplies.</div>
                )}
                {weekExpenses.some(day => day.items.some(item => item.category === 'wants')) && (
                  <div>😊 You treated yourself to some fun things too - balance is important!</div>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            See my final results! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    const totalSpent = weekExpenses.reduce((sum, day) => sum + day.totalSpent, 0);
    const savedTotal = weeklyBudget - totalSpent;
    const stayedInBudget = totalSpent <= weeklyBudget;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🏆 Budget Week Complete!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Budget Challenge Complete!</h3>
            
            {/* Final Results */}
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className={`text-3xl mb-2 ${stayedInBudget ? 'text-green-500' : 'text-yellow-500'}`}>
                  {stayedInBudget ? '🎉' : '📊'}
                </div>
                <div className="font-bold text-lg">
                  {stayedInBudget ? 'SUCCESS!' : 'LEARNING!'}
                </div>
                <p className="text-sm text-gray-600">
                  {stayedInBudget ? 'Stayed in budget' : 'Went over budget'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">{savedTotal >= 0 ? savedTotal : 0}</div>
                <p className="text-sm text-gray-600">Coins saved</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="font-bold text-lg">Budget Skills</div>
                <p className="text-sm text-gray-600">Learned!</p>
              </div>
            </div>
            
            {/* Lessons Learned */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎓 What You Learned:</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                <div>• 📋 Planning your spending helps money last longer</div>
                <div>• ⚖️ Balancing needs and wants is a key skill</div>
                <div>• 💡 Small daily choices add up to big weekly results</div>
                <div>• 🏦 Saving even a little bit feels great!</div>
                <div>• 🔄 If you go over budget one day, you can adjust the next day</div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-blue-800">
                <strong>🌟 Budget Master Tip:</strong> Real budgeting is about making choices that help you 
                reach your goals while still enjoying life. You did great practicing this important skill!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 📊
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default MiniWeekBudgetQuest;