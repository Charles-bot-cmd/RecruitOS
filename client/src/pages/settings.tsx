import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Edit2, Trash2, TestTube, Save } from "lucide-react";
import { getInitials } from "@/lib/utils";

const syncSettingsSchema = z.object({
  baseId: z.string().min(1, "Base ID is required"),
  tableName: z.string().min(1, "Table name is required"),
  syncFrequency: z.enum(["manual", "15min", "1hour", "daily"]),
});

const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  autoMatching: z.boolean(),
  showPhotos: z.boolean(),
  enableReminders: z.boolean(),
});

type SyncSettingsData = z.infer<typeof syncSettingsSchema>;
type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "admin" | "recruiter" | "viewer";
  initials: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    role: "admin",
    initials: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    role: "recruiter",
    initials: "JS",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@company.com",
    role: "viewer",
    initials: "BW",
  },
];

const notificationSettings: NotificationSetting[] = [
  {
    id: "new-candidates",
    title: "New candidate applications",
    description: "Get notified when new candidates apply",
    enabled: true,
  },
  {
    id: "interview-reminders",
    title: "Interview reminders",
    description: "Receive reminders before interviews",
    enabled: true,
  },
  {
    id: "status-updates",
    title: "Status updates",
    description: "Get notified when candidate status changes",
    enabled: false,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("sync");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(notificationSettings);
  const { toast } = useToast();

  const syncForm = useForm<SyncSettingsData>({
    resolver: zodResolver(syncSettingsSchema),
    defaultValues: {
      baseId: "",
      tableName: "Candidates",
      syncFrequency: "manual",
    },
  });

  const generalForm = useForm<GeneralSettingsData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "Your Company",
      industry: "Technology",
      autoMatching: true,
      showPhotos: false,
      enableReminders: true,
    },
  });

  const handleSyncSettings = async (data: SyncSettingsData) => {
    try {
      // TODO: Implement sync settings save
      console.log("Saving sync settings:", data);
      toast({
        title: "Success",
        description: "Sync settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sync settings",
        variant: "destructive",
      });
    }
  };

  const handleGeneralSettings = async (data: GeneralSettingsData) => {
    try {
      // TODO: Implement general settings save
      console.log("Saving general settings:", data);
      toast({
        title: "Success",
        description: "General settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save general settings",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    try {
      // TODO: Implement test connection
      toast({
        title: "Success",
        description: "Connection test successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection test failed",
        variant: "destructive",
      });
    }
  };

  const handleInviteTeamMember = () => {
    // TODO: Implement team member invitation
    toast({
      title: "Feature Coming Soon",
      description: "Team member invitation will be available soon",
    });
  };

  const handleRoleChange = (memberId: number, newRole: string) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId ? { ...member, role: newRole as TeamMember["role"] } : member
      )
    );
    toast({
      title: "Success",
      description: "Team member role updated",
    });
  };

  const handleNotificationToggle = (notificationId: string, enabled: boolean) => {
    setNotifications(notifications =>
      notifications.map(notification =>
        notification.id === notificationId ? { ...notification, enabled } : notification
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your RecruitOS workspace
        </p>
      </div>

      {/* Settings Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger
                value="sync"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Sync Settings
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Team Management
              </TabsTrigger>
              <TabsTrigger
                value="general"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Sync Settings Tab */}
          <TabsContent value="sync" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Airtable Integration
                </h3>
                <Form {...syncForm}>
                  <form onSubmit={syncForm.handleSubmit(handleSyncSettings)} className="space-y-4">
                    <FormField
                      control={syncForm.control}
                      name="baseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your Airtable Base ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={syncForm.control}
                      name="tableName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Table Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Candidates" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Sync Frequency
                </h3>
                <Form {...syncForm}>
                  <FormField
                    control={syncForm.control}
                    name="syncFrequency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="manual" id="manual" />
                              <Label htmlFor="manual">Manual sync only</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="15min" id="15min" />
                              <Label htmlFor="15min">Every 15 minutes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1hour" id="1hour" />
                              <Label htmlFor="1hour">Every hour</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="daily" id="daily" />
                              <Label htmlFor="daily">Daily</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </div>

              <Separator />

              <div className="flex items-center justify-between pt-4">
                <Button onClick={syncForm.handleSubmit(handleSyncSettings)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Team Members</h3>
                <Button onClick={handleInviteTeamMember}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* General Settings Tab */}
          <TabsContent value="general" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Company Information
                </h3>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(handleGeneralSettings)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={generalForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Preferences</h3>
                <div className="space-y-4">
                  <Form {...generalForm}>
                    <FormField
                      control={generalForm.control}
                      name="autoMatching"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable candidate auto-matching</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="showPhotos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show candidate profile photos</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="enableReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable interview reminders</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Form>
                </div>
              </div>

              <Separator />

              <div className="pt-4">
                <Button onClick={generalForm.handleSubmit(handleGeneralSettings)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                      <Switch
                        checked={notification.enabled}
                        onCheckedChange={(enabled) =>
                          handleNotificationToggle(notification.id, enabled)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
