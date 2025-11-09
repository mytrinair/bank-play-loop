import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ShoppingCart, Coins, Star, Search, Zap, X, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface QuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quality: 'low' | 'medium' | 'high';
  durability: 'poor' | 'good' | 'excellent';
  features: string[];
  brand: string;
  emoji: string;
  description: string;
  pros: string[];
  cons: string[];
  valueScore?: number;
}

interface ShoppingScenario {
  id: string;
  title: string;
  description: string;
  budget: number;
  products: Product[];
  category: string;
  emoji: string;
}

const SmartShopperQuest: React.FC<QuestProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'learning' | 'scenario1' | 'scenario2' | 'scenario3' | 'reflection' | 'result'>('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scenarioChoices, setScenarioChoices] = useState<{[key: number]: Product}>({});
  const [totalSpent, setTotalSpent] = useState(0);

  const scenarios: ShoppingScenario[] = [
    {
      id: 'backpack',
      title: 'School Backpack Shopping',
      description: 'You need a new backpack for the school year',
      budget: 25,
      category: 'School Supplies',
      emoji: '🎒',
      products: [
        {
          id: 'cheap-pack',
          name: 'Basic Backpack',
          price: 8,
          quality: 'low',
          durability: 'poor',
          features: ['One main compartment', 'Thin straps'],
          brand: 'Budget Brand',
          emoji: '🎒',
          description: 'Simple, no-frills backpack',
          pros: ['Very cheap', 'Lightweight'],
          cons: ['Might break after a few months', 'Not comfortable for heavy books', 'No organization pockets'],
          valueScore: 2
        },
        {
          id: 'mid-pack',
          name: 'Standard School Pack',
          price: 18,
          quality: 'medium',
          durability: 'good',
          features: ['Multiple compartments', 'Padded straps', 'Water bottle holder'],
          brand: 'SchoolGear',
          emoji: '🎒',
          description: 'Good quality backpack with useful features',
          pros: ['Comfortable to wear', 'Good organization', 'Should last the school year'],
          cons: ['More expensive', 'Heavier when empty'],
          valueScore: 4
        },
        {
          id: 'premium-pack',
          name: 'Ultimate Student Pack',
          price: 30,
          quality: 'high',
          durability: 'excellent',
          features: ['Laptop compartment', 'Ergonomic design', 'Lifetime warranty', 'Anti-theft zippers'],
          brand: 'PremiumGear',
          emoji: '🎒',
          description: 'Top-of-the-line backpack with all features',
          pros: ['Will last for years', 'Perfect organization', 'Very comfortable'],
          cons: ['Over budget!', 'Might be overkill for elementary school'],
          valueScore: 3
        }
      ]
    },
    {
      id: 'shoes',
      title: 'Sports Shoes',
      description: 'You need new shoes for gym class and sports',
      budget: 35,
      category: 'Athletic Wear',
      emoji: '👟',
      products: [
        {
          id: 'discount-shoes',
          name: 'Generic Sport Shoes',
          price: 15,
          quality: 'low',
          durability: 'poor',
          features: ['Basic cushioning', 'Synthetic materials'],
          brand: 'No-Name',
          emoji: '👟',
          description: 'Cheap athletic shoes from discount store',
          pros: ['Very affordable', 'Available immediately'],
          cons: ['Uncomfortable for running', 'Poor support', 'Will wear out quickly'],
          valueScore: 2
        },
        {
          id: 'brand-shoes',
          name: 'Name Brand Athletic',
          price: 28,
          quality: 'medium',
          durability: 'good',
          features: ['Good cushioning', 'Arch support', 'Breathable fabric'],
          brand: 'SportsCorp',
          emoji: '👟',
          description: 'Popular brand with decent quality',
          pros: ['Good comfort and support', 'Stylish design', 'Good for most sports'],
          cons: ['Still pricey', 'Might not last more than a year'],
          valueScore: 4
        },
        {
          id: 'used-premium',
          name: 'Used Premium Shoes',
          price: 22,
          quality: 'high',
          durability: 'good',
          features: ['Professional athlete grade', 'Advanced cushioning', 'Some wear on soles'],
          brand: 'EliteFootwear',
          emoji: '👟',
          description: 'High-end shoes bought second-hand',
          pros: ['Premium quality at lower price', 'Still lots of life left', 'Excellent performance'],
          cons: ['Pre-owned', 'Limited size selection', 'Can\'t return if they don\'t fit well'],
          valueScore: 5
        }
      ]
    },
    {
      id: 'tablet',
      title: 'Learning Tablet',
      description: 'You want a tablet for educational games and reading',
      budget: 60,
      category: 'Electronics',
      emoji: '📱',
      products: [
        {
          id: 'basic-tablet',
          name: 'Basic Kids Tablet',
          price: 40,
          quality: 'low',
          durability: 'poor',
          features: ['Small screen', 'Limited apps', 'Parental controls'],
          brand: 'KidTech',
          emoji: '📱',
          description: 'Simple tablet designed for young children',
          pros: ['Kid-friendly interface', 'Protective case included', 'Under budget'],
          cons: ['Very slow performance', 'Poor screen quality', 'Limited educational content'],
          valueScore: 2
        },
        {
          id: 'refurb-tablet',
          name: 'Refurbished Standard Tablet',
          price: 55,
          quality: 'medium',
          durability: 'good',
          features: ['Full-size screen', 'Access to app store', 'Good performance', 'Minor cosmetic flaws'],
          brand: 'TechCorp',
          emoji: '📱',
          description: 'Previously owned tablet restored to working condition',
          pros: ['Great performance for the price', 'Access to thousands of educational apps', 'Good screen size'],
          cons: ['Might have small scratches', 'Shorter warranty', 'Battery might not be at 100%'],
          valueScore: 5
        },
        {
          id: 'new-tablet',
          name: 'Brand New Tablet',
          price: 80,
          quality: 'high',
          durability: 'excellent',
          features: ['Latest processor', 'Crystal clear display', 'Long battery life', '2-year warranty'],
          brand: 'TechCorp',
          emoji: '📱',
          description: 'Latest model tablet with all features',
          pros: ['Perfect condition', 'Latest features', 'Full warranty'],
          cons: ['Over budget by $20', 'Many features might be unnecessary for your needs'],
          valueScore: 3
        }
      ]
    }
  ];

  // Calculate value scores for products
  scenarios.forEach(scenario => {
    scenario.products.forEach(product => {
      // Value score based on quality vs price ratio and other factors
      const qualityScore = product.quality === 'high' ? 3 : product.quality === 'medium' ? 2 : 1;
      const durabilityScore = product.durability === 'excellent' ? 3 : product.durability === 'good' ? 2 : 1;
      const priceScore = product.price <= scenario.budget * 0.6 ? 3 : 
                        product.price <= scenario.budget * 0.8 ? 2 : 1;
      
      product.valueScore = Math.round((qualityScore + durabilityScore + priceScore) / 3 * 2); // Scale to 1-6
    });
  });

  const handleProductSelect = (product: Product) => {
    setScenarioChoices({...scenarioChoices, [currentScenario]: product});
    setTotalSpent(totalSpent + product.price);
    
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

  const completeQuest = () => {
    let points = 25; // Base points
    let badge = 'Smart Shopper';
    
    // Analyze shopping decisions
    const choices = Object.values(scenarioChoices);
    const averageValueScore = choices.reduce((sum, choice) => sum + (choice.valueScore || 0), 0) / choices.length;
    const stayedInBudget = choices.every((choice, index) => choice.price <= scenarios[index].budget);
    const goodValueChoices = choices.filter(choice => (choice.valueScore || 0) >= 4).length;
    const avoidedOverpriced = !choices.some(choice => choice.price > scenarios[currentScenario].budget);
    const consideredUsed = choices.some(choice => choice.id.includes('used') || choice.id.includes('refurb'));
    
    if (averageValueScore >= 4) points += 12; // Excellent value decisions
    else if (averageValueScore >= 3) points += 8; // Good value decisions
    
    if (stayedInBudget) points += 8; // Stayed within all budgets
    if (goodValueChoices >= 2) points += 6; // Made multiple smart choices
    if (consideredUsed) points += 5; // Considered second-hand options
    if (avoidedOverpriced) points += 4; // Avoided overspending
    
    if (points >= 45) {
      badge = 'Value Master';
    } else if (points >= 38) {
      badge = 'Bargain Hunter';
    } else if (points >= 32) {
      badge = 'Wise Buyer';
    }
    
    onComplete({ coins: Math.min(40, points), badge });
  };

  if (currentStep === 'intro') {
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🛍️ Smart Shopper Quest!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-700">Become a Value Detective!</h3>
              <p className="text-lg text-gray-600">
                You need to buy some important things, but there are so many options! 
                Your mission is to find the best value - not just the cheapest price, but the best quality for your money.
              </p>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-yellow-800">Your Challenge</span>
                </div>
                <div className="text-yellow-700 text-sm space-y-1">
                  <div>🎒 Find the best backpack for school</div>
                  <div>👟 Choose the right sports shoes</div>
                  <div>📱 Pick a learning tablet</div>
                </div>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-green-800">What Makes a Smart Choice?</span>
                </div>
                <p className="text-green-700 text-sm">
                  It's not always about buying the most expensive OR the cheapest item. 
                  Smart shoppers look for the best VALUE - good quality that fits their budget and needs!
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('learning')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3"
          >
            Teach me to be a smart shopper! →
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
            <h2 className="text-3xl font-bold text-blue-800">🧠 Smart Shopping Skills</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-blue-700">The Smart Shopper Formula</h3>
              <p className="text-gray-600 mt-2">
                Great shoppers don't just look at price - they consider the whole picture!
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200">
                <div className="text-center">
                  <Coins className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-green-800">Price</h4>
                  <div className="text-green-700 text-sm mt-2 space-y-1">
                    <div>💰 Can you afford it?</div>
                    <div>🎯 Does it fit your budget?</div>
                    <div>💸 Are you overspending?</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                <div className="text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-bold text-yellow-800">Quality</h4>
                  <div className="text-yellow-700 text-sm mt-2 space-y-1">
                    <div>🔨 Will it last?</div>
                    <div>✨ Does it work well?</div>
                    <div>😊 Will you be happy with it?</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-200">
                <div className="text-center">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-bold text-purple-800">Value</h4>
                  <div className="text-purple-700 text-sm mt-2 space-y-1">
                    <div>⚖️ Quality vs. Price</div>
                    <div>🎯 Meets your needs</div>
                    <div>⏰ Good for how long you'll use it</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
              <h4 className="font-bold text-red-800 mb-2">🚫 Shopping Traps to Avoid</h4>
              <div className="text-red-700 text-sm space-y-1">
                <div>• 💸 <strong>Most Expensive = Best:</strong> Sometimes you pay for fancy features you don't need</div>
                <div>• 🎯 <strong>Cheapest = Best Deal:</strong> Sometimes cheap items break quickly and cost more to replace</div>
                <div>• 🏷️ <strong>Brand Names = Quality:</strong> Sometimes no-name brands are just as good</div>
                <div>• 🆕 <strong>Must Be New:</strong> Used or refurbished can offer great value</div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">✅ Smart Shopping Questions</h4>
              <div className="text-blue-700 text-sm space-y-1">
                <div>• 🤔 Do I really need this item?</div>
                <div>• ⏰ How long do I need it to last?</div>
                <div>• 💰 What's my budget for this purchase?</div>
                <div>• 🔍 What features do I actually need vs. want?</div>
                <div>• 📊 Am I getting good value for my money?</div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('scenario1')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
          >
            Let's go shopping! 🛍️
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep.startsWith('scenario')) {
    const scenario = scenarios[currentScenario];
    
    return (
      <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">
              {scenario.emoji} {scenario.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress and Budget */}
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Shopping Progress</span>
              <span className="text-sm text-gray-600">Item {currentScenario + 1} of 3</span>
            </div>
            <Progress value={(currentScenario + 1) * 33.33} className="mb-4" />
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Coins className="h-4 w-4 text-green-500" />
                  <span className="font-bold">{scenario.budget}</span>
                </div>
                <p className="text-xs text-gray-600">Budget for this item</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <span className="font-bold">{totalSpent}</span>
                </div>
                <p className="text-xs text-gray-600">Total spent so far</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{scenario.category}</span>
                </div>
                <p className="text-xs text-gray-600">Category</p>
              </div>
            </div>
          </div>
          
          {/* Scenario Description */}
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-green-200">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{scenario.emoji}</div>
              <h3 className="text-xl font-bold text-green-700">{scenario.title}</h3>
              <p className="text-gray-600">{scenario.description}</p>
            </div>
            
            <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Search className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-blue-800">Your Mission:</span>
              </div>
              <p className="text-blue-700 text-sm">
                Compare these options carefully. Look at price, quality, features, and overall value. 
                Which choice gives you the best bang for your buck?
              </p>
            </div>
          </div>
          
          {/* Product Comparison */}
          <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-green-200">
            <h4 className="font-bold text-green-800 mb-4 text-center">🔍 Compare Your Options</h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              {scenario.products.map((product) => {
                const isOverBudget = product.price > scenario.budget;
                const valueColor = (product.valueScore || 0) >= 4 ? 'border-green-400 bg-green-50' :
                                 (product.valueScore || 0) >= 3 ? 'border-yellow-400 bg-yellow-50' :
                                 'border-red-400 bg-red-50';
                
                const qualityIcon = product.quality === 'high' ? '⭐⭐⭐' :
                                   product.quality === 'medium' ? '⭐⭐' : '⭐';
                
                return (
                  <Card 
                    key={product.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      isOverBudget 
                        ? 'bg-gray-100 border-gray-300 opacity-60' 
                        : `hover:shadow-lg hover:scale-105 ${valueColor}`
                    }`}
                    onClick={() => !isOverBudget && handleProductSelect(product)}
                  >
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{product.emoji}</div>
                        <h5 className="font-bold text-sm">{product.name}</h5>
                        <p className="text-xs text-gray-600">{product.brand}</p>
                        <p className="text-xs text-gray-500">{product.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">${product.price}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${isOverBudget ? 'border-red-400 text-red-700' : ''}`}
                          >
                            {isOverBudget ? '🚫 Over Budget' : '✅ In Budget'}
                          </Badge>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div><strong>Quality:</strong> {qualityIcon} {product.quality}</div>
                          <div><strong>Durability:</strong> {product.durability}</div>
                          <div><strong>Value Score:</strong> {product.valueScore}/6 ⭐</div>
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-bold text-green-700 mb-1">✅ Pros:</div>
                          {product.pros.slice(0, 2).map((pro, i) => (
                            <div key={i} className="text-green-600">• {pro}</div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-bold text-red-700 mb-1">❌ Cons:</div>
                          {product.cons.slice(0, 2).map((con, i) => (
                            <div key={i} className="text-red-600">• {con}</div>
                          ))}
                        </div>
                      </div>
                      
                      {isOverBudget && (
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
          
          <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-200">
            <p className="text-yellow-800 text-center text-sm">
              💭 <strong>Think like a detective!</strong> Consider price, quality, durability, and your actual needs. 
              What will give you the best value for your money?
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (currentStep === 'reflection') {
    const choices = Object.values(scenarioChoices);
    const averageValueScore = choices.reduce((sum, choice) => sum + (choice.valueScore || 0), 0) / choices.length;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-800">🧾 Shopping Review</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Shopping Cart Summary</h3>
              
              {/* Shopping Summary Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg border border-blue-200">
                  <ShoppingCart className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold text-blue-800">{choices.length}</div>
                  <div className="text-xs text-blue-600">Items Bought</div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg border border-green-200">
                  <Coins className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="font-bold text-green-800">${totalSpent}</div>
                  <div className="text-xs text-green-600">Total Spent</div>
                </div>
                
                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="font-bold text-yellow-800">{averageValueScore.toFixed(1)}/6</div>
                  <div className="text-xs text-yellow-600">Average Value Score</div>
                </div>
                
                <div className="bg-purple-100 p-3 rounded-lg border border-purple-200">
                  <ThumbsUp className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                  <div className="font-bold text-purple-800">
                    {averageValueScore >= 4 ? 'Excellent' : averageValueScore >= 3 ? 'Good' : 'Learning'}
                  </div>
                  <div className="text-xs text-purple-600">Shopping Grade</div>
                </div>
              </div>
            </div>
            
            {/* Purchase Review */}
            <div className="space-y-3">
              <h4 className="font-bold text-purple-800">🛍️ Your Purchases:</h4>
              {scenarios.map((scenario, index) => {
                const choice = scenarioChoices[index];
                if (!choice) return null;
                
                const valueColor = (choice.valueScore || 0) >= 4 ? 'bg-green-100 border-green-200' :
                                  (choice.valueScore || 0) >= 3 ? 'bg-yellow-100 border-yellow-200' :
                                  'bg-red-100 border-red-200';
                
                const valueIcon = (choice.valueScore || 0) >= 4 ? '🌟' :
                                 (choice.valueScore || 0) >= 3 ? '👍' : '📚';
                
                return (
                  <div key={index} className={`p-3 rounded-lg border-2 ${valueColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">
                        {scenario.emoji} {scenario.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">${choice.price}</Badge>
                        <Badge variant="outline">{valueIcon} {choice.valueScore}/6</Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div><strong>You chose:</strong> {choice.name} by {choice.brand}</div>
                      <div className="text-gray-600 mt-1">
                        <strong>Why this was a {(choice.valueScore || 0) >= 4 ? 'great' : (choice.valueScore || 0) >= 3 ? 'good' : 'learning'} choice:</strong>{' '}
                        {(choice.valueScore || 0) >= 4 ? 'Excellent balance of quality and price!' :
                         (choice.valueScore || 0) >= 3 ? 'Good value for your money.' :
                         'Learning opportunity - consider quality vs price next time.'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Analysis */}
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-800 mb-2">📊 Shopping Analysis:</h4>
              <div className="text-blue-700 text-sm space-y-1">
                {averageValueScore >= 4 && (
                  <div>🌟 Excellent! You consistently found great value in your purchases.</div>
                )}
                {choices.filter(c => (c.valueScore || 0) >= 4).length >= 2 && (
                  <div>🎯 Great job finding multiple high-value items!</div>
                )}
                {choices.every((choice, index) => choice.price <= scenarios[index].budget) && (
                  <div>💰 Perfect budget management - you stayed within budget for every item!</div>
                )}
                {choices.some(choice => choice.id.includes('used') || choice.id.includes('refurb')) && (
                  <div>♻️ Smart thinking considering second-hand options for better value!</div>
                )}
                {totalSpent <= 100 && (
                  <div>💡 You made thoughtful choices without overspending.</div>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('result')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3"
          >
            See my shopping results! →
          </Button>
        </div>
      </Card>
    );
  }

  if (currentStep === 'result') {
    const choices = Object.values(scenarioChoices);
    const averageValueScore = choices.reduce((sum, choice) => sum + (choice.valueScore || 0), 0) / choices.length;
    const goodValueChoices = choices.filter(choice => (choice.valueScore || 0) >= 4).length;
    
    return (
      <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-800">🏆 Smart Shopping Complete!</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Value Detective Mission Complete!</h3>
            
            {/* Final Results */}
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {averageValueScore >= 4 ? '🌟' : averageValueScore >= 3 ? '👍' : '📚'}
                </div>
                <div className="font-bold text-lg">
                  {averageValueScore >= 4 ? 'VALUE EXPERT!' : averageValueScore >= 3 ? 'SMART SHOPPER!' : 'LEARNING!'}
                </div>
                <p className="text-sm text-gray-600">Average value score: {averageValueScore.toFixed(1)}/6</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-bold text-lg">${totalSpent}</div>
                <p className="text-sm text-gray-600">Total invested in quality items</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-bold text-lg">Value Skills</div>
                <p className="text-sm text-gray-600">Mastered!</p>
              </div>
            </div>
            
            {/* Lessons Learned */}
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-2">🎓 Smart Shopping Lessons:</h4>
              <div className="text-yellow-700 text-sm space-y-1">
                <div>• 🔍 Always compare options before buying</div>
                <div>• ⚖️ Balance price with quality and durability</div>
                <div>• 🎯 Consider your actual needs vs. wants</div>
                <div>• ♻️ Second-hand items can offer amazing value</div>
                <div>• 💰 Expensive doesn't always mean better</div>
                <div>• 📊 Calculate value, not just price</div>
                <div>• 🏦 Stay within your budget while maximizing quality</div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-blue-800">
                <strong>🛍️ Shopping Master Tip:</strong> The best purchase isn't the cheapest or most expensive - 
                it's the one that gives you the best quality for your budget and meets your actual needs!
              </p>
            </div>
          </div>
          
          <Button 
            onClick={completeQuest}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
          >
            Complete Quest! 🛍️
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default SmartShopperQuest;