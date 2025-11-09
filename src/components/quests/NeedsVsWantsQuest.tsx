import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Backpack, Trophy, Coins, X } from 'lucide-react';

interface QuestItem {
  id: string;
  name: string;
  icon: string;
  category: 'needs' | 'wants';
  hint: string;
}

const questItems: QuestItem[] = [
  { id: 'apple', name: 'Apple', icon: '🍎', category: 'needs', hint: 'Food gives you energy for learning!' },
  { id: 'toy-car', name: 'Toy Car', icon: '🚗', category: 'wants', hint: 'Fun to have, but not needed for school!' },
  { id: 'notebook', name: 'Notebook', icon: '📓', category: 'needs', hint: 'You need this to write down what you learn!' },
  { id: 'candy', name: 'Candy', icon: '🍬', category: 'wants', hint: 'Sweet treats are nice extras!' },
  { id: 'sneakers', name: 'Sneakers', icon: '👟', category: 'needs', hint: 'You need shoes to walk around school!' },
  { id: 'pencil', name: 'Pencil', icon: '✏️', category: 'needs', hint: 'Essential for writing and drawing!' },
];

interface NeedsVsWantsQuestProps {
  onComplete: (reward: { coins: number; badge: string }) => void;
  onClose: () => void;
}

export default function NeedsVsWantsQuest({ onComplete, onClose }: NeedsVsWantsQuestProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [items, setItems] = useState(questItems);
  const [needsBasket, setNeedsBasket] = useState<QuestItem[]>([]);
  const [wantsBasket, setWantsBasket] = useState<QuestItem[]>([]);
  const [availableItems, setAvailableItems] = useState<QuestItem[]>(questItems);
  const [feedback, setFeedback] = useState<string>('');
  const [showHint, setShowHint] = useState<string>('');
  const [correctPlacements, setCorrectPlacements] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const startQuest = () => {
    setGameState('playing');
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;

    const item = questItems.find(item => item.id === draggableId);
    if (!item) return;

    // Remove item from source
    if (source.droppableId === 'available') {
      setAvailableItems(prev => prev.filter(i => i.id !== draggableId));
    } else if (source.droppableId === 'needs') {
      setNeedsBasket(prev => prev.filter(i => i.id !== draggableId));
    } else if (source.droppableId === 'wants') {
      setWantsBasket(prev => prev.filter(i => i.id !== draggableId));
    }

    // Add item to destination
    if (destination.droppableId === 'needs') {
      setNeedsBasket(prev => [...prev, item]);
      
      if (item.category === 'needs') {
        setFeedback('Great choice! ✨');
        setCorrectPlacements(prev => prev + 1);
        playCorrectSound();
      } else {
        setFeedback('Think about what helps you at school! 🤔');
        setShowHint(item.hint);
        setTimeout(() => setShowHint(''), 3000);
      }
    } else if (destination.droppableId === 'wants') {
      setWantsBasket(prev => [...prev, item]);
      
      if (item.category === 'wants') {
        setFeedback('Perfect! That\'s a want! 🌟');
        setCorrectPlacements(prev => prev + 1);
        playCorrectSound();
      } else {
        setFeedback('Hmm, do you really need this for school? 🤔');
        setShowHint(item.hint);
        setTimeout(() => setShowHint(''), 3000);
      }
    } else if (destination.droppableId === 'available') {
      setAvailableItems(prev => [...prev, item]);
    }

    setTimeout(() => setFeedback(''), 2000);
  };

  const playCorrectSound = () => {
    // Simple audio feedback (you can add actual sound files later)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  useEffect(() => {
    if (availableItems.length === 0) {
      const allCorrect = needsBasket.every(item => item.category === 'needs') && 
                        wantsBasket.every(item => item.category === 'wants');
      
      if (allCorrect) {
        setShowConfetti(true);
        setGameState('completed');
        setTimeout(() => {
          onComplete({ coins: 10, badge: 'Smart Sorter' });
        }, 2000);
      }
    }
  }, [availableItems, needsBasket, wantsBasket]);

  if (gameState === 'intro') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Backpack className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              The Great Needs vs. Wants Sort
            </h2>
            <p className="text-gray-600 text-lg">
              Getting ready for school? Your backpack only fits five items, so choose wisely.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800">
              You're packing for school. Your backpack only fits 5 things. 
              Sort what you <strong>need</strong> and what you <strong>want</strong>.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startQuest} size="lg" className="bg-blue-500 hover:bg-blue-600">
              Start Quest! 🎒
            </Button>
            <Button onClick={onClose} variant="outline" size="lg">
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'completed') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="animate-bounce text-6xl">🎉</div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="animate-pulse mb-4">
              <Backpack className="w-16 h-16 mx-auto text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              You packed smart! Great job! 🎉
            </h2>
            <p className="text-gray-600">
              Needs help you get through your day. Wants are fun extras you can save for later.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-lg">10 Coins Earned!</span>
                <span className="text-sm text-gray-600">(6 Save, 4 Spend)</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Smart Sorter Badge
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600">
              Close Quest
            </Button>
            <Button 
              onClick={() => {
                setGameState('intro');
                setNeedsBasket([]);
                setWantsBasket([]);
                setAvailableItems(questItems);
                setCorrectPlacements(0);
              }} 
              variant="outline"
            >
              Replay Quest
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Pack Your Backpack!</h2>
            <p className="text-gray-600">Drag items to the correct basket</p>
            {feedback && (
              <div className="mt-2 text-lg font-semibold text-green-600 animate-pulse">
                {feedback}
              </div>
            )}
            {showHint && (
              <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-lg animate-bounce">
                💡 {showHint}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Items */}
            <div className="order-2 md:order-1">
              <h3 className="font-semibold text-center mb-3">Items to Sort</h3>
              <Droppable droppableId="available">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : ''
                    }`}
                  >
                    {availableItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 bg-white rounded-lg shadow-sm border cursor-grab active:cursor-grabbing transition-transform ${
                              snapshot.isDragging ? 'rotate-3 scale-105' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Needs Basket */}
            <div className="order-1 md:order-2">
              <h3 className="font-semibold text-center mb-3 text-blue-600">Needs 🎯</h3>
              <Droppable droppableId="needs">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] p-4 border-2 border-blue-300 rounded-lg transition-all ${
                      snapshot.isDraggingOver ? 'border-blue-500 bg-blue-100 scale-105' : 'bg-blue-50'
                    }`}
                  >
                    {needsBasket.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-3 mb-2 bg-white rounded-lg shadow-sm border ${
                          item.category === 'needs' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                          {item.category === 'needs' && <span className="text-green-500">✓</span>}
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Wants Basket */}
            <div className="order-3">
              <h3 className="font-semibold text-center mb-3 text-purple-600">Wants 🎁</h3>
              <Droppable droppableId="wants">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] p-4 border-2 border-purple-300 rounded-lg transition-all ${
                      snapshot.isDraggingOver ? 'border-purple-500 bg-purple-100 scale-105' : 'bg-purple-50'
                    }`}
                  >
                    {wantsBasket.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-3 mb-2 bg-white rounded-lg shadow-sm border ${
                          item.category === 'wants' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-medium">{item.name}</span>
                          {item.category === 'wants' && <span className="text-green-500">✓</span>}
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button onClick={onClose} variant="outline">
              Exit Quest
            </Button>
          </div>
        </CardContent>
      </Card>
    </DragDropContext>
  );
}