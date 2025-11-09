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
    <div className="min-h-screen bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-2xl">
                🐼
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Welcome back, Alex!</h1>
                <p className="text-sm text-muted-foreground">Grade 3 • Mrs. Johnson's Class</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-coin/20 px-4 py-2 rounded-full">
              <Coins className="h-5 w-5 text-coin coin-shimmer" />
              <span className="font-bold text-foreground">73 coins</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Money Jars */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Save Jar */}
          <Card className="p-6 space-y-4 border-2 border-save-jar/30 bg-gradient-to-br from-card to-save-jar-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-save-jar/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-save-jar" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Save Jar</h3>
                  <p className="text-sm text-muted-foreground">For future goals</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-save-jar">{saveAmount}</p>
                <p className="text-sm text-muted-foreground">coins</p>
              </div>
            </div>
            
            {/* Goal Progress */}
            <div className="space-y-2 pt-4 border-t border-save-jar/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Goal: New Backpack</span>
                <span className="font-semibold text-save-jar">{goalProgress}%</span>
              </div>
              <Progress value={goalProgress} className="h-3 bg-save-jar-light" />
              <p className="text-xs text-muted-foreground">30 more coins to reach your goal!</p>
            </div>
          </Card>

          {/* Spend Jar */}
          <Card className="p-6 space-y-4 border-2 border-spend-jar/30 bg-gradient-to-br from-card to-spend-jar-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-spend-jar/20 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-spend-jar" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Spend Jar</h3>
                  <p className="text-sm text-muted-foreground">For fun now</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-spend-jar">{spendAmount}</p>
                <p className="text-sm text-muted-foreground">coins</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-spend-jar/20">
              <Button className="w-full bg-spend-jar hover:bg-spend-jar/90" size="lg">
                Visit Store
              </Button>
            </div>
          </Card>
        </div>

        {/* Today's Quests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Today's Quests
            </h2>
            <span className="text-sm text-muted-foreground">2 available</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Needs vs Wants
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Shopping Trip
                  </h3>
                  <p className="text-muted-foreground">
                    Help Sarah decide what to buy at the store. Which items are needs?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-coin">
                  <Coins className="h-5 w-5 coin-shimmer" />
                  <span className="font-bold">+10 coins</span>
                </div>
                <Button>Start Quest</Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                    Budgeting
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Plan Your Week
                  </h3>
                  <p className="text-muted-foreground">
                    You have 15 coins to spend this week. Plan how to use them wisely.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-coin">
                  <Coins className="h-5 w-5 coin-shimmer" />
                  <span className="font-bold">+15 coins</span>
                </div>
                <Button>Start Quest</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-foreground">Completed "Compare Prices"</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="text-success font-bold">+12 coins</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-spend-jar/20 flex items-center justify-center">
                  🎨
                </div>
                <div>
                  <p className="font-semibold text-foreground">Bought Art Supplies</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="text-spend-jar font-bold">-8 coins</div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-foreground">Completed "Needs vs Wants"</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="text-success font-bold">+10 coins</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
