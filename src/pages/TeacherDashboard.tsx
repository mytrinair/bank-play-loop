import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CheckCircle, Clock, TrendingUp, Plus, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Mrs. Johnson • Grade 3</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                New Class
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold text-foreground">24</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Active Students</p>
              <p className="text-xs text-muted-foreground">In all classes</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-3xl font-bold text-foreground">89</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Quests Completed</p>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-warning" />
              <span className="text-3xl font-bold text-foreground">12</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Pending Reviews</p>
              <p className="text-xs text-muted-foreground">Need approval</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-info" />
              <span className="text-3xl font-bold text-foreground">76%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Avg. Completion</p>
              <p className="text-xs text-muted-foreground">Across all quests</p>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Classes</h2>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Create Class
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">Morning Class</h3>
                    <p className="text-sm text-muted-foreground">Grade 3 • Complexity: Core</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-semibold text-foreground">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Quests</span>
                    <span className="font-semibold text-foreground">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-success">82%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Join Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded-lg text-center font-mono font-bold text-lg">
                      ABC-123
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">Afternoon Class</h3>
                    <p className="text-sm text-muted-foreground">Grade 3 • Complexity: Starter</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-semibold text-foreground">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Quests</span>
                    <span className="font-semibold text-foreground">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-success">68%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Join Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-muted rounded-lg text-center font-mono font-bold text-lg">
                      XYZ-789
                    </code>
                    <Button variant="outline" size="sm">Copy</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Pending Reviews</h2>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        🐼
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-foreground">Alex Chen</p>
                          <span className="text-xs text-muted-foreground">Morning Class</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Quest: "Plan Your Week"</p>
                          <p className="text-sm text-muted-foreground">Budgeting Exercise • Submitted 2 hours ago</p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-sm">
                          <p className="text-muted-foreground italic">
                            "I would save 10 coins for my goal and spend 5 coins on lunch and supplies."
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Return</Button>
                      <Button className="bg-success hover:bg-success/90">Approve</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Class Progress</h2>
            
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Concept Mastery</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Needs vs Wants</span>
                      <span className="text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Basic Budgeting</span>
                      <span className="text-muted-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Value Comparison</span>
                      <span className="text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Goal Setting</span>
                      <span className="text-muted-foreground">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Top Performers</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {["Sarah M.", "Alex C.", "Jamie L."].map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center font-bold text-success">
                          {i + 1}
                        </div>
                        <span className="font-medium text-foreground">{name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">8 quests completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
