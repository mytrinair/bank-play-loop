import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins, ShoppingBag, Check, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface FurnitureItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const Store = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const studentId = userInfo?.id || '';
  
  const [currentCoins, setCurrentCoins] = useState(0);
  const [ownedFurniture, setOwnedFurniture] = useState<string[]>([]);
  const [showPurchaseEffect, setShowPurchaseEffect] = useState<string | null>(null);

  const furnitureItems: FurnitureItem[] = [
    {
      id: 'sofa',
      name: 'Cozy Sofa',
      price: 20,
      image: '/furniture/sofa.PNG',
      description: 'A comfortable sofa perfect for relaxing after a long day of learning!'
    },
    {
      id: 'bed',
      name: 'Comfy Bed',
      price: 30,
      image: '/furniture/bed.PNG',
      description: 'A cozy bed for sweet dreams and good rest.'
    },
    {
      id: 'table',
      name: 'Study Table',
      price: 10,
      image: '/furniture/table.PNG',
      description: 'A sturdy table perfect for homework and activities.'
    },
    {
      id: 'rug',
      name: 'Soft Rug',
      price: 15,
      image: '/furniture/rug.PNG',
      description: 'A cozy rug to make your room feel more comfortable and warm.'
    },
    {
      id: 'lamp',
      name: 'Reading Lamp',
      price: 12,
      image: '/furniture/lamp.PNG',
      description: 'A bright lamp perfect for reading and studying late into the night.'
    },
    {
      id: 'painting',
      name: 'Beautiful Painting',
      price: 18,
      image: '/furniture/painting.PNG',
      description: 'A lovely piece of art to brighten up your walls and inspire creativity.'
    },
    {
      id: 'plant',
      name: 'Green Plant',
      price: 8,
      image: '/furniture/plant.PNG',
      description: 'A beautiful plant to bring some nature and fresh air into your room.'
    }
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedCoins = localStorage.getItem(`student-${studentId}-coins`);
    const savedFurniture = localStorage.getItem(`student-${studentId}-furniture`);
    
    if (savedCoins) {
      setCurrentCoins(parseInt(savedCoins));
    }
    if (savedFurniture) {
      setOwnedFurniture(JSON.parse(savedFurniture));
    }
  }, [studentId]);

  const handlePurchase = (item: FurnitureItem) => {
    if (currentCoins >= item.price && !ownedFurniture.includes(item.id)) {
      // Deduct coins
      const newCoins = currentCoins - item.price;
      setCurrentCoins(newCoins);
      localStorage.setItem(`student-${studentId}-coins`, newCoins.toString());

      // Add furniture to owned list
      const newFurniture = [...ownedFurniture, item.id];
      setOwnedFurniture(newFurniture);
      localStorage.setItem(`student-${studentId}-furniture`, JSON.stringify(newFurniture));

      // Show purchase effect
      setShowPurchaseEffect(item.id);
      setTimeout(() => setShowPurchaseEffect(null), 2000);

      // Play success sound
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dz';
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const canAfford = (price: number) => currentCoins >= price;
  const isOwned = (itemId: string) => ownedFurniture.includes(itemId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/student')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-800">Furniture Store</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">{currentCoins}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/room')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              My Room
            </Button>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to the Furniture Store! 🏠
          </h2>
          <p className="text-gray-600">
            Spend your hard-earned coins to decorate your room with beautiful furniture.
          </p>
        </div>

        {/* Furniture Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {furnitureItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain bg-gray-50"
                />
                {isOwned(item.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-2">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                {showPurchaseEffect === item.id && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="text-4xl animate-bounce">✨</div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <div className="flex items-center gap-1">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-lg">{item.price}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                
                <div className="space-y-2">
                  {isOwned(item.id) ? (
                    <Badge className="w-full justify-center bg-green-100 text-green-800">
                      <Check className="h-4 w-4 mr-1" />
                      Owned
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford(item.price)}
                      className={`w-full ${
                        canAfford(item.price)
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {canAfford(item.price) ? (
                        <>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Buy Now
                        </>
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2" />
                          Not Enough Coins
                        </>
                      )}
                    </Button>
                  )}
                  
                  {!canAfford(item.price) && !isOwned(item.id) && (
                    <p className="text-xs text-red-500 text-center">
                      Need {item.price - currentCoins} more coins
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Collection Progress</h3>
            <div className="flex justify-center gap-4 mb-4">
              {furnitureItems.map((item) => (
                <div key={item.id} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isOwned(item.id) ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                    {isOwned(item.id) ? <Check className="h-6 w-6" /> : '?'}
                  </div>
                  <p className="text-sm text-gray-600">{item.name}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-lg font-semibold">
                {ownedFurniture.length}/{furnitureItems.length} Complete
              </div>
              {ownedFurniture.length === furnitureItems.length && (
                <Badge className="bg-gold text-yellow-800">🏆 Room Complete!</Badge>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Store;