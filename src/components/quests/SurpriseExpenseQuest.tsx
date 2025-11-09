import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle, Coins, Heart, Shield, Zap, X, CheckCircle, Clock, Star } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface ExpenseOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  outcome: 'good' | 'okay' | 'bad';
  consequences: string;
  emoji: string;
  timeFrame: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  problem: string;
  emoji: string;
  urgency: 'low' | 'medium' | 'high';
}

const SurpriseExpenseQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'scenario1' | 'scenario2' | 'scenario3' | 'reflection' | 'result'>('intro');
  const [savings] = useState(30);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scenarioChoices, setScenarioChoices] = useState<{[key: number]: ExpenseOption}>({});
  const [moneySpent, setMoneySpent] = useState(0);

  const scenarios: Scenario[] = [
    {
      id: 'broken-bike',
      title: 'Broken Bike Chain',
      description: 'You ride your bike to school every day',
      problem: 'Your bike chain snapped on the way to school! You need to fix it or find another way to get around.',
      emoji: '🚲',
      urgency: 'medium'
    },
    {
      id: 'birthday-party',
      title: 'Surprise Birthday Party',
      description: 'Your best friend is having a birthday party tomorrow',
      problem: 'You forgot about the party and need to get a gift! You can\'t show up empty-handed.',
      emoji: '🎂',
      urgency: 'high'
    },
    {
      id: 'school-trip',
      title: 'Field Trip Permission',
      description: 'Your class is going on an educational field trip',
      problem: 'The school needs the field trip money by Friday, but your parents are out of town and asked you to handle it.',
      emoji: '🏛️',
      urgency: 'medium'
    }
  ];

  const getOptionsForScenario = (scenarioIndex: number): ExpenseOption[] => {
    if (scenarioIndex === 0) { // Broken bike
      return [
        {
          id: 'bike-repair',
          title: 'Fix at Bike Shop',
          description: 'Professional repair with new chain and tune-up',
          cost: 15,
          outcome: 'good',
          consequences: 'Bike works perfectly for months. You get to school on time every day.',
          emoji: '🔧',
          timeFrame: 'Fixed today'
        },
        {
          id: 'diy-repair',
          title: 'Buy Chain & DIY',
          description: 'Buy a chain and try to fix it yourself with online tutorials',
          cost: 8,
          outcome: 'okay',
          consequences: 'Takes a few tries but you learn a new skill. Bike works but might need adjustments.',
          emoji: '🛠️',
          timeFrame: 'Fixed this weekend'
        },
        {
          id: 'walk-school',
          title: 'Walk to School',
          description: 'Leave the bike broken and walk every day',
          cost: 0,
          outcome: 'bad',
          consequences: 'You\'re tired and often late. Takes 30 minutes each way instead of 10.',
          emoji: '🚶',
          timeFrame: 'Permanent change'
        },
        {
          id: 'borrow-money',
          title: 'Ask Parents for Loan',
          description: 'Get money from parents and pay them back later',
          cost: 12,
          outcome: 'okay',
          consequences: 'Bike gets fixed but you owe your parents money. They charge you interest!',
          emoji: '💳',
          timeFrame: 'Fixed today, debt later'
        }
      ];
    } else if (scenarioIndex === 1) { // Birthday party
      return [
        {
          id: 'nice-gift',
          title: 'Buy Nice Gift',
          description: 'Get something your friend really wants from their wishlist',
          cost: 12,
          outcome: 'good',
          consequences: 'Your friend loves the gift! You feel great about being a good friend.',
          emoji: '🎁',
          timeFrame: 'Tomorrow'
        },
        {
          id: 'homemade-gift',
          title: 'Make Something',
          description: 'Create a handmade card and small craft project',
          cost: 3,
          outcome: 'good',
          consequences: 'Your friend is touched by the personal effort. Very meaningful gift!',
          emoji: '✂️',
          timeFrame: 'Tonight'
        },
        {
          id: 'skip-party',
          title: 'Don\'t Go to Party',
          description: 'Make up an excuse and don\'t attend',
          cost: 0,
          outcome: 'bad',
          consequences: 'Friend is hurt and disappointed. Your friendship is damaged.',
          emoji: '😔',
          timeFrame: 'Tomorrow'
        },
        {
          id: 'promise-later',
          title: 'Promise Gift Later',
          description: 'Go to party and promise to give gift next week',
          cost: 8,
          outcome: 'okay',
          consequences: 'Friend understands but you feel awkward at the party. Gift comes late.',
          emoji: '🤝',
          timeFrame: 'Next week'
        }
      ];
    } else { // School trip
      return [
        {
          id: 'pay-trip',
          title: 'Pay for Trip',
          description: 'Use your savings to pay the full field trip cost',
          cost: 20,
          outcome: 'good',
          consequences: 'You go on the amazing field trip and learn lots! Great memories with classmates.',
          emoji: '🎒',
          timeFrame: 'This Friday'
        },
        {
          id: 'partial-payment',
          title: 'Ask for Payment Plan',
          description: 'Pay half now, ask teacher about paying the rest later',
          cost: 10,
          outcome: 'okay',
          consequences: 'Teacher allows it but you need to bring the rest next week. A bit stressful.',
          emoji: '📝',
          timeFrame: 'Split payment'
        },
        {
          id: 'miss-trip',
          title: 'Skip the Trip',
          description: 'Stay at school while everyone else goes on the trip',
          cost: 0,
          outcome: 'bad',
          consequences: 'You miss out on learning and fun. Spend the day alone doing worksheets.',
          emoji: '😞',
          timeFrame: 'Miss opportunity'
        },
        {
          id: 'call-parents',
          title: 'Emergency Call Parents',
          description: 'Call parents to ask them to handle payment remotely',
          cost: 18,
          outcome: 'okay',
          consequences: 'Parents handle it but they\'re stressed about being disturbed during their trip.',
          emoji: '📞',
          timeFrame: 'This week'
        }
      ];
    }
    return [];
  };

  const handleChoiceSelect = (option: ExpenseOption) => {
    setScenarioChoices({...scenarioChoices, [currentScenario]: option});
    setMoneySpent(moneySpent + option.cost);
    
    if (currentScenario === 0) {
      setCurrentStep('scenario2');
      setCurrentScenario(1);
    } else if (currentScenario === 1) {
      setCurrentStep('scenario3');
      setCurrentScenario(2);
    } else {
      setCurrentStep('reflection');
    }
  };

  const remainingSavings = savings - moneySpent;

  const completeQuest = () => {
    let points = 25; // Base points
    let badge = 'Surprise Solver';
    
    // Analyze choices
    const choices = Object.values(scenarioChoices);
    const goodChoices = choices.filter(c => c.outcome === 'good').length;
    const spentWisely = moneySpent <= savings * 0.8; // Didn't spend everything
    const balancedSpending = choices.some(c => c.cost === 0) && choices.some(c => c.cost > 0);
    const keptFriendships = scenarioChoices[1]?.outcome !== 'bad';
    const planned = choices.filter(c => c.cost > 10).length <= 1; // Didn't overspend on multiple things
    
    if (goodChoices >= 2) points += 10; // Made good choices
    if (spentWisely) points += 8; // Didn't blow all savings
    if (keptFriendships) points += 5; // Maintained relationships
    if (planned) points += 5; // Showed restraint
    if (remainingSavings >= 10) points += 7; // Kept emergency fund
    
    if (points >= 40) {
      badge = 'Emergency Expert';
    } else if (points >= 35) {
      badge = 'Crisis Manager';
    } else if (points >= 30) {
      badge = 'Problem Solver';
    }
    
    onComplete({ coins: Math.min(35, points), badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-red-800">⚡ Surprise Expenses!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🚨</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-red-700">Uh Oh! Life Happens!</h3>
              <p className="text-lg text-gray-600">
                You've been saving your money carefully, but today brought some unexpected problems. 
                Sometimes life throws surprises at us, and we need to decide how to handle them!
              </p>
              
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-blue-800">Your Emergency Savings</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{savings} coins</div>
                <div className="text-sm text-blue-600">Money you've saved for unexpected situations</div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-yellow-800">The Challenge</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  You'll face 3 surprise situations that need your attention. 
                  Each one requires a decision about how to spend (or not spend) your money!
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3"
          >
            I'm ready for anything! →
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
            <h2 className="text-3xl font-bold text-blue-800">🧠 Handling Surprise Expenses</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-blue-700">Smart Emergency Thinking</h3>
              <p className="text-gray-600 mt-2">
                When unexpected expenses happen, smart people ask these questions before deciding what to do:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-green-800">How Urgent Is It?</h4>
                  <div className="text-green-700 text-sm mt-2 space-y-1">
                    <div>🔴 <strong>Emergency:</strong> Must fix right now</div>
                    <div>🟡 <strong>Important:</strong> Should fix soon</div>
                    <div>🟢 <strong>Can Wait:</strong> Nice to fix but not urgent</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                <div className="text-center">
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-bold text-purple-800">What Are My Options?</h4>
                  <div className="text-purple-700 text-sm mt-2 space-y-1">
                    <div>💰 <strong>Spend money:</strong> Quick but costs savings</div>
                    <div>🛠️ <strong>DIY solution:</strong> Cheaper but takes effort</div>
                    <div>🤝 <strong>Ask for help:</strong> Free but you owe a favor</div>
                    <div>⏳ <strong>Wait/delay:</strong> Free but problem continues</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎯 Smart Emergency Rules</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                <div>• 🔍 <strong>Stop and think</strong> before spending - don't panic!</div>
                <div>• 💭 <strong>Consider all options</strong> - there's usually more than one way to solve a problem</div>
                <div>• ⚖️ <strong>Balance cost vs. outcome</strong> - sometimes the cheapest option isn't the best</div>
                <div>• 🏦 <strong>Keep some savings</strong> - don't spend everything on one problem</div>
                <div>• 💝 <strong>Think about relationships</strong> - some things affect friendships and family</div>
              </div>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
              <h4 className="font-bold text-red-800 mb-2">⚡ Remember</h4>
              <p className="text-red-700 text-sm">
                Every choice has consequences - not just money consequences, but also time, relationships, 
                and how you feel about yourself. Think about the whole picture!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('scenario1')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Bring on the first surprise! 💪
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep.startsWith('scenario')) {
    const scenario = scenarios[currentScenario];
    const options = getOptionsForScenario(currentScenario);
    
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-orange-800">
              {scenario.emoji} Surprise #{currentScenario + 1}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Current Money Status */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-bold">Emergency Savings Left:</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">{remainingSavings} coins</span>
                <span className="text-sm text-gray-600">
                  (Started with {savings}, spent {moneySpent} so far)
                </span>
              </div>
            </div>
          </div>
          
          {/* Scenario Description */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-orange-200">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{scenario.emoji}</div>
              <h3 className="text-2xl font-bold text-orange-700">{scenario.title}</h3>
              <p className="text-gray-600 text-sm">{scenario.description}</p>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-bold text-red-800">The Problem:</span>
              </div>
              <p className="text-red-700">{scenario.problem}</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge 
                variant="outline" 
                className={`${
                  scenario.urgency === 'high' ? 'border-red-400 text-red-700' :
                  scenario.urgency === 'medium' ? 'border-yellow-400 text-yellow-700' :
                  'border-green-400 text-green-700'
                }`}
              >
                {scenario.urgency === 'high' ? '🔴 High Urgency' :
                 scenario.urgency === 'medium' ? '🟡 Medium Urgency' :
                 '🟢 Low Urgency'}
              </Badge>
            </div>
          </div>
          
          {/* Options */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-orange-200">
            <h4 className="font-bold text-orange-800 mb-4 text-center">
              🤔 What's your solution?
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              {options.map((option) => {
                const canAfford = option.cost <= remainingSavings;
                
                const outcomeColor = option.outcome === 'good' ? 'border-green-300 bg-green-50' :
                                   option.outcome === 'okay' ? 'border-yellow-300 bg-yellow-50' :
                                   'border-red-300 bg-red-50';
                
                const outcomeIcon = option.outcome === 'good' ? '😊' :
                                   option.outcome === 'okay' ? '😐' : '😔';
                
                return (
                  <Card 
                    key={option.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      canAfford || option.cost === 0
                        ? `hover:shadow-lg hover:scale-105 ${outcomeColor}` 
                        : 'bg-gray-100 border-gray-300 opacity-60'
                    }`}
                    onClick={() => (canAfford || option.cost === 0) && handleChoiceSelect(option)}
                  >
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{option.emoji}</div>
                        <h5 className="font-bold">{option.title}</h5>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">
                              {option.cost === 0 ? 'FREE' : `${option.cost} coins`}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {outcomeIcon} {option.outcome.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          ⏰ {option.timeFrame}
                        </div>
                        
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          <strong>Result:</strong> {option.consequences}
                        </div>
                      </div>
                      
                      {!(canAfford || option.cost === 0) && (
                        <Badge variant="destructive" className="text-xs w-full justify-center">
                          Can't afford this option
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="bg-blue-100 p-3 rounded-lg border-2 border-blue-200">
            <p className="text-blue-800 text-center text-sm">
              💭 <strong>Think carefully!</strong> Each choice has different costs and consequences. 
              What matters most to you in this situation?
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'reflection') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🤔 Looking Back</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Emergency Decisions</h3>
              
              {/* Money Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                  <Shield className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-blue-800">{savings}</div>
                  <div className="text-xs text-blue-600">Started With</div>
                </div>
                
                <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                  <Coins className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <div className="font-bold text-red-800">{moneySpent}</div>
                  <div className="text-xs text-red-600">Total Spent</div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                  <Heart className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-green-800">{remainingSavings}</div>
                  <div className="text-xs text-green-600">Still Have</div>
                </div>
              </div>
            </div>
            
            {/* Decision Review */}
            <div className="space-y-4">
              {scenarios.map((scenario, index) => {
                const choice = scenarioChoices[index];
                if (!choice) return null;
                
                const outcomeColor = choice.outcome === 'good' ? 'bg-green-100 border-green-200' :
                                   choice.outcome === 'okay' ? 'bg-yellow-100 border-yellow-200' :
                                   'bg-red-100 border-red-200';
                
                return (
                  <div key={index} className={`p-4 rounded-lg border-2 ${outcomeColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">
                        {scenario.emoji} {scenario.title}
                      </span>
                      <Badge variant="outline">
                        {choice.cost === 0 ? 'FREE' : `${choice.cost} coins`}
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <div><strong>You chose:</strong> {choice.title}</div>
                      <div className="text-gray-600 mt-1">{choice.consequences}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Analysis */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📊 Quick Analysis:</h4>
              <div className="text-blue-700 text-sm space-y-1">
                {remainingSavings >= 15 && (
                  <div>✨ Great! You kept most of your emergency fund for future surprises.</div>
                )}
                {Object.values(scenarioChoices).filter(c => c.outcome === 'good').length >= 2 && (
                  <div>🎯 Excellent choices! You found good solutions to most problems.</div>
                )}
                {Object.values(scenarioChoices).some(c => c.cost === 0) && (
                  <div>💡 Smart thinking! You found at least one free solution.</div>
                )}
                {scenarioChoices[1]?.outcome !== 'bad' && (
                  <div>💝 You maintained your friendships - relationships matter!</div>
                )}
                {moneySpent <= savings * 0.5 && (
                  <div>🏦 Wow! You solved problems while keeping most of your savings.</div>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            See final results! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    const goodChoices = Object.values(scenarioChoices).filter(c => c.outcome === 'good').length;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🏆 Emergency Expert!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Crisis Management Complete!</h3>
            
            {/* Final Results */}
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {goodChoices >= 2 ? '🌟' : goodChoices >= 1 ? '👍' : '📚'}
                </div>
                <div className="font-bold text-lg">
                  {goodChoices >= 2 ? 'EXCELLENT!' : goodChoices >= 1 ? 'GOOD JOB!' : 'LEARNING!'}
                </div>
                <p className="text-sm text-gray-600">Decision quality</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">{remainingSavings}</div>
                <p className="text-sm text-gray-600">Savings left</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold text-lg">Crisis Skills</div>
                <p className="text-sm text-gray-600">Developed!</p>
              </div>
            </div>
            
            {/* Lessons Learned */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎓 What You Learned:</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                <div>• ⚡ Surprise expenses are normal - everyone faces them!</div>
                <div>• 🧠 Taking time to think prevents panic spending</div>
                <div>• 💡 There are usually multiple ways to solve a problem</div>
                <div>• ⚖️ Sometimes the cheapest option isn't the best option</div>
                <div>• 🏦 Keeping some emergency savings is always smart</div>
                <div>• 💝 Consider how your choices affect relationships</div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-blue-800">
                <strong>⚡ Emergency Tip:</strong> Life will always have surprises, but having an emergency fund 
                and thinking through your options helps you handle anything that comes your way!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🚨
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default SurpriseExpenseQuest;