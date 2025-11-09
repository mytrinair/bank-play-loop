import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Coins, Gift, Clock, Heart, X, CheckCircle, Calendar } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Choice {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'immediate' | 'short-term' | 'long-term';
  satisfaction: 'low' | 'medium' | 'high';
  duration: string;
  emoji: string;
}

const BirthdayMoneyQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'choices' | 'reflection' | 'result'>('intro');
  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);
  const [budget] = useState(25);
  const [reflectionAnswers, setReflectionAnswers] = useState<{[key: string]: string}>({});

  const choices: Choice[] = [
    {
      id: 'candy',
      title: 'Big Bag of Candy',
      description: 'Colorful gummy bears, chocolate bars, and lollipops',
      cost: 8,
      type: 'immediate',
      satisfaction: 'high',
      duration: '30 minutes of fun',
      emoji: '🍭'
    },
    {
      id: 'toy',
      title: 'Cool Action Figure',
      description: 'Superhero figure with moveable parts and accessories',
      cost: 15,
      type: 'short-term',
      satisfaction: 'high',
      duration: 'Weeks of play',
      emoji: '🦸'
    },
    {
      id: 'book',
      title: 'Adventure Book Series',
      description: 'Set of 3 exciting stories about dragons and magic',
      cost: 12,
      type: 'long-term',
      satisfaction: 'high',
      duration: 'Months of reading',
      emoji: '📚'
    },
    {
      id: 'game',
      title: 'Video Game',
      description: 'Popular racing game for your gaming system',
      cost: 20,
      type: 'long-term',
      satisfaction: 'high',
      duration: 'Years of gaming',
      emoji: '🎮'
    },
    {
      id: 'art',
      title: 'Art Supplies Kit',
      description: 'Markers, colored pencils, sketch pad, and stickers',
      cost: 10,
      type: 'long-term',
      satisfaction: 'medium',
      duration: 'Months of creativity',
      emoji: '🎨'
    },
    {
      id: 'save',
      title: 'Save for Future Goal',
      description: 'Put money toward that bike you really want',
      cost: 25,
      type: 'long-term',
      satisfaction: 'medium',
      duration: 'Future happiness',
      emoji: '🏦'
    },
    {
      id: 'friend-gift',
      title: 'Gift for Friend',
      description: 'Small present for your best friend\'s upcoming birthday',
      cost: 6,
      type: 'short-term',
      satisfaction: 'high',
      duration: 'Friendship joy',
      emoji: '🎁'
    },
    {
      id: 'experience',
      title: 'Movie & Popcorn',
      description: 'See the new animated movie with snacks',
      cost: 14,
      type: 'immediate',
      satisfaction: 'high',
      duration: '2 hours of fun',
      emoji: '🍿'
    }
  ];

  const handleChoiceToggle = (choice: Choice) => {
    const isSelected = selectedChoices.some(c => c.id === choice.id);
    if (isSelected) {
      setSelectedChoices(selectedChoices.filter(c => c.id !== choice.id));
    } else {
      const totalCost = selectedChoices.reduce((sum, c) => sum + c.cost, 0) + choice.cost;
      if (totalCost <= budget) {
        setSelectedChoices([...selectedChoices, choice]);
      }
    }
  };

  const totalSpent = selectedChoices.reduce((sum, choice) => sum + choice.cost, 0);
  const remainingBudget = budget - totalSpent;

  const completeQuest = () => {
    let points = 20; // Base points
    let badge = 'Birthday Spender';
    
    // Analyze choices for scoring
    const hasLongTerm = selectedChoices.some(c => c.type === 'long-term');
    const hasImmediate = selectedChoices.some(c => c.type === 'immediate');
    const savedSome = selectedChoices.some(c => c.id === 'save');
    const helpedFriend = selectedChoices.some(c => c.id === 'friend-gift');
    const balancedSpending = selectedChoices.length >= 2 && selectedChoices.length <= 4;
    
    if (hasLongTerm) points += 8; // Good long-term thinking
    if (savedSome) points += 10; // Excellent saving
    if (helpedFriend) points += 5; // Kindness bonus
    if (balancedSpending) points += 5; // Not all-or-nothing
    if (remainingBudget >= 5) points += 5; // Kept some money
    
    if (points >= 35) {
      badge = 'Future Planner';
    } else if (points >= 28) {
      badge = 'Smart Spender';
    } else if (points >= 23) {
      badge = 'Balanced Chooser';
    }
    
    onComplete({ coins: Math.min(30, points), badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-pink-800">🎂 It's Your Birthday!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🎉</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-pink-700">Happy Birthday to You!</h3>
              <p className="text-lg text-gray-600">
                What an amazing day! Your family threw you a wonderful party with cake, games, 
                and all your friends. And the best part? You got birthday money!
              </p>
              <div className="bg-pink-100 p-4 rounded-lg border-2 border-pink-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-6 w-6 text-pink-500" />
                  <span className="text-2xl font-bold text-pink-700">You received 25 coins!</span>
                </div>
                <p className="text-pink-600">Now comes the fun part - deciding how to use it!</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-3"
          >
            What should I do with it? →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'learning') {
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">⏰ Short-term vs Long-term Rewards</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-blue-700">Different Types of Happiness</h3>
              <p className="text-gray-600 mt-2">
                Some things make us happy right now, others make us happy for a long time. Let's learn the difference!
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-bold text-red-800">Immediate Fun</h4>
                  <p className="text-red-700 text-sm mt-2">
                    Feels amazing right now but doesn't last very long. Like candy or a movie.
                  </p>
                  <div className="mt-2 text-xs text-red-600">
                    🍭 Minutes to hours
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-bold text-yellow-800">Short-term Joy</h4>
                  <p className="text-yellow-700 text-sm mt-2">
                    Makes you happy for days or weeks. Like a new toy or book.
                  </p>
                  <div className="mt-2 text-xs text-yellow-600">
                    🎮 Days to weeks
                  </div>
                </div>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-green-800">Long-term Happiness</h4>
                  <p className="text-green-700 text-sm mt-2">
                    Gives you joy for months or years. Like saving for something big you really want.
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    🏦 Months to years
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
              <h4 className="font-bold text-purple-800 mb-2">🎯 The Smart Balance</h4>
              <p className="text-purple-700">
                The happiest people choose a mix! Some immediate fun, some short-term joy, 
                and some long-term planning. There's no perfect answer - it depends on what matters to you most.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('choices')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Show me my options! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'choices') {
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🛍️ Birthday Shopping Time!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Budget Display */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-green-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-pink-500" />
                <span className="font-bold">Birthday Money: {budget} coins</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">Spent: {totalSpent} coins</span>
                <span className="font-bold text-green-600">Left: {remainingBudget} coins</span>
              </div>
            </div>
          </div>
          
          {/* Selected Items */}
          {selectedChoices.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">🛒 Your Birthday Choices:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChoices.map((choice) => (
                  <Badge 
                    key={choice.id}
                    variant="secondary" 
                    className="text-sm p-2 cursor-pointer hover:bg-red-200"
                    onClick={() => handleChoiceToggle(choice)}
                  >
                    {choice.emoji} {choice.title} ({choice.cost} coins) ❌
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Choice Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {choices.map((choice) => {
              const canAfford = choice.cost <= remainingBudget;
              const isSelected = selectedChoices.some(c => c.id === choice.id);
              
              const typeColor = choice.type === 'immediate' ? 'border-red-300 bg-red-50' :
                              choice.type === 'short-term' ? 'border-yellow-300 bg-yellow-50' :
                              'border-green-300 bg-green-50';
              
              const typeLabel = choice.type === 'immediate' ? '⚡ Right Now' :
                              choice.type === 'short-term' ? '📅 Short-term' :
                              '🌟 Long-term';
              
              return (
                <Card 
                  key={choice.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'ring-2 ring-blue-400 bg-blue-100 border-blue-400' 
                      : canAfford 
                        ? `hover:shadow-lg hover:scale-105 ${typeColor}` 
                        : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                  onClick={() => canAfford && handleChoiceToggle(choice)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{choice.emoji}</div>
                    <h3 className="font-bold text-sm">{choice.title}</h3>
                    <p className="text-xs text-gray-600">{choice.description}</p>
                    
                    <Badge variant="outline" className="text-xs">
                      {typeLabel}
                    </Badge>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-bold">{choice.cost} coins</span>
                      </div>
                      <div className="text-xs text-gray-500">{choice.duration}</div>
                    </div>
                    
                    {!canAfford && !isSelected && (
                      <Badge variant="destructive" className="text-xs">
                        Can't afford
                      </Badge>
                    )}
                    
                    {isSelected && (
                      <Badge variant="default" className="text-xs bg-blue-500">
                        ✓ Selected
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center">
              💭 <strong>Remember:</strong> You can pick multiple items as long as you have enough coins! 
              Think about what will make you happiest overall.
            </p>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('reflection')}
            disabled={selectedChoices.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
          >
            Think about my choices →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'reflection') {
    const immediateItems = selectedChoices.filter(c => c.type === 'immediate');
    const shortTermItems = selectedChoices.filter(c => c.type === 'short-term');
    const longTermItems = selectedChoices.filter(c => c.type === 'long-term');
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🤔 Let's Reflect</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Birthday Spending Plan</h3>
              
              {/* Summary of choices */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-800 text-sm">⚡ Right Now Fun</h4>
                  <div className="text-xs text-red-700 mt-1">
                    {immediateItems.length > 0 
                      ? immediateItems.map(i => i.emoji).join(' ') + ` (${immediateItems.reduce((s, i) => s + i.cost, 0)} coins)`
                      : 'None selected'}
                  </div>
                </div>
                
                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 text-sm">📅 Short-term Joy</h4>
                  <div className="text-xs text-yellow-700 mt-1">
                    {shortTermItems.length > 0 
                      ? shortTermItems.map(i => i.emoji).join(' ') + ` (${shortTermItems.reduce((s, i) => s + i.cost, 0)} coins)`
                      : 'None selected'}
                  </div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 text-sm">🌟 Long-term Planning</h4>
                  <div className="text-xs text-green-700 mt-1">
                    {longTermItems.length > 0 
                      ? longTermItems.map(i => i.emoji).join(' ') + ` (${longTermItems.reduce((s, i) => s + i.cost, 0)} coins)`
                      : 'None selected'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">💭 Think about this:</h4>
                <p className="text-blue-700 text-sm mb-3">
                  How do you feel about your choices? Which items do you think will make you happiest in the long run?
                </p>
                <textarea 
                  className="w-full p-2 border rounded text-sm"
                  rows={2}
                  placeholder="I chose these items because..."
                  value={reflectionAnswers.feelings || ''}
                  onChange={(e) => setReflectionAnswers({...reflectionAnswers, feelings: e.target.value})}
                />
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-2">🎯 Looking ahead:</h4>
                <p className="text-green-700 text-sm mb-3">
                  If you got another 25 coins next month, would you make the same choices? Why or why not?
                </p>
                <textarea 
                  className="w-full p-2 border rounded text-sm"
                  rows={2}
                  placeholder="Next time I might..."
                  value={reflectionAnswers.future || ''}
                  onChange={(e) => setReflectionAnswers({...reflectionAnswers, future: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            See my results! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    const immediateItems = selectedChoices.filter(c => c.type === 'immediate');
    const shortTermItems = selectedChoices.filter(c => c.type === 'short-term');
    const longTermItems = selectedChoices.filter(c => c.type === 'long-term');
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🎉 Birthday Spending Results!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Great Birthday Choices!</h3>
            
            {/* Spending Summary */}
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
                  <Gift className="h-5 w-5 text-pink-500" />
                  <span className="font-bold text-lg">{selectedChoices.length}</span>
                </div>
                <p className="text-sm text-gray-600">Items chosen</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-lg">{remainingBudget}</span>
                </div>
                <p className="text-sm text-gray-600">Coins saved</p>
              </div>
            </div>
            
            {/* Choice Analysis */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📊 Your Spending Pattern:</h4>
              <div className="text-blue-700 text-sm">
                {longTermItems.length > 0 && (
                  <div>✨ You thought about the future! Long-term choices often bring lasting happiness.</div>
                )}
                {immediateItems.length > 0 && (
                  <div>⚡ You picked some immediate fun! It's good to enjoy the moment sometimes.</div>
                )}
                {shortTermItems.length > 0 && (
                  <div>📅 You chose some short-term joy! Great balance between now and later.</div>
                )}
                {remainingBudget >= 5 && (
                  <div>💰 You saved some money! That shows great self-control.</div>
                )}
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <p className="text-yellow-800">
                <strong>🎈 What you learned:</strong> Birthday money decisions help us practice thinking about 
                immediate happiness vs. long-term satisfaction. The best choice is the one that feels right for YOU!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🎂
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default BirthdayMoneyQuest;