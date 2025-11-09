import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, GraduationCap, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-save-jar-light to-spend-jar-light">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-coin to-coin-shine flex items-center justify-center">
              <Coins className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">BankDojo Jr.</span>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/student")}>
              Student Login
            </Button>
            <Button variant="default" onClick={() => navigate("/teacher")}>
              Teacher Login
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Build Money Skills That Last a Lifetime
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A continuous, school-based financial life where children practice real money decisions weekly—with no finish line
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 rounded-full"
              onClick={() => navigate("/student")}
            >
              Start as Student
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 h-14 rounded-full"
              onClick={() => navigate("/teacher")}
            >
              Start as Teacher
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-save-jar-light flex items-center justify-center">
              <Coins className="h-6 w-6 text-save-jar" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Earn & Save</h3>
            <p className="text-muted-foreground">
              Complete quests to earn coins. Allocate between Save and Spend jars to reach goals.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-spend-jar-light flex items-center justify-center">
              <Target className="h-6 w-6 text-spend-jar" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Set Goals</h3>
            <p className="text-muted-foreground">
              Plan for short and medium-term goals. Learn about tradeoffs and delayed gratification.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Weekly Quests</h3>
            <p className="text-muted-foreground">
              Practice needs vs wants, budgeting, and comparison shopping through engaging scenarios.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Teacher Tools</h3>
            <p className="text-muted-foreground">
              Easy class management, progress tracking, and complexity controls—all in under 15 minutes per week.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-card/50 rounded-3xl my-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Earn Coins</h3>
                <p className="text-muted-foreground">
                  Students complete weekly quests about needs vs wants, budgeting, and smart shopping to earn coins.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-save-jar text-primary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Save or Spend</h3>
                <p className="text-muted-foreground">
                  Allocate coins between Save and Spend jars. Learn to balance immediate wants with future goals.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-spend-jar text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Face Choices</h3>
                <p className="text-muted-foreground">
                  Make purchase decisions, handle surprise expenses, and reflect on outcomes.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Build Habits</h3>
                <p className="text-muted-foreground">
                  Weekly cycles create lasting money habits. No finish line—continuous practice means continuous growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Start Building Money Skills?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students learning financial literacy through practice, not just lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 rounded-full"
              onClick={() => navigate("/teacher")}
            >
              Get Started for Free
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 BankDojo Jr. Building financial literacy habits that last.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
