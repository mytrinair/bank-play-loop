import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const MyRoom = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const studentId = userInfo?.id || '';
  
  const [ownedFurniture, setOwnedFurniture] = useState<string[]>([]);

  // Load owned furniture from localStorage
  useEffect(() => {
    const savedFurniture = localStorage.getItem(`student-${studentId}-furniture`);
    if (savedFurniture) {
      setOwnedFurniture(JSON.parse(savedFurniture));
    }
  }, [studentId]);

  const furniturePositions = {
    sofa: { left: '20%', bottom: '30%' },
    bed: { right: '20%', bottom: '25%' },
    table: { left: '45%', bottom: '40%' },
    rug: { left: '35%', bottom: '30%' },
    lamp: { right: '15%', bottom: '40%' },
    painting: { left: '30%', top: '15%' },
    plant: { left: '70%', bottom: '35%' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200">
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
            <Home className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-800">My Room</h1>
          </div>
          <div /> {/* Spacer */}
        </div>
      </div>

      {/* Room Container */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <Card className="w-full max-w-4xl h-[500px] overflow-hidden shadow-xl">
          {/* Room Interior */}
          <div 
            className="relative w-full h-full bg-gradient-to-b from-purple-100 to-purple-50"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, 
                  rgb(243, 232, 255) 0%, 
                  rgb(243, 232, 255) 70%, 
                  rgb(245, 245, 220) 70%, 
                  rgb(245, 245, 220) 100%
                )
              `
            }}
          >
            {/* Floor */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[30%]"
              style={{ backgroundColor: 'rgb(245, 245, 220)' }}
            />
            
            {/* Wall */}
            <div 
              className="absolute top-0 left-0 right-0 h-[70%]"
              style={{ backgroundColor: 'rgb(221, 214, 254)' }}
            />

            {/* Furniture */}
            {ownedFurniture.includes('sofa') && (
              <img
                src="/furniture/sofa.PNG"
                alt="Sofa"
                className="absolute w-96 h-60 object-contain"
                style={{ left: '5%', bottom: '15%' }}
              />
            )}
            
            {ownedFurniture.includes('bed') && (
              <img
                src="/furniture/bed.PNG"
                alt="Bed"
                className="absolute w-108 h-72 object-contain transform scale-x-[-1]"
                style={{ right: '2%', bottom: '5%' }}
              />
            )}
            
            {ownedFurniture.includes('table') && (
              <img
                src="/furniture/table.PNG"
                alt="Table"
                className="absolute w-30 h-24 object-contain"
                style={{ left: '45%', bottom: '25%' }}
                // style={furniturePositions.table}
              />
            )}

            {ownedFurniture.includes('rug') && (
              <img
                src="/furniture/rug.png"
                alt="Rug"
                className="absolute w-40 h-32 object-contain"
                style={furniturePositions.rug}
              />
            )}

            {ownedFurniture.includes('lamp') && (
              <img
                src="/furniture/lamp.png"
                alt="Lamp"
                className="absolute w-16 h-24 object-contain"
                style={furniturePositions.lamp}
              />
            )}

            {ownedFurniture.includes('painting') && (
              <img
                src="/furniture/painting.webp"
                alt="Painting"
                className="absolute w-24 h-20 object-contain"
                style={furniturePositions.painting}
              />
            )}

            {ownedFurniture.includes('plant') && (
              <img
                src="/furniture/plant.png"
                alt="Plant"
                className="absolute w-20 h-28 object-contain"
                style={furniturePositions.plant}
              />
            )}

            {/* Empty Room Message */}
            {ownedFurniture.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="p-6 bg-white/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏠</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Your room is empty!
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Visit the store to buy furniture and decorate your space.
                    </p>
                    <Button 
                      onClick={() => navigate('/store')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Go Shopping 🛍️
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Room Stats */}
      <div className="fixed bottom-4 left-4">
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Furniture Owned: {ownedFurniture.length}/7
            </p>
            <div className="flex gap-1 mt-2 justify-center">
              {['sofa', 'bed', 'table', 'rug', 'lamp', 'painting', 'plant'].map((item) => (
                <div
                  key={item}
                  className={`w-3 h-3 rounded-full ${
                    ownedFurniture.includes(item) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Shop Button */}
      {ownedFurniture.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={() => navigate('/store')}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
            size="lg"
          >
            🛍️ Shop More
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyRoom;