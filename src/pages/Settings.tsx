import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Bell, Shield, Palette, LogOut, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const { userInfo, userRole, logout } = useAuth();
  const navigate = useNavigate();
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      questReminders: true,
      achievementAlerts: true,
      weeklyProgress: false,
      emailNotifications: true,
    },
    privacy: {
      showProfile: true,
      shareProgress: false,
      allowMessages: true,
    },
    appearance: {
      theme: 'auto' as 'light' | 'dark' | 'auto',
      colorScheme: 'default' as 'default' | 'ocean' | 'forest' | 'sunset',
    },
    profile: {
      displayName: userInfo?.name || '',
      bio: '',
    }
  });

  const handleBack = () => {
    if (userRole === 'student') {
      navigate('/student');
    } else if (userRole === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Settings saved successfully!');
  };

  const updateNotification = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacy = (key: keyof typeof settings.privacy, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-purple/20 via-playful-yellow/10 to-coral/10">
      {/* Header */}
      <header className="border-b-4 border-deep-blue/20 bg-card/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="border-2 border-deep-blue/30 hover:border-deep-blue hover:bg-light-purple/20 rounded-2xl"
            >
              <ArrowLeft className="h-5 w-5 text-deep-blue" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-deep-blue">Settings</h1>
              <p className="text-deep-blue/70 font-medium">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        {/* Profile Section */}
        <Card className="p-8 space-y-6 border-4 border-light-purple/40 bg-gradient-to-br from-card to-light-purple/10 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-6 w-6 text-deep-blue" />
            <h2 className="text-2xl font-bold text-deep-blue">Profile</h2>
          </div>
          
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userInfo?.avatar} alt={userInfo?.name || 'User'} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-playful-yellow to-coral text-white">
                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-deep-blue font-semibold">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.profile.displayName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, displayName: e.target.value }
                    }))}
                    className="border-2 border-deep-blue/20 focus:border-light-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-deep-blue font-semibold">Email</Label>
                  <Input
                    id="email"
                    value={userInfo?.email || ''}
                    disabled
                    className="border-2 border-deep-blue/20 bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-deep-blue font-semibold">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={settings.profile.bio}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value }
                  }))}
                  className="border-2 border-deep-blue/20 focus:border-light-purple"
                />
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-light-purple/10 rounded-2xl border-2 border-light-purple/20">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-success to-success/70 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-deep-blue">Account Role</p>
                  <p className="text-sm text-deep-blue/70 capitalize">
                    {userRole === 'student' ? '🎓 Student' : userRole === 'teacher' ? '👩‍🏫 Teacher' : 'Not Set'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-8 space-y-6 border-4 border-playful-yellow/40 bg-gradient-to-br from-card to-playful-yellow/10 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-6 w-6 text-deep-blue" />
            <h2 className="text-2xl font-bold text-deep-blue">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Quest Reminders</Label>
                <p className="text-sm text-deep-blue/70">Get notified about new quests and deadlines</p>
              </div>
              <Switch
                checked={settings.notifications.questReminders}
                onCheckedChange={(value) => updateNotification('questReminders', value)}
              />
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Achievement Alerts</Label>
                <p className="text-sm text-deep-blue/70">Celebrate when you earn coins and complete goals</p>
              </div>
              <Switch
                checked={settings.notifications.achievementAlerts}
                onCheckedChange={(value) => updateNotification('achievementAlerts', value)}
              />
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Weekly Progress</Label>
                <p className="text-sm text-deep-blue/70">Summary of your weekly learning progress</p>
              </div>
              <Switch
                checked={settings.notifications.weeklyProgress}
                onCheckedChange={(value) => updateNotification('weeklyProgress', value)}
              />
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Email Notifications</Label>
                <p className="text-sm text-deep-blue/70">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(value) => updateNotification('emailNotifications', value)}
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-8 space-y-6 border-4 border-success/40 bg-gradient-to-br from-card to-success/10 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-deep-blue" />
            <h2 className="text-2xl font-bold text-deep-blue">Privacy & Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Show Profile</Label>
                <p className="text-sm text-deep-blue/70">Allow others to see your profile information</p>
              </div>
              <Switch
                checked={settings.privacy.showProfile}
                onCheckedChange={(value) => updatePrivacy('showProfile', value)}
              />
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Share Progress</Label>
                <p className="text-sm text-deep-blue/70">Share your quest progress with classmates</p>
              </div>
              <Switch
                checked={settings.privacy.shareProgress}
                onCheckedChange={(value) => updatePrivacy('shareProgress', value)}
              />
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-deep-blue font-semibold">Allow Messages</Label>
                <p className="text-sm text-deep-blue/70">Receive messages from teachers and classmates</p>
              </div>
              <Switch
                checked={settings.privacy.allowMessages}
                onCheckedChange={(value) => updatePrivacy('allowMessages', value)}
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-8 space-y-6 border-4 border-coral/40 bg-gradient-to-br from-card to-coral/10 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-6 w-6 text-deep-blue" />
            <h2 className="text-2xl font-bold text-deep-blue">Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-deep-blue font-semibold mb-3 block">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <Button
                    key={theme}
                    variant={settings.appearance.theme === theme ? "default" : "outline"}
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme }
                    }))}
                    className={`capitalize ${
                      settings.appearance.theme === theme
                        ? "bg-gradient-to-r from-deep-blue to-light-purple text-white"
                        : "border-2 border-deep-blue/20 hover:border-deep-blue/40"
                    }`}
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator className="bg-deep-blue/20" />
            
            <div>
              <Label className="text-deep-blue font-semibold mb-3 block">Color Scheme</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['default', 'ocean', 'forest', 'sunset'] as const).map((scheme) => (
                  <Button
                    key={scheme}
                    variant={settings.appearance.colorScheme === scheme ? "default" : "outline"}
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, colorScheme: scheme }
                    }))}
                    className={`capitalize ${
                      settings.appearance.colorScheme === scheme
                        ? "bg-gradient-to-r from-deep-blue to-light-purple text-white"
                        : "border-2 border-deep-blue/20 hover:border-deep-blue/40"
                    }`}
                  >
                    {scheme}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSaveSettings}
            className="flex-1 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex-1 bg-gradient-to-r from-coral to-coral/80 hover:from-coral/90 hover:to-coral/70 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log Out
          </Button>
        </div>

        {/* Account Info */}
        <Card className="p-6 bg-gradient-to-r from-deep-blue/5 to-light-purple/5 border-2 border-deep-blue/10">
          <div className="text-center space-y-2">
            <p className="text-sm text-deep-blue/70">
              Logged in as: <strong>{userInfo?.email}</strong>
            </p>
            <p className="text-xs text-deep-blue/50">
              Account managed by Auth0 • 
              {userRole === 'student' ? ' Student Account' : userRole === 'teacher' ? ' Teacher Account' : ' Role Not Set'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;