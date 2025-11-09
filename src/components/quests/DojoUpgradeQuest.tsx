import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Building, Coins, Users, Sparkles, Target, X, CheckCircle, AlertTriangle, Star, Heart } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'essential' | 'comfort' | 'fun' | 'luxury';
  impact: 'low' | 'medium' | 'high';
  beneficiaries: string[];
  emoji: string;
  benefits: string[];
  priority: number; // 1-10 where 10 is highest priority
}

interface UpgradeChoice {
  upgrade: Upgrade;
  reason: string;
}

const DojoUpgradeQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'planning' | 'voting' | 'allocation' | 'reflection' | 'result'>('intro');
  const [budget] = useState(100);
  const [selectedUpgrades, setSelectedUpgrades] = useState<UpgradeChoice[]>([]);
  const [studentVotes, setStudentVotes] = useState<{[key: string]: number}>({});
  const [priorities, setPriorities] = useState<{[key: string]: number}>({});

  const availableUpgrades: Upgrade[] = [
    // ESSENTIAL (High Priority)
    {
      id: 'safety-equipment',
      name: 'Safety Equipment Update',
      description: 'New first aid kit, fire extinguisher, and emergency supplies',
      cost: 25,
      category: 'essential',
      impact: 'high',
      beneficiaries: ['All students', 'Teachers', 'Staff'],
      emoji: '🚨',
      benefits: ['Everyone stays safe', 'Required by school regulations', 'Peace of mind for parents'],
      priority: 10
    },
    {
      id: 'broken-desks',
      name: 'Fix Broken Desks',
      description: 'Repair 8 desks with wobbly legs and broken drawers',
      cost: 20,
      category: 'essential',
      impact: 'high',
      beneficiaries: ['All students'],
      emoji: '🪑',
      benefits: ['Everyone can work comfortably', 'No more falling books', 'Professional learning environment'],
      priority: 9
    },
    
    // COMFORT (Medium-High Priority)
    {
      id: 'better-lighting',
      name: 'Better Classroom Lighting',
      description: 'Replace dim fluorescent bulbs with bright, comfortable LED lights',
      cost: 30,
      category: 'comfort',
      impact: 'medium',
      beneficiaries: ['All students', 'Teachers'],
      emoji: '💡',
      benefits: ['Less eye strain', 'Better focus on work', 'More cheerful atmosphere'],
      priority: 8
    },
    {
      id: 'reading-corner',
      name: 'Cozy Reading Corner',
      description: 'Soft cushions, bean bags, and a small bookshelf for quiet reading',
      cost: 35,
      category: 'comfort',
      impact: 'medium',
      beneficiaries: ['Students who love reading', 'Quiet students'],
      emoji: '📚',
      benefits: ['Encourages reading', 'Quiet space to relax', 'Helps shy students feel comfortable'],
      priority: 7
    },
    
    // FUN (Medium Priority)
    {
      id: 'art-supplies',
      name: 'Premium Art Supplies',
      description: 'High-quality paints, brushes, colored pencils, and craft materials',
      cost: 40,
      category: 'fun',
      impact: 'medium',
      beneficiaries: ['Creative students', 'Art lovers'],
      emoji: '🎨',
      benefits: ['Better art projects', 'Express creativity', 'Beautiful classroom decorations'],
      priority: 6
    },
    {
      id: 'game-station',
      name: 'Educational Game Station',
      description: 'Board games, puzzles, and brain teasers for learning breaks',
      cost: 25,
      category: 'fun',
      impact: 'medium',
      beneficiaries: ['All students'],
      emoji: '🎲',
      benefits: ['Fun learning activities', 'Social interaction', 'Problem-solving skills'],
      priority: 5
    },
    {
      id: 'class-pet',
      name: 'Class Pet Setup',
      description: 'Aquarium with fish, or small terrarium with plants',
      cost: 45,
      category: 'fun',
      impact: 'low',
      beneficiaries: ['Animal lovers', 'Responsible students'],
      emoji: '🐠',
      benefits: ['Learn about responsibility', 'Calming presence', 'Science learning opportunities'],
      priority: 4
    },
    
    // LUXURY (Low Priority)
    {
      id: 'fancy-decorations',
      name: 'Fancy Decorations',
      description: 'Expensive posters, premium wall decals, and decorative items',
      cost: 50,
      category: 'luxury',
      impact: 'low',
      beneficiaries: ['Students who care about aesthetics'],
      emoji: '✨',
      benefits: ['Prettier classroom', 'Instagram-worthy photos', 'Shows school pride'],
      priority: 3
    },
    {
      id: 'mini-fridge',
      name: 'Mini Refrigerator',
      description: 'Small fridge for storing snacks and drinks',
      cost: 60,
      category: 'luxury',
      impact: 'low',
      beneficiaries: ['Students who bring lunch', 'Teachers'],
      emoji: '❄️',
      benefits: ['Cold drinks in summer', 'Fresh snacks', 'Convenience for everyone'],
      priority: 2
    },
    {
      id: 'smart-board',
      name: 'Smart Board Upgrade',
      description: 'Latest interactive smart board with touch capabilities',
      cost: 80,
      category: 'luxury',
      impact: 'medium',
      beneficiaries: ['All students', 'Teachers'],
      emoji: '📱',
      benefits: ['Cool technology', 'Interactive lessons', 'Impressive for school visits'],
      priority: 1
    }
  ];

  const generateStudentVotes = () => {
    const votes: {[key: string]: number} = {};
    availableUpgrades.forEach(upgrade => {
      // Simulate realistic voting patterns
      let baseVotes = 0;
      if (upgrade.category === 'essential') baseVotes = Math.floor(Math.random() * 5) + 18; // 18-22 votes
      else if (upgrade.category === 'comfort') baseVotes = Math.floor(Math.random() * 6) + 12; // 12-17 votes  
      else if (upgrade.category === 'fun') baseVotes = Math.floor(Math.random() * 8) + 8; // 8-15 votes
      else baseVotes = Math.floor(Math.random() * 6) + 2; // 2-7 votes (luxury items)
      
      votes[upgrade.id] = baseVotes;
    });
    setStudentVotes(votes);
  };

  const handleUpgradeToggle = (upgrade: Upgrade, reason: string = '') => {
    const isSelected = selectedUpgrades.some(choice => choice.upgrade.id === upgrade.id);
    
    if (isSelected) {
      setSelectedUpgrades(selectedUpgrades.filter(choice => choice.upgrade.id !== upgrade.id));
    } else {
      const currentTotal = selectedUpgrades.reduce((sum, choice) => sum + choice.upgrade.cost, 0);
      if (currentTotal + upgrade.cost <= budget) {
        setSelectedUpgrades([...selectedUpgrades, { upgrade, reason }]);
      }
    }
  };

  const totalSpent = selectedUpgrades.reduce((sum, choice) => sum + choice.upgrade.cost, 0);
  const remainingBudget = budget - totalSpent;

  const completeQuest = () => {
    let points = 25; // Base points
    let badge = 'Classroom Helper';
    
    // Analyze budget allocation decisions
    const essentialCount = selectedUpgrades.filter(c => c.upgrade.category === 'essential').length;
    const luxuryCount = selectedUpgrades.filter(c => c.upgrade.category === 'luxury').length;
    const totalImpactScore = selectedUpgrades.reduce((sum, choice) => {
      return sum + (choice.upgrade.impact === 'high' ? 3 : choice.upgrade.impact === 'medium' ? 2 : 1);
    }, 0);
    const avgPriority = selectedUpgrades.reduce((sum, choice) => sum + choice.upgrade.priority, 0) / selectedUpgrades.length;
    const usedMostOfBudget = totalSpent >= budget * 0.8;
    const balancedChoices = essentialCount >= 1 && selectedUpgrades.length >= 3;
    
    if (essentialCount >= 1) points += 10; // Prioritized safety/necessities
    if (totalImpactScore >= 8) points += 8; // High impact choices
    if (avgPriority >= 6) points += 6; // Good priority selection
    if (usedMostOfBudget) points += 5; // Used budget efficiently
    if (balancedChoices) points += 5; // Made multiple thoughtful choices
    if (luxuryCount === 0) points += 4; // Avoided unnecessary luxury items
    
    if (points >= 45) {
      badge = 'Budget Master';
    } else if (points >= 38) {
      badge = 'Smart Allocator';
    } else if (points >= 32) {
      badge = 'Thoughtful Planner';
    }
    
    onComplete({ coins: Math.min(40, points), badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-indigo-800">🏛️ Dojo Upgrade Challenge!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🏗️</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-indigo-700">Your Classroom Needs You!</h3>
              <p className="text-lg text-gray-600">
                Great news! The school has given your class a special budget to make improvements to your learning space. 
                But here's the challenge - there are lots of things that could be upgraded, and you have to choose wisely!
              </p>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-green-800">Classroom Improvement Budget</span>
                </div>
                <div className="text-2xl font-bold text-green-700">100 coins</div>
                <div className="text-sm text-green-600">Use it wisely to improve your learning environment!</div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-blue-800">Your Mission</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Work with your classmates to decide which upgrades will benefit everyone the most. 
                  You'll need to balance needs vs. wants, and make sure the most important things get funded first!
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3"
          >
            Let's plan our classroom upgrade! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'learning') {
    return (
      <Card className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">📋 Budget Allocation Basics</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-blue-700">Smart Budget Allocation</h3>
              <p className="text-gray-600 mt-2">
                When you have limited money and many choices, you need a strategy to make the best decisions for everyone!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-bold text-red-800">ESSENTIAL NEEDS 🚨</h4>
                  <div className="text-red-700 text-sm mt-2 space-y-1">
                    <div>🚨 <strong>Safety first:</strong> Things that keep people safe</div>
                    <div>📚 <strong>Learning basics:</strong> Items needed for education</div>
                    <div>🔧 <strong>Repairs:</strong> Fixing broken things that affect everyone</div>
                    <div className="font-bold text-red-800 mt-2">These should ALWAYS come first!</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-bold text-yellow-800">COMFORT IMPROVEMENTS 😌</h4>
                  <div className="text-yellow-700 text-sm mt-2 space-y-1">
                    <div>💡 <strong>Better environment:</strong> More comfortable learning</div>
                    <div>📖 <strong>Study spaces:</strong> Places to focus and relax</div>
                    <div>🌡️ <strong>Climate comfort:</strong> Temperature and lighting</div>
                    <div className="font-bold text-yellow-800 mt-2">Important but not urgent</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-green-800">FUN ADDITIONS 🎉</h4>
                  <div className="text-green-700 text-sm mt-2 space-y-1">
                    <div>🎮 <strong>Entertainment:</strong> Games and fun activities</div>
                    <div>🎨 <strong>Creative supplies:</strong> Art and craft materials</div>
                    <div>🐠 <strong>Special projects:</strong> Pets, plants, decorations</div>
                    <div className="font-bold text-green-800 mt-2">Nice to have, but optional</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                <div className="text-center">
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-bold text-purple-800">LUXURY ITEMS 💎</h4>
                  <div className="text-purple-700 text-sm mt-2 space-y-1">
                    <div>✨ <strong>Premium upgrades:</strong> Expensive but not necessary</div>
                    <div>📱 <strong>Latest technology:</strong> Cool but costly</div>
                    <div>🏆 <strong>Show-off items:</strong> Impressive but low priority</div>
                    <div className="font-bold text-purple-800 mt-2">Only if budget allows</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Smart Allocation Strategy</h4>
              <div className="text-blue-700 text-sm space-y-1">
                <div>• 🥇 <strong>Priority 1:</strong> Fund all essential safety and learning needs first</div>
                <div>• 🥈 <strong>Priority 2:</strong> Choose comfort improvements that help the most students</div>
                <div>• 🥉 <strong>Priority 3:</strong> Add fun items if budget allows</div>
                <div>• 💎 <strong>Priority 4:</strong> Consider luxury items only after everything else</div>
                <div>• 👥 <strong>Always ask:</strong> "Who benefits from this and how much?"</div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              generateStudentVotes();
              setCurrentStep('voting');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            See what your classmates want! 🗳️
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'voting') {
    const sortedByVotes = [...availableUpgrades].sort((a, b) => (studentVotes[b.id] || 0) - (studentVotes[a.id] || 0));
    
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🗳️ Class Voting Results</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-green-700">Your Classmates Have Spoken!</h3>
              <p className="text-gray-600 mt-2">
                Here's how your 25 classmates voted on different classroom upgrades. 
                But remember - popularity isn't everything! You still need to think about priorities and budget.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-bold text-green-800">📋 Vote Count (Most to Least Popular):</h4>
              {sortedByVotes.map((upgrade, index) => {
                const votes = studentVotes[upgrade.id] || 0;
                const percentage = Math.round((votes / 25) * 100);
                
                const categoryColor = upgrade.category === 'essential' ? 'border-red-300 bg-red-50' :
                                    upgrade.category === 'comfort' ? 'border-yellow-300 bg-yellow-50' :
                                    upgrade.category === 'fun' ? 'border-green-300 bg-green-50' :
                                    'border-purple-300 bg-purple-50';
                
                return (
                  <div key={upgrade.id} className={`p-4 rounded-lg border-2 ${categoryColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{upgrade.emoji}</span>
                        <span className="font-bold">{upgrade.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {upgrade.category.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{votes}/25 votes</div>
                        <div className="text-sm text-gray-600">({percentage}% of class)</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{upgrade.description}</span>
                      <Badge variant="outline">${upgrade.cost}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-2">🤔 What Do You Notice?</h4>
                <div className="text-yellow-700 text-sm space-y-1">
                  <div>• Do the most popular items match the most important needs?</div>
                  <div>• Are students voting with their hearts or their heads?</div>
                  <div>• Which items would help the most people?</div>
                </div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">💭 Your Job as Budget Manager</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <div>• Balance popular choices with practical needs</div>
                  <div>• Make sure safety and essential items are covered</div>
                  <div>• Use the budget to help the most students possible</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('allocation')}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
          >
            Now I'll allocate the budget! 💰
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'allocation') {
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">💰 Budget Allocation Time!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Budget Status */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Budget Management</span>
              <span className="text-sm text-gray-600">Choose wisely!</span>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span className="font-bold">{budget}</span>
                </div>
                <p className="text-xs text-gray-600">Total Budget</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="font-bold">{totalSpent}</span>
                </div>
                <p className="text-xs text-gray-600">Currently Allocated</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-green-500" />
                  <span className="font-bold">{remainingBudget}</span>
                </div>
                <p className="text-xs text-gray-600">Remaining</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Building className="h-4 w-4 text-purple-500" />
                  <span className="font-bold">{selectedUpgrades.length}</span>
                </div>
                <p className="text-xs text-gray-600">Items Selected</p>
              </div>
            </div>
          </div>
          
          {/* Selected Items */}
          {selectedUpgrades.length > 0 && (
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">🛒 Your Allocation Plan:</h3>
              <div className="space-y-2">
                {selectedUpgrades.map((choice) => (
                  <div key={choice.upgrade.id} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{choice.upgrade.emoji}</span>
                      <span className="font-medium">{choice.upgrade.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">${choice.upgrade.cost}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleUpgradeToggle(choice.upgrade)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Available Upgrades */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-200">
            <h3 className="font-bold text-purple-800 mb-4">🏗️ Available Classroom Upgrades</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableUpgrades.map((upgrade) => {
                const isSelected = selectedUpgrades.some(choice => choice.upgrade.id === upgrade.id);
                const canAfford = upgrade.cost <= remainingBudget;
                const votes = studentVotes[upgrade.id] || 0;
                
                const categoryColor = upgrade.category === 'essential' ? 'border-red-300 bg-red-50' :
                                    upgrade.category === 'comfort' ? 'border-yellow-300 bg-yellow-50' :
                                    upgrade.category === 'fun' ? 'border-green-300 bg-green-50' :
                                    'border-purple-300 bg-purple-50';
                
                const impactIcon = upgrade.impact === 'high' ? '🔥' :
                                 upgrade.impact === 'medium' ? '⭐' : '💫';
                
                return (
                  <Card 
                    key={upgrade.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'ring-2 ring-blue-400 bg-blue-100 border-blue-400' 
                        : canAfford || isSelected
                          ? `hover:shadow-lg hover:scale-105 ${categoryColor}` 
                          : 'bg-gray-100 border-gray-300 opacity-60'
                    }`}
                    onClick={() => (canAfford || isSelected) && handleUpgradeToggle(upgrade)}
                  >
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{upgrade.emoji}</div>
                        <h4 className="font-bold text-sm">{upgrade.name}</h4>
                        <p className="text-xs text-gray-600">{upgrade.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              upgrade.category === 'essential' ? 'border-red-400 text-red-700' :
                              upgrade.category === 'comfort' ? 'border-yellow-400 text-yellow-700' :
                              upgrade.category === 'fun' ? 'border-green-400 text-green-700' :
                              'border-purple-400 text-purple-700'
                            }`}
                          >
                            {upgrade.category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {impactIcon} {upgrade.impact} impact
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-bold">${upgrade.cost}</span>
                          </div>
                          <div className="text-xs text-gray-500">{votes}/25 votes</div>
                        </div>
                        
                        <div className="text-xs">
                          <div className="font-bold text-gray-700">Benefits:</div>
                          <div className="text-gray-600">{upgrade.benefits[0]}</div>
                        </div>
                      </div>
                      
                      {!(canAfford || isSelected) && (
                        <Badge variant="destructive" className="text-xs w-full justify-center">
                          Can't afford
                        </Badge>
                      )}
                      
                      {isSelected && (
                        <Badge variant="default" className="text-xs w-full justify-center bg-blue-500">
                          ✓ Selected
                        </Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center text-sm">
              💭 <strong>Think strategically!</strong> Cover essential needs first, then balance popular choices 
              with items that help the most students. You don't have to spend every penny!
            </p>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('reflection')}
            disabled={selectedUpgrades.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            Finalize Budget Plan →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'reflection') {
    const essentialCount = selectedUpgrades.filter(c => c.upgrade.category === 'essential').length;
    const luxuryCount = selectedUpgrades.filter(c => c.upgrade.category === 'luxury').length;
    const totalBeneficiaries = new Set(selectedUpgrades.flatMap(c => c.upgrade.beneficiaries)).size;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-800">📊 Budget Plan Review</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Your Classroom Budget Allocation</h3>
              
              {/* Budget Summary Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                  <Coins className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-green-800">${totalSpent}</div>
                  <div className="text-xs text-green-600">Total Allocated</div>
                </div>
                
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                  <Building className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-blue-800">{selectedUpgrades.length}</div>
                  <div className="text-xs text-blue-600">Items Funded</div>
                </div>
                
                <div className="bg-purple-100 p-3 rounded-lg border border-purple-200">
                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                  <div className="font-bold text-purple-800">{essentialCount}</div>
                  <div className="text-xs text-purple-600">Essential Items</div>
                </div>
                
                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                  <Heart className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="font-bold text-yellow-800">{remainingBudget}</div>
                  <div className="text-xs text-yellow-600">Money Saved</div>
                </div>
              </div>
            </div>
            
            {/* Allocation Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-blue-800">💰 Your Budget Decisions:</h4>
              {selectedUpgrades.map((choice, index) => {
                const votes = studentVotes[choice.upgrade.id] || 0;
                const popularity = votes > 15 ? '🔥 Very Popular' : votes > 10 ? '👍 Popular' : '💭 Less Popular';
                
                return (
                  <div key={choice.upgrade.id} className="bg-gray-100 p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{choice.upgrade.emoji}</span>
                        <span className="font-bold">{choice.upgrade.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {choice.upgrade.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${choice.upgrade.cost}</div>
                        <div className="text-xs text-gray-600">{popularity}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div><strong>Impact:</strong> {choice.upgrade.impact} - {choice.upgrade.benefits[0]}</div>
                      <div><strong>Helps:</strong> {choice.upgrade.beneficiaries.join(', ')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Analysis */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎯 Allocation Analysis:</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                {essentialCount >= 1 && (
                  <div>✅ Great! You prioritized essential safety and learning needs.</div>
                )}
                {essentialCount === 0 && (
                  <div>⚠️ Consider: Did you address all essential needs first?</div>
                )}
                {luxuryCount === 0 && totalSpent <= budget * 0.9 && (
                  <div>💡 Smart spending! You avoided luxury items and used budget wisely.</div>
                )}
                {selectedUpgrades.length >= 3 && (
                  <div>🎯 Good balance! You funded multiple improvements for different needs.</div>
                )}
                {remainingBudget >= 10 && (
                  <div>🏦 Excellent restraint! Saving some budget shows good financial planning.</div>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Present my budget plan! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    const essentialCount = selectedUpgrades.filter(c => c.upgrade.category === 'essential').length;
    const budgetEfficiency = Math.round((totalSpent / budget) * 100);
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🏆 Budget Plan Complete!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Classroom Upgrade Plan Approved!</h3>
            
            {/* Final Results */}
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {essentialCount >= 1 ? '🌟' : budgetEfficiency >= 80 ? '👍' : '📚'}
                </div>
                <div className="font-bold text-lg">
                  {essentialCount >= 1 ? 'EXCELLENT!' : budgetEfficiency >= 80 ? 'GOOD WORK!' : 'LEARNING!'}
                </div>
                <p className="text-sm text-gray-600">Budget management</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">${totalSpent}</div>
                <p className="text-sm text-gray-600">Invested in classroom</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🏛️</div>
                <div className="font-bold text-lg">{selectedUpgrades.length} Items</div>
                <p className="text-sm text-gray-600">Improvements funded</p>
              </div>
            </div>
            
            {/* Impact Summary */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Your Plan's Impact:</h4>
              <div className="text-blue-700 text-sm space-y-1">
                {essentialCount >= 1 && (
                  <div>✨ You ensured everyone's safety and basic learning needs are met!</div>
                )}
                {selectedUpgrades.filter(c => c.upgrade.impact === 'high').length >= 1 && (
                  <div>🎯 Your choices will make a big difference for students and teachers!</div>
                )}
                {remainingBudget >= 10 && (
                  <div>🏦 Smart budgeting - you kept some funds for future unexpected needs!</div>
                )}
                {selectedUpgrades.length >= 3 && (
                  <div>⚖️ Great balance - you addressed multiple areas of classroom improvement!</div>
                )}
              </div>
            </div>
            
            {/* Lessons Learned */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎓 Budget Allocation Lessons:</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                <div>• 🚨 Safety and essential needs should always come first</div>
                <div>• 👥 Consider who benefits most from each decision</div>
                <div>• 💡 Popular choices aren't always the most practical choices</div>
                <div>• ⚖️ Balance immediate wants with long-term benefits</div>
                <div>• 🏦 It's okay to save some budget for future needs</div>
                <div>• 🤝 Good leaders consider everyone's needs, not just their own</div>
              </div>
            </div>
            
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
              <p className="text-green-800">
                <strong>🏛️ Leadership Tip:</strong> Great budget managers think about impact, fairness, and sustainability. 
                You've learned skills that will help you make smart money decisions for life!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🏛️
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default DojoUpgradeQuest;