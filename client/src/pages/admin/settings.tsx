import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Settings, 
  Shield, 
  UserCheck, 
  Database, 
  MailCheck, 
  BellRing, 
  Save,
  Globe,
  RefreshCw,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  
  // Define general settings schema
  const generalSettingsSchema = z.object({
    siteName: z.string().min(2).max(50),
    siteDescription: z.string().max(200).optional(),
    contactEmail: z.string().email(),
    maintenanceMode: z.boolean().default(false),
    approvalRequired: z.boolean().default(true),
  });
  
  // Define security settings schema
  const securitySettingsSchema = z.object({
    twoFactorRequired: z.boolean().default(false),
    passwordMinLength: z.number().min(8).max(24),
    passwordExpiration: z.number().min(0).max(365),
    lockoutThreshold: z.number().min(0).max(10),
    sessionTimeout: z.number().min(5).max(1440),
  });
  
  // Define email settings schema
  const emailSettingsSchema = z.object({
    emailService: z.enum(["sendgrid", "mailgun", "smtp", "ses"]),
    senderName: z.string().min(2),
    senderEmail: z.string().email(),
    enableAdminNotifications: z.boolean().default(true),
    notifyOnNewUsers: z.boolean().default(true),
    notifyOnReports: z.boolean().default(true),
  });
  
  // Define all settings schema as a combination
  const allSettingsSchema = z.object({
    general: generalSettingsSchema,
    security: securitySettingsSchema,
    email: emailSettingsSchema,
  });
  
  type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
  type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;
  type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;
  
  // Setup forms for different settings sections
  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "PropertyDeals",
      siteDescription: "Real estate platform for off-market deals and investment opportunities.",
      contactEmail: "admin@propertydeals.com",
      maintenanceMode: false,
      approvalRequired: true,
    }
  });
  
  const securityForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactorRequired: false,
      passwordMinLength: 8,
      passwordExpiration: 90,
      lockoutThreshold: 5,
      sessionTimeout: 60,
    }
  });
  
  const emailForm = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      emailService: "sendgrid",
      senderName: "PropertyDeals",
      senderEmail: "notifications@propertydeals.com",
      enableAdminNotifications: true,
      notifyOnNewUsers: true,
      notifyOnReports: true,
    }
  });
  
  // Setup mutation for saving settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", "/api/admin/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Clear cache mutation
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/settings/clear-cache", {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Cache cleared",
        description: "Application cache has been cleared successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error clearing cache",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Function to handle form submission
  const onSubmitGeneral = (data: GeneralSettingsFormValues) => {
    saveSettingsMutation.mutate({ section: "general", ...data });
  };
  
  const onSubmitSecurity = (data: SecuritySettingsFormValues) => {
    saveSettingsMutation.mutate({ section: "security", ...data });
  };
  
  const onSubmitEmail = (data: EmailSettingsFormValues) => {
    saveSettingsMutation.mutate({ section: "email", ...data });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings and configurations
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="general" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <MailCheck className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic site configuration and options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form id="general-settings-form" onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of your platform as displayed to users
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Short description for SEO and meta tags
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Primary contact email for the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={generalForm.control}
                    name="approvalRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Role Approval Required</FormLabel>
                          <FormDescription>
                            Require admin approval for user role changes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Maintenance Mode</FormLabel>
                          <FormDescription>
                            Temporarily disable the site for maintenance
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="general-settings-form" 
                disabled={saveSettingsMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication and security options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form id="security-settings-form" onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="twoFactorRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Force all users to setup 2FA for their accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Password Length</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={8} 
                              max={24} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum required password length (8-24)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="passwordExpiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Expiration (Days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={365} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Days before password expires (0 for never)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="lockoutThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Lockout Threshold</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={10} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Failed login attempts before lockout (0 to disable)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (Minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={5} 
                              max={1440} 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Minutes of inactivity before session expiration
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="security-settings-form" 
                disabled={saveSettingsMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email service and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form id="email-settings-form" onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="emailService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Service Provider</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select email service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailgun">Mailgun</SelectItem>
                            <SelectItem value="smtp">Custom SMTP</SelectItem>
                            <SelectItem value="ses">Amazon SES</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Email service used for sending system emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={emailForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name that appears in the 'From' field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Email address used as the sender
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Admin Notification Settings</h3>
                    
                    <FormField
                      control={emailForm.control}
                      name="enableAdminNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Admin Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for important system events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="notifyOnNewUsers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New User Registrations</FormLabel>
                            <FormDescription>
                              Receive notifications when new users register
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!emailForm.watch("enableAdminNotifications")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="notifyOnReports"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">New Content Reports</FormLabel>
                            <FormDescription>
                              Receive notifications for user-reported content
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!emailForm.watch("enableAdminNotifications")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                form="email-settings-form" 
                disabled={saveSettingsMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>
                Database and system maintenance operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cache Management</CardTitle>
                    <CardDescription>
                      Clear application cache to refresh data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clearing the cache will refresh all data from the database and may temporarily slow down performance.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => clearCacheMutation.mutate()}
                      disabled={clearCacheMutation.isPending}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Database Management</CardTitle>
                    <CardDescription>
                      Run database optimization tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="db-vacuum">Run VACUUM</Label>
                        <Button id="db-vacuum" variant="outline" size="sm">
                          <Database className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="db-analyze">Run ANALYZE</Label>
                        <Button id="db-analyze" variant="outline" size="sm">
                          <Database className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-xs text-muted-foreground">
                      Last optimization: April 25, 2025
                    </p>
                  </CardFooter>
                </Card>
              </div>
              
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription className="text-red-500">
                    Critical system operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">Maintenance Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Put the site in maintenance mode to prevent user access
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="border-red-200">
                            <Power className="h-4 w-4 mr-2 text-red-500" />
                            {generalForm.watch("maintenanceMode") ? "Disable" : "Enable"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {generalForm.watch("maintenanceMode") 
                                ? "Disable maintenance mode?" 
                                : "Enable maintenance mode?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {generalForm.watch("maintenanceMode")
                                ? "This will make the site accessible to all users again."
                                : "This will make the site inaccessible to everyone except administrators."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                const newValue = !generalForm.watch("maintenanceMode");
                                generalForm.setValue("maintenanceMode", newValue);
                                saveSettingsMutation.mutate({
                                  section: "general",
                                  maintenanceMode: newValue,
                                });
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}