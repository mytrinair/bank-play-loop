import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Coins, Clock, Heart, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Snack {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  benefits: string[];
  tradeoffs: string[];
  category: 'healthy' | 'treat' | 'expensive';
}

const SnackStandQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'choice' | 'comparison' | 'result'>('intro');
  const [selectedSnacks, setSelectedSnacks] = useState<Snack[]>([]);
  const [budget] = useState(12); // Student has 12 coins
  const [currentComparison, setCurrentComparison] = useState<{snack1: Snack, snack2: Snack} | null>(null);

  const snacks: Snack[] = [
    {
      id: 'apple',
      name: 'Fresh Apple',
      price: 3,
      emoji: '🍎',
      description: 'Crispy, sweet, and healthy',
      benefits: ['Healthy and nutritious', 'Keeps you full longer', 'Good for your teeth'],
      tradeoffs: ['Not as sweet as candy', 'Takes longer to eat'],
      category: 'healthy'
    },
    {
      id: 'cookies',
      name: 'Chocolate Cookies',
      price: 5,
      emoji: '🍪',
      description: 'Warm, gooey chocolate chip cookies',
      benefits: ['Tastes amazing', 'Makes you happy', 'Perfect treat'],
      tradeoffs: ['Not very healthy', 'Makes you hungry later', 'More expensive'],
      category: 'treat'
    },
    {
      id: 'juice',
      name: 'Fruit Juice Box',
      price: 4,
      emoji: '🧃',
      description: 'Sweet orange juice drink',
      benefits: ['Refreshing and tasty', 'Easy to drink quickly', 'Some vitamins'],
      tradeoffs: ['Lots of sugar', 'Finished quickly', 'Not very filling'],
      category: 'treat'
    },
    {
      id: 'granola',
      name: 'Granola Bar',
      price: 6,
      emoji: '🥜',
      description: 'Crunchy bar with nuts and honey',
      benefits: ['Healthy ingredients', 'Keeps you full', 'Good energy'],
      tradeoffs: ['More expensive', 'Not as sweet', 'Takes time to chew'],
      category: 'healthy'
    },
    {
      id: 'candy',
      name: 'Gummy Bears',
      price: 3,
      emoji: '🐻',
      description: 'Colorful, chewy, super sweet',
      benefits: ['Very tasty', 'Fun to eat', 'Cheap price'],
      tradeoffs: ['No nutrition', 'Sugar rush then crash', 'Bad for teeth'],
      category: 'treat'
    },
    {
      id: 'sandwich',
      name: 'Mini Sandwich',
      price: 8,
      emoji: '🥪',
      description: 'Turkey and cheese sandwich',
      benefits: ['Very filling', 'Balanced nutrition', 'Tastes good'],
      tradeoffs: ['Most expensive', 'Takes time to eat', 'Uses most of budget'],
      category: 'expensive'
    },
    {
      id: 'crackers',
      name: 'Cheese Crackers',
      price: 4,
      emoji: '🧀',
      description: 'Crispy crackers with cheese flavor',
      benefits: ['Good snack size', 'Satisfying crunch', 'Not too sweet'],
      tradeoffs: ['Can be salty', 'Not very exciting', 'Medium price'],
      category: 'healthy'
    }
  ];

  const handleSnackSelect = (snack: Snack) => {
    const totalCost = selectedSnacks.reduce((sum, s) => sum + s.price, 0) + snack.price;
    if (totalCost <= budget) {
      setSelectedSnacks([...selectedSnacks, snack]);
    }
  };

  const removeSnack = (snackId: string) => {
    setSelectedSnacks(selectedSnacks.filter(s => s.id !== snackId));
  };

  const totalSpent = selectedSnacks.reduce((sum, snack) => sum + snack.price, 0);
  const remainingBudget = budget - totalSpent;

  const startComparison = () => {
    // Pick two different snacks for comparison
    const snack1 = snacks[0]; // Apple
    const snack2 = snacks[1]; // Cookies
    setCurrentComparison({ snack1, snack2 });
    setCurrentStep('comparison');
  };

  const completeQuest = () => {
    let points = 0;
    let badge = 'Snack Explorer';
    
    // Calculate points based on choices
    const hasHealthy = selectedSnacks.some(s => s.category === 'healthy');
    const hasTreat = selectedSnacks.some(s => s.category === 'treat');
    const stayedInBudget = totalSpent <= budget;
    const usedBudgetWisely = totalSpent >= budget * 0.7; // Used at least 70% of budget
    
    if (hasHealthy && stayedInBudget) points += 10;
    if (usedBudgetWisely) points += 5;
    if (hasHealthy && hasTreat) points += 8; // Balanced choice
    if (remainingBudget >= 3) points += 5; // Saved some money
    
    if (points >= 18) {
      badge = 'Smart Shopper';
    } else if (points >= 12) {
      badge = 'Balanced Chooser';
    }
    
    const earnedCoins = Math.max(8, points);
    onComplete({ coins: earnedCoins, badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-800">🍎 The Snack Stand Dilemma</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🏫</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-700">After School Snack Time!</h3>
              <p className="text-lg text-gray-600">
                School just ended and you're walking past the snack stand near the playground. 
                Your tummy is rumbling and all the snacks look so good!
              </p>
              <div className="bg-orange-100 p-4 rounded-lg border-2 border-orange-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-orange-700">You have 12 coins to spend</span>
                </div>
                <p className="text-orange-600">But there are so many choices... what will you pick?</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
          >
            Let's learn about choices! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'learning') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-800">🤔 Understanding Opportunity Cost</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold text-orange-700">Every Choice Has a Trade-off</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">💡 What is Opportunity Cost?</h4>
                <p className="text-blue-700">
                  When you choose one thing, you give up the chance to choose something else. 
                  That's called opportunity cost!
                </p>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">🍎 Example</h4>
                <p className="text-green-700">
                  If you buy cookies for 5 coins, you can't use those 5 coins for an apple and juice box!
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎯 Your Mission</h4>
              <p className="text-yellow-700">
                Think carefully about each choice. What are you gaining? What are you giving up? 
                There's no wrong answer - just learn from your decisions!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('choice')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3"
          >
            Ready to choose! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'choice') {
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-800">🛒 Choose Your Snacks</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Budget Display */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">Budget: {budget} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Spent: {totalSpent} coins</span>
                <span className="font-bold text-green-600">Remaining: {remainingBudget} coins</span>
              </div>
            </div>
          </div>
          
          {/* Selected Snacks */}
          {selectedSnacks.length > 0 && (
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-green-800 mb-2">🛒 Your Cart:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSnacks.map((snack, index) => (
                  <Badge 
                    key={`${snack.id}-${index}`}
                    variant="secondary" 
                    className="text-lg p-2 cursor-pointer hover:bg-red-200"
                    onClick={() => removeSnack(snack.id)}
                  >
                    {snack.emoji} {snack.name} ({snack.price} coins) ❌
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Snack Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snacks.map((snack) => {
              const canAfford = snack.price <= remainingBudget;
              const isSelected = selectedSnacks.some(s => s.id === snack.id);
              
              return (
                <Card 
                  key={snack.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    canAfford 
                      ? 'hover:shadow-lg hover:scale-105 bg-white border-gray-200' 
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                  onClick={() => canAfford && handleSnackSelect(snack)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{snack.emoji}</div>
                    <h3 className="font-bold text-lg">{snack.name}</h3>
                    <p className="text-sm text-gray-600">{snack.description}</p>
                    
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{snack.price} coins</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-green-600">
                        ✓ {snack.benefits[0]}
                      </div>
                      <div className="text-xs text-orange-600">
                        ⚠ {snack.tradeoffs[0]}
                      </div>
                    </div>
                    
                    {!canAfford && (
                      <Badge variant="destructive" className="text-xs">
                        Can't afford
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={startComparison}
              disabled={selectedSnacks.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Compare Choices →
            </Button>
            <Button 
              onClick={() => setCurrentStep('result')}
              disabled={selectedSnacks.length === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              I'm Done Choosing! →
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'comparison' && currentComparison) {
    const { snack1, snack2 } = currentComparison;
    
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">⚖️ Compare & Learn</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              {snack1.emoji} {snack1.name} VS {snack2.emoji} {snack2.name}
            </h3>
            <p className="text-gray-600">Let's see what you gain and give up with each choice!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Snack 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{snack1.emoji}</div>
                <h4 className="text-xl font-bold">{snack1.name}</h4>
                <p className="text-gray-600">{snack1.description}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{snack1.price} coins</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-green-600 mb-1">👍 What you gain:</h5>
                  {snack1.benefits.map((benefit, idx) => (
                    <div key={idx} className="text-sm text-green-700">• {benefit}</div>
                  ))}
                </div>
                
                <div>
                  <h5 className="font-bold text-orange-600 mb-1">👎 What you give up:</h5>
                  {snack1.tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="text-sm text-orange-700">• {tradeoff}</div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Snack 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{snack2.emoji}</div>
                <h4 className="text-xl font-bold">{snack2.name}</h4>
                <p className="text-gray-600">{snack2.description}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{snack2.price} coins</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-green-600 mb-1">👍 What you gain:</h5>
                  {snack2.benefits.map((benefit, idx) => (
                    <div key={idx} className="text-sm text-green-700">• {benefit}</div>
                  ))}
                </div>
                
                <div>
                  <h5 className="font-bold text-orange-600 mb-1">👎 What you give up:</h5>
                  {snack2.tradeoffs.map((tradeoff, idx) => (
                    <div key={idx} className="text-sm text-orange-700">• {tradeoff}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center font-medium">
              💭 See how every choice has benefits AND tradeoffs? That's opportunity cost in action!
            </p>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('choice')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Back to Shopping →
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
            <h2 className="text-3xl font-bold text-green-800">🎉 Snack Time Results!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Great Job Learning About Choices!</h3>
            
            {/* Show selected snacks */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🛒 You chose:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedSnacks.map((snack, index) => (
                  <Badge key={`${snack.id}-${index}`} variant="secondary" className="text-lg p-2">
                    {snack.emoji} {snack.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-lg">{totalSpent}</span>
                </div>
                <p className="text-sm text-gray-600">Coins spent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-lg">{remainingBudget}</span>
                </div>
                <p className="text-sm text-gray-600">Coins saved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="font-bold text-lg">{selectedSnacks.length}</span>
                </div>
                <p className="text-sm text-gray-600">Snacks picked</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <p className="text-yellow-800">
                <strong>💡 What you learned:</strong> Every time you spend money on one thing, 
                you can't spend it on something else. That's opportunity cost! 
                The key is thinking about what matters most to you.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🌟
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default SnackStandQuest;