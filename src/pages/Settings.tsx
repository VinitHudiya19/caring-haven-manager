
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  // Organization Settings
  const [organizationSettings, setOrganizationSettings] = useState({
    name: "CaringHaven Orphanage",
    email: "admin@caringhaven.org",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Cityville, State 12345",
    description: "CaringHaven is a non-profit organization dedicated to providing care, education, and support for orphaned children.",
    taxId: "12-3456789",
    website: "https://caringhaven.org",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    donationAlerts: true,
    monthlyReports: true,
    lowSupplyAlerts: false,
  });

  // Database Settings
  const [databaseSettings, setDatabaseSettings] = useState({
    host: "localhost",
    port: "3306",
    username: "admin",
    password: "********",
    database: "caringhaven_db",
  });

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrganizationSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatabaseSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveOrganization = () => {
    toast({
      title: "Settings Saved",
      description: "Organization settings have been updated.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Settings Saved",
      description: "Notification preferences have been updated.",
    });
  };

  const handleSaveDatabase = () => {
    toast({
      title: "Settings Saved",
      description: "Database connection settings have been updated.",
    });
  };

  return (
    <PageContainer title="Settings" description="Configure system settings and preferences">
      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 max-w-3xl">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization's information and profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={organizationSettings.name}
                    onChange={handleOrganizationChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={organizationSettings.email}
                    onChange={handleOrganizationChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={organizationSettings.phone}
                    onChange={handleOrganizationChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={organizationSettings.website}
                    onChange={handleOrganizationChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / Registration Number</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={organizationSettings.taxId}
                    onChange={handleOrganizationChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={organizationSettings.address}
                  onChange={handleOrganizationChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={organizationSettings.description}
                  onChange={handleOrganizationChange}
                />
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary-dark" onClick={handleSaveOrganization}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive system notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Donation Alerts</p>
                    <p className="text-sm text-gray-500">
                      Get notified when a new donation is received
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.donationAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("donationAlerts", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly Reports</p>
                    <p className="text-sm text-gray-500">
                      Receive automated monthly reports and statistics
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => handleNotificationChange("monthlyReports", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Supply Alerts</p>
                    <p className="text-sm text-gray-500">
                      Get notified when supplies are running low
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowSupplyAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("lowSupplyAlerts", checked)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary-dark" onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Configure your MySQL database connection settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Database Host</Label>
                  <Input
                    id="host"
                    name="host"
                    value={databaseSettings.host}
                    onChange={handleDatabaseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    name="port"
                    value={databaseSettings.port}
                    onChange={handleDatabaseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    name="database"
                    value={databaseSettings.database}
                    onChange={handleDatabaseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={databaseSettings.username}
                    onChange={handleDatabaseChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={databaseSettings.password}
                    onChange={handleDatabaseChange}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline">Test Connection</Button>
                <Button className="bg-primary hover:bg-primary-dark" onClick={handleSaveDatabase}>
                  Save Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Settings;
