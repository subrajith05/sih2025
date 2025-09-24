"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import {
  Globe,
  Bell,
  Palette,
  Shield,
  Trash2,
  LogOut,
  Mail,
  MessageSquare,
  Smartphone,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import { transliterate } from "@/lib/transliterate"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi (हिंदी)", flag: "🇮🇳" },
  { code: "ta", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "te", name: "Telugu (తెలుగు)", flag: "🇮🇳" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", flag: "🇮🇳" },
  { code: "mr", name: "Marathi (मराठी)", flag: "🇮🇳" },
]

const themes = [
  { id: "auto", name: "System", description: "Match your device setting", icon: Laptop },
  { id: "light", name: "Light", description: "Bright, high contrast", icon: Sun },
  { id: "dark", name: "Dark", description: "Dim, low-light", icon: Moon },
]

export default function SettingsPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const { theme: activeTheme, setTheme } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedTheme, setSelectedTheme] = useState("system")
  const [notifications, setNotifications] = useState({
    email: false,
    push: false,
    sms: false,
    jobAlerts: false,
    skillReminders: false,
    weeklyDigest: false,
    marketingEmails: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    skillsVisible: true,
    activityVisible: false,
    allowAnalytics: true,
  })

  const [originalText, setOriginalText] = useState("")
  const [convertedText, setConvertedText] = useState("")

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }))
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Deleting account...")
    }
  }

  useEffect(() => {
    if (!activeTheme) return
    setSelectedTheme(activeTheme === "system" ? "auto" : activeTheme)
  }, [activeTheme])

  useEffect(() => {
    setConvertedText(transliterate(originalText, selectedLanguage as any))
  }, [originalText, selectedLanguage])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and privacy settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Language & Transliteration</span>
                </CardTitle>
                <CardDescription>Choose your preferred language and convert any text into it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLanguage === language.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedLanguage(language.code)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <p className="font-medium">{language.name}</p>
                          {selectedLanguage === language.code && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="translit-input">Enter text to transliterate</Label>
                    <Textarea
                      id="translit-input"
                      rows={6}
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      placeholder="Type or paste text in English..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="translit-output">
                      Converted ({languages.find((l) => l.code === selectedLanguage)?.name})
                    </Label>
                    <Textarea id="translit-output" rows={6} value={convertedText} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>Customize how SkillPath looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTheme === theme.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedTheme(theme.id)
                        setTheme(theme.id === "auto" ? "system" : (theme.id as "light" | "dark"))
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <theme.icon className="w-6 h-6" />
                        <div>
                          <p className="font-medium">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">{theme.description}</p>
                          {selectedTheme === theme.id && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                        </div>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Types */}
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="job-alerts">Job Alerts</Label>
                        <p className="text-sm text-muted-foreground">New job recommendations and matches</p>
                      </div>
                      <Switch
                        id="job-alerts"
                        checked={notifications.jobAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("jobAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="skill-reminders">Skill Reminders</Label>
                        <p className="text-sm text-muted-foreground">Learning reminders and progress updates</p>
                      </div>
                      <Switch
                        id="skill-reminders"
                        checked={notifications.skillReminders}
                        onCheckedChange={(checked) => handleNotificationChange("skillReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-digest">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">Weekly summary of your progress</p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Product updates and promotional content</p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="profile-visible">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      id="profile-visible"
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="skills-visible">Skills Visibility</Label>
                      <p className="text-sm text-muted-foreground">Show your skills on your public profile</p>
                    </div>
                    <Switch
                      id="skills-visible"
                      checked={privacy.skillsVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("skillsVisible", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="activity-visible">Activity Visibility</Label>
                      <p className="text-sm text-muted-foreground">Show your learning activity to others</p>
                    </div>
                    <Switch
                      id="activity-visible"
                      checked={privacy.activityVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("activityVisible", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow-analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help improve SkillPath with usage analytics</p>
                    </div>
                    <Switch
                      id="allow-analytics"
                      checked={privacy.allowAnalytics}
                      onCheckedChange={(checked) => handlePrivacyChange("allowAnalytics", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account data and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Settings</CardTitle>
                <CardDescription>Frequently used settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quick-notifications" className="text-sm">
                      All Notifications
                    </Label>
                    <Switch
                      id="quick-notifications"
                      checked={notifications.email && notifications.push}
                      onCheckedChange={(checked) => {
                        handleNotificationChange("email", checked)
                        handleNotificationChange("push", checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quick-privacy" className="text-sm">
                      Public Profile
                    </Label>
                    <Switch
                      id="quick-privacy"
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Get help and contact support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Report a Bug
                </Button>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                  onClick={() => {
                    logout()
                    router.push("/")
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
