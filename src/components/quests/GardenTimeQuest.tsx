import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Coins, Sparkles, Target, ShoppingBag, X, CheckCircle } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Choice {
  id: string;
  title: string;
  description: string;
  type: 'save' | 'spend' | 'invest';
  coins: number;
  consequence: string;
  points: number;
}

const GardenTimeQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'scenario' | 'choice' | 'result'>('intro');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const choices: Choice[] = [
    {
      id: 'save-all',
      title: 'Save All 15 Coins',
      description: 'Put all the coins in your piggy bank for later',
      type: 'save',
      coins: 15,
      consequence: 'Great job! You\'re building good saving habits. Your future self will thank you!',
      points: 15
    },
    {
      id: 'save-some',
      title: 'Save 10, Spend 5',
      description: 'Save most but buy a small treat',
      type: 'save',
      coins: 10,
      consequence: 'Smart balance! You saved most of your money but also enjoyed a little treat.',
      points: 12
    },
    {
      id: 'spend-fun',
      title: 'Buy Fun Stickers',
      description: 'Spend 8 coins on cool stickers, save the rest',
      type: 'spend',
      coins: 7,
      consequence: 'Stickers are fun! You still saved some money too. Think about needs vs wants next time.',
      points: 8
    },
    {
      id: 'spend-all',
      title: 'Spend on Candy',
      description: 'Use all 15 coins to buy lots of candy',
      type: 'spend',
      coins: 0,
      consequence: 'The candy was tasty, but now you have no money left. What if something important comes up?',
      points: 3
    },
    {
      id: 'help-friend',
      title: 'Help a Friend',
      description: 'Give 5 coins to help a friend, save 10 coins',
      type: 'invest',
      coins: 10,
      consequence: 'You\'re so kind! Helping friends is wonderful, and you still saved money too.',
      points: 14
    }
  ];

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    setTotalPoints(choice.points);
    setCurrentStep('result');
  };

  const completeQuest = () => {
    const earnedCoins = Math.max(5, Math.floor(totalPoints * 0.8)); // Minimum 5 coins, max based on choices
    let badge = 'Garden Helper';
    
    if (totalPoints >= 14) {
      badge = 'Wise Saver';
    } else if (totalPoints >= 10) {
      badge = 'Smart Spender';
    }
    
    onComplete({ coins: earnedCoins, badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🌱 Garden Time!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🌻</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-700">Great Job Helping!</h3>
              <p className="text-lg text-gray-600">
                You just helped your teacher clean up the class garden after the plants got messy from the wind. 
                Everyone worked together to make it beautiful again!
              </p>
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold text-green-700">You earned 15 coins!</span>
                </div>
                <p className="text-green-600">Your teacher was so happy with your help!</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('scenario')}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            What happens next? →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'scenario') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">💭 Decision Time</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-center space-y-4">
              <div className="text-5xl">🤔</div>
              <h3 className="text-2xl font-bold text-green-700">Now you have 15 coins...</h3>
              <p className="text-lg text-gray-600">
                You're walking home from school with your 15 coins in your pocket. 
                There are so many things you could do with this money!
              </p>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <p className="text-yellow-800 font-medium">
                  💡 Remember: Think about what's most important to you. 
                  What would make you happiest in the long run?
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('choice')}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
          >
            See my options →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'choice') {
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🌱 What will you do?</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4">
            {choices.map((choice) => {
              const bgColor = choice.type === 'save' ? 'from-green-100 to-green-50 border-green-200' :
                             choice.type === 'invest' ? 'from-blue-100 to-blue-50 border-blue-200' :
                             'from-orange-100 to-orange-50 border-orange-200';
              
              const icon = choice.type === 'save' ? Target :
                          choice.type === 'invest' ? Sparkles :
                          ShoppingBag;
              
              const IconComponent = icon;
              
              return (
                <Card 
                  key={choice.id}
                  className={`p-6 cursor-pointer hover:shadow-lg transition-all border-2 bg-gradient-to-r ${bgColor} hover:scale-105`}
                  onClick={() => handleChoiceSelect(choice)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      choice.type === 'save' ? 'bg-green-500' :
                      choice.type === 'invest' ? 'bg-blue-500' :
                      'bg-orange-500'
                    } text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{choice.title}</h3>
                      <p className="text-gray-600">{choice.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">
                          {choice.coins > 0 ? `${choice.coins} coins left` : 'No coins left'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={choice.type === 'save' ? 'default' : 'secondary'}>
                        {choice.type === 'save' ? '💎 Save' : 
                         choice.type === 'invest' ? '✨ Help' : '🛍️ Spend'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-blue-800 text-center">
              💭 Take your time to think about each choice. What feels right to you?
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result' && selectedChoice) {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🎉 Great Choice!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">You chose: {selectedChoice.title}</h3>
            
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <p className="text-lg text-green-700 font-medium">{selectedChoice.consequence}</p>
            </div>
            
            <div className="flex justify-center gap-8 py-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-lg">{selectedChoice.coins}</span>
                </div>
                <p className="text-sm text-gray-600">Coins remaining</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="font-bold text-lg">{totalPoints}</span>
                </div>
                <p className="text-sm text-gray-600">Wisdom points</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <p className="text-yellow-800">
                💡 <strong>Remember:</strong> Every money choice teaches us something. 
                Think about how this choice made you feel!
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

export default GardenTimeQuest;