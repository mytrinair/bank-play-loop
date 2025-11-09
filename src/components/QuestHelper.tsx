import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuestHelperProps {
  currentPhase: string;
  currentDay: number;
  questContext: {
    coins: number;
    dayPlan?: {
      lunch: number;
      fun: number;
      save: number;
    };
    currentEvent?: {
      type: 'earn' | 'surprise';
      title: string;
      description: string;
      options: Array<{
        text: string;
        coins: number;
        badge?: string;
      }>;
    };
    savingsGoal?: {
      name: string;
      cost: number;
      emoji: string;
    };
    totalSaved?: number;
    totalEarned?: number;
    totalSpentNeeds?: number;
    totalSpentWants?: number;
    earnedBadges?: string[];
    dailyPlans?: Array<{
      day: number;
      lunch: number;
      fun: number;
      save: number;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

const QuestHelper: React.FC<QuestHelperProps> = ({ 
  currentPhase, 
  currentDay, 
  questContext, 
  isOpen, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when first opened
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hi there! I'm your Quest Helper!

I'm here to guide you through your Mini-Life Week journey.

What would you like help with today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const getContextPrompt = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDayName = dayNames[currentDay - 1] || 'Day';
    
    let contextInfo = `=== CURRENT SITUATION ===\n`;
    contextInfo += `Day: ${currentDayName} (Day ${currentDay} of 5)\n`;
    contextInfo += `Phase: ${currentPhase}\n`;
    contextInfo += `Current Coins: ${questContext.coins}\n`;
    
    // Add savings goal information
    if (questContext.savingsGoal) {
      contextInfo += `Savings Goal: ${questContext.savingsGoal.emoji} ${questContext.savingsGoal.name} (costs ${questContext.savingsGoal.cost} coins)\n`;
      if (questContext.totalSaved !== undefined) {
        const progress = Math.round((questContext.totalSaved / questContext.savingsGoal.cost) * 100);
        contextInfo += `Savings Progress: ${questContext.totalSaved}/${questContext.savingsGoal.cost} coins (${progress}%)\n`;
      }
    }
    
    // Add current day plan if in planning phase
    if (currentPhase === 'planning' && questContext.dayPlan) {
      const { lunch, fun, save } = questContext.dayPlan;
      const total = lunch + fun + save;
      const remaining = questContext.coins - total;
      contextInfo += `\n=== TODAY'S BUDGET PLAN ===\n`;
      contextInfo += `Lunch (required): ${lunch} coins\n`;
      contextInfo += `Fun activities: ${fun} coins\n`;
      contextInfo += `Savings: ${save} coins\n`;
      contextInfo += `Total planned: ${total} coins\n`;
      contextInfo += `Remaining: ${remaining} coins\n`;
      contextInfo += `Budget status: ${remaining >= 0 ? 'Balanced' : 'Over budget!'}\n`;
    }
    
    // Add current event information
    if (currentPhase === 'events' && questContext.currentEvent) {
      const event = questContext.currentEvent;
      contextInfo += `\n=== CURRENT EVENT ===\n`;
      contextInfo += `Type: ${event.type === 'earn' ? 'Earning Opportunity' : 'Surprise Event'}\n`;
      contextInfo += `Title: ${event.title}\n`;
      contextInfo += `Description: ${event.description}\n`;
      contextInfo += `Options:\n`;
      event.options.forEach((option, index) => {
        contextInfo += `  ${index + 1}. ${option.text} (${option.coins > 0 ? '+' : ''}${option.coins} coins)${option.badge ? ` [Badge: ${option.badge}]` : ''}\n`;
      });
    }
    
    // Add progress summary
    if (questContext.totalEarned !== undefined) {
      contextInfo += `\n=== WEEK PROGRESS ===\n`;
      contextInfo += `Total Earned: ${questContext.totalEarned} coins\n`;
      if (questContext.totalSpentNeeds !== undefined) contextInfo += `Spent on Needs: ${questContext.totalSpentNeeds} coins\n`;
      if (questContext.totalSpentWants !== undefined) contextInfo += `Spent on Wants: ${questContext.totalSpentWants} coins\n`;
      if (questContext.totalSaved !== undefined) contextInfo += `Total Saved: ${questContext.totalSaved} coins\n`;
    }
    
    // Add badges earned
    if (questContext.earnedBadges && questContext.earnedBadges.length > 0) {
      contextInfo += `Badges Earned: ${questContext.earnedBadges.join(', ')}\n`;
    }
    
    // Add phase-specific context
    contextInfo += `\n=== PHASE CONTEXT ===\n`;
    switch (currentPhase) {
      case 'intro':
        contextInfo += "Student is learning about the Mini-Life Week challenge. They start with 25 coins to manage for 5 days.";
        break;
      case 'setup':
        contextInfo += "Student is choosing their avatar and selecting a savings goal. Goals: Backpack (30 coins), Headphones (35 coins), Art Kit (40 coins).";
        break;
      case 'planning':
        contextInfo += `Student is planning their ${currentDayName} budget. Lunch is required (6 coins minimum), fun activities are optional, and they should save toward their goal.`;
        break;
      case 'events':
        contextInfo += `Student is facing a daily event on ${currentDayName}. They need to make a decision that will affect their coins and possibly earn badges.`;
        break;
      case 'reflection':
        contextInfo += `Student is reflecting on their ${currentDayName} decisions. This is a learning moment to think about needs vs wants and budgeting choices.`;
        break;
      case 'summary':
        contextInfo += "Student has completed their week-long journey. Time to celebrate achievements and reflect on money management lessons learned.";
        break;
      default:
        contextInfo += `Student is in the ${currentPhase} phase of their financial literacy quest.`;
    }

    return contextInfo;
  };

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
      const contextPrompt = getContextPrompt();
      
      const systemPrompt = `You are a helpful financial literacy tutor for children aged 8-12. You're helping them learn about money management through a fun quest game called "Mini-Life Week." 

IMPORTANT GUIDELINES:
1. Always be encouraging, positive, and age-appropriate
2. Never give direct answers - instead guide them to think through decisions
3. Use simple language and fun analogies children can understand
4. Focus only on financial literacy topics related to their current quest
5. Don't discuss anything unrelated to money management, budgeting, needs vs wants, or saving
6. Ask questions to help them think through their decisions
7. Relate concepts to things children understand (toys, school, family)
8. Reference their specific situation (day, coins, budget, goals) to make advice relevant
9. Help them understand the consequences of different choices

FORMATTING REQUIREMENTS:
- Use plain text only (no markdown, no asterisks, no special formatting)
- Use line breaks to separate different thoughts or questions
- No emojis or symbols
- Keep responses concise but helpful (60-80 words maximum)
- Write in short, clear sentences
- Use conversational, friendly tone

DETAILED GAME CONTEXT:
${contextPrompt}

CONVERSATION HISTORY:
${messages.slice(-6).map(msg => `${msg.isUser ? 'Student' : 'Helper'}: ${msg.content}`).join('\n')}

Student's new question: ${userMessage}

Based on their specific situation above, respond as their helpful quest guide. Reference their current day, coins, budget plan, or goals when relevant. Ask guiding questions and provide gentle hints without giving direct answers. Format your response with line breaks between different ideas and keep it concise and child-friendly.`;

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return errorData.response || "I'm having trouble understanding right now.\n\nCan you try asking your question in a different way?";
      }

      const data = await response.json();
      return data.response || "I'm having trouble understanding right now.\n\nCan you try asking your question in a different way?";
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "Oops! I'm having a little technical trouble. But I believe in you - you can figure this out! 💪 Think about what would help you reach your goals!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await callGeminiAPI(userMessage.content);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having some trouble right now, but remember:\n\nThink about needs vs wants, and what will help you reach your savings goal!\n\nYou've got this!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <Card className="w-full max-w-md h-[500px] flex flex-col bg-gradient-to-b from-blue-50 to-purple-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">Quest Helper 🌟</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quest Context */}
        <div className="p-3 bg-yellow-50 border-b">
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Day {currentDay} - {currentPhase}
            </Badge>
            <span className="text-yellow-700 font-medium">
              💰 {questContext.coins} coins
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-purple-500 text-white'
              }`}>
                {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me for help with your quest..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            I'm here to guide you through your money decisions! 💫
          </p>
        </div>
      </Card>
    </div>
  );
};

export default QuestHelper;