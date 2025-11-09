import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Target, ShoppingBag, BookOpen } from "lucide-react";
import { useState } from "react";

const StudentDashboard = () => {
  const [saveAmount] = useState(45);
  const [spendAmount] = useState(28);
  const [goalProgress] = useState(60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-purple/30 via-playful-yellow/20 to-coral/20">
      {/* Header */}
      <header className="border-b-4 border-deep-blue/20 bg-card/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-playful-yellow via-coral to-light-purple flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform">
                🐼
              </div>
              <div>
                <h1 className="text-2xl font-bold text-deep-blue">Welcome back, Alex!</h1>
                <p className="text-sm text-deep-blue/70 font-medium">Grade 3 • Mrs. Johnson's Class</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-playful-yellow/30 to-playful-yellow/20 px-6 py-3 rounded-3xl shadow-md border-2 border-playful-yellow/40">
              <Coins className="h-6 w-6 text-playful-yellow coin-shimmer drop-shadow-md" />
              <span className="font-bold text-deep-blue text-xl">73 coins</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Money Jars */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Save Jar */}
          <Card className="p-8 space-y-5 border-4 border-success/40 bg-gradient-to-br from-card via-success/5 to-success/10 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-blue">Save Jar</h3>
                  <p className="text-sm text-deep-blue/70 font-medium">For future goals 🎯</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-success">{saveAmount}</p>
                <p className="text-sm text-deep-blue/70 font-semibold">coins</p>
              </div>
            </div>
            
            {/* Goal Progress */}
            <div className="space-y-3 pt-4 border-t-2 border-success/30">
              <div className="flex justify-between text-sm">
                <span className="text-deep-blue/80 font-medium">Current Goal: New Backpack 🎒</span>
                <span className="font-bold text-success text-lg">{goalProgress}%</span>
              </div>
              <Progress value={goalProgress} className="h-4 bg-success/20" />
              <p className="text-sm text-deep-blue/70 font-medium">✨ 30 more coins to reach your goal!</p>
            </div>
          </Card>

          {/* Spend Jar */}
          <Card className="p-8 space-y-5 border-4 border-coral/40 bg-gradient-to-br from-card via-coral/5 to-coral/10 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-coral to-coral/70 flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-deep-blue">Spend Jar</h3>
                  <p className="text-sm text-deep-blue/70 font-medium">For fun now 🎉</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-coral">{spendAmount}</p>
                <p className="text-sm text-deep-blue/70 font-semibold">coins</p>
              </div>
            </div>
            
            <div className="pt-4 border-t-2 border-coral/30">
              <Button className="w-full bg-gradient-to-r from-coral to-coral/80 hover:from-coral/90 hover:to-coral/70 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" size="lg">
                🛍️ Visit Store
              </Button>
            </div>
          </Card>
        </div>

        {/* Today's Quests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gradient-to-r from-light-purple/30 to-playful-yellow/20 p-6 rounded-3xl border-3 border-deep-blue/20">
            <h2 className="text-3xl font-bold text-deep-blue flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-deep-blue" />
              Today's Quests ⭐
            </h2>
            <span className="text-lg text-deep-blue/80 font-bold bg-playful-yellow/30 px-4 py-2 rounded-full">2 available</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-5 border-4 border-light-purple/50 hover:border-deep-blue/50 bg-gradient-to-br from-card to-light-purple/10 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-deep-blue/20 to-light-purple/20 text-deep-blue text-sm font-bold border-2 border-deep-blue/20">
                    Needs vs Wants 🤔
                  </div>
                  <h3 className="text-2xl font-bold text-deep-blue group-hover:text-light-purple transition-colors">
                    Shopping Trip
                  </h3>
                  <p className="text-deep-blue/70 font-medium text-base">
                    Help Sarah decide what to buy at the store. Which items are needs?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-5 border-t-2 border-light-purple/30">
                <div className="flex items-center gap-3 text-playful-yellow">
                  <Coins className="h-7 w-7 coin-shimmer drop-shadow-md" />
                  <span className="font-bold text-xl text-deep-blue">+10 coins</span>
                </div>
                <Button className="bg-gradient-to-r from-light-purple to-deep-blue text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">Start Quest →</Button>
              </div>
            </Card>

            <Card className="p-8 space-y-5 border-4 border-success/50 hover:border-success bg-gradient-to-br from-card to-success/10 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-success/20 to-success/10 text-success text-sm font-bold border-2 border-success/30">
                    Budgeting 💰
                  </div>
                  <h3 className="text-2xl font-bold text-deep-blue group-hover:text-success transition-colors">
                    Plan Your Week
                  </h3>
                  <p className="text-deep-blue/70 font-medium text-base">
                    You have 15 coins to spend this week. Plan how to use them wisely.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-5 border-t-2 border-success/30">
                <div className="flex items-center gap-3 text-playful-yellow">
                  <Coins className="h-7 w-7 coin-shimmer drop-shadow-md" />
                  <span className="font-bold text-xl text-deep-blue">+15 coins</span>
                </div>
                <Button className="bg-gradient-to-r from-success to-success/80 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">Start Quest →</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-8 space-y-6 border-4 border-playful-yellow/40 bg-gradient-to-br from-card to-playful-yellow/5 shadow-xl">
          <h3 className="text-2xl font-bold text-deep-blue flex items-center gap-2">
            Recent Activity 📜
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 hover:border-success/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center text-2xl shadow-md">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-deep-blue text-lg">Completed "Compare Prices"</p>
                  <p className="text-sm text-deep-blue/70 font-medium">2 hours ago</p>
                </div>
              </div>
              <div className="text-success font-bold text-xl">+12 coins</div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-coral/10 to-coral/5 border-2 border-coral/20 hover:border-coral/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-coral to-coral/70 flex items-center justify-center text-2xl shadow-md">
                  🎨
                </div>
                <div>
                  <p className="font-bold text-deep-blue text-lg">Bought Art Supplies</p>
                  <p className="text-sm text-deep-blue/70 font-medium">Yesterday</p>
                </div>
              </div>
              <div className="text-coral font-bold text-xl">-8 coins</div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 hover:border-success/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center text-2xl shadow-md">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-deep-blue text-lg">Completed "Needs vs Wants"</p>
                  <p className="text-sm text-deep-blue/70 font-medium">2 days ago</p>
                </div>
              </div>
              <div className="text-success font-bold text-xl">+10 coins</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
