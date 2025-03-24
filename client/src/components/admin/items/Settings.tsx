"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function Settings() {
  const [siteName, setSiteName] = useState("Codefolio")
  const [siteDescription, setSiteDescription] = useState("E-learning and mentorship platform for software engineers")
  const [siteEmail, setSiteEmail] = useState("admin@codefolio.com")
  const [sitePhone, setSitePhone] = useState("+1 (555) 123-4567")
  const [siteAddress, setSiteAddress] = useState("123 Tech Street, San Francisco, CA 94105")
  const [siteLogo, setSiteLogo] = useState("/placeholder.svg")
  const [siteFavicon, setSiteFavicon] = useState("/placeholder.svg")
  const [primaryColor, setPrimaryColor] = useState("#10b981")
  const [secondaryColor, setSecondaryColor] = useState("#6366f1")
  const [enableRegistration, setEnableRegistration] = useState(true)
  const [enableMentorRequests, setEnableMentorRequests] = useState(true)
  const [enableCourseReviews, setEnableCourseReviews] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [smtpHost, setSmtpHost] = useState("smtp.example.com")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUsername, setSmtpUsername] = useState("admin@codefolio.com")
  const [smtpPassword, setSmtpPassword] = useState("********")
  const [smtpEncryption, setSmtpEncryption] = useState("tls")
  const [paymentGateway, setPaymentGateway] = useState("stripe")
  const [stripePublicKey, setStripePublicKey] = useState("pk_test_***********************")
  const [stripeSecretKey, setStripeSecretKey] = useState("sk_test_***********************")
  const [paypalClientId, setPaypalClientId] = useState("client_id_***********************")
  const [paypalClientSecret, setPaypalClientSecret] = useState("client_secret_***********************")
  const [currency, setCurrency] = useState("usd")

  const handleSaveGeneralSettings = () => {
    // In a real app, you would save the settings to your backend
    console.log("Saving general settings...")
  }

  const handleSaveAppearanceSettings = () => {
    // In a real app, you would save the settings to your backend
    console.log("Saving appearance settings...")
  }

  const handleSaveEmailSettings = () => {
    // In a real app, you would save the settings to your backend
    console.log("Saving email settings...")
  }

  const handleSavePaymentSettings = () => {
    // In a real app, you would save the settings to your backend
    console.log("Saving payment settings...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general settings for your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-email">Contact Email</Label>
                  <Input
                    id="site-email"
                    type="email"
                    value={siteEmail}
                    onChange={(e) => setSiteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-phone">Contact Phone</Label>
                  <Input id="site-phone" value={sitePhone} onChange={(e) => setSitePhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-address">Address</Label>
                <Textarea
                  id="site-address"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  rows={2}
                />
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Platform Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-registration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register on the platform.</p>
                  </div>
                  <Switch
                    id="enable-registration"
                    checked={enableRegistration}
                    onCheckedChange={setEnableRegistration}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-mentor-requests">Enable Mentor Requests</Label>
                    <p className="text-sm text-muted-foreground">Allow users to submit mentor applications.</p>
                  </div>
                  <Switch
                    id="enable-mentor-requests"
                    checked={enableMentorRequests}
                    onCheckedChange={setEnableMentorRequests}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-course-reviews">Enable Course Reviews</Label>
                    <p className="text-sm text-muted-foreground">Allow users to leave reviews on courses.</p>
                  </div>
                  <Switch
                    id="enable-course-reviews"
                    checked={enableCourseReviews}
                    onCheckedChange={setEnableCourseReviews}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for important events.</p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-logo">Site Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={siteLogo || "/placeholder.svg"}
                        alt="Site Logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Input id="site-logo" type="file" className="max-w-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-favicon">Site Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={siteFavicon || "/placeholder.svg"}
                        alt="Site Favicon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Input id="site-favicon" type="file" className="max-w-sm" />
                  </div>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Color Scheme</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: primaryColor }} />
                    <Input
                      id="primary-color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: secondaryColor }} />
                    <Input
                      id="secondary-color"
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-md border p-4 cursor-pointer hover:border-emerald-500">
                  <div className="mb-2 h-32 rounded-md bg-white"></div>
                  <p className="text-center font-medium">Light</p>
                </div>
                <div className="rounded-md border p-4 cursor-pointer hover:border-emerald-500">
                  <div className="mb-2 h-32 rounded-md bg-gray-900"></div>
                  <p className="text-center font-medium">Dark</p>
                </div>
                <div className="rounded-md border p-4 cursor-pointer hover:border-emerald-500">
                  <div className="mb-2 h-32 rounded-md bg-gradient-to-b from-white to-gray-900"></div>
                  <p className="text-center font-medium">System</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAppearanceSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email settings for your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">SMTP Configuration</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">SMTP Username</Label>
                  <Input id="smtp-username" value={smtpUsername} onChange={(e) => setSmtpUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-encryption">Encryption</Label>
                  <Select value={smtpEncryption} onValueChange={setSmtpEncryption}>
                    <SelectTrigger id="smtp-encryption">
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Email Templates</h3>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Welcome Email</h4>
                  <p className="text-sm text-muted-foreground">Sent to new users when they register.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Course Enrollment</h4>
                  <p className="text-sm text-muted-foreground">Sent to users when they enroll in a course.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Password Reset</h4>
                  <p className="text-sm text-muted-foreground">Sent to users when they request a password reset.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Mentor Application</h4>
                  <p className="text-sm text-muted-foreground">
                    Sent to users when their mentor application is approved or rejected.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Edit Template
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveEmailSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment settings for your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-gateway">Payment Gateway</Label>
                <Select value={paymentGateway} onValueChange={setPaymentGateway}>
                  <SelectTrigger id="payment-gateway">
                    <SelectValue placeholder="Select payment gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">Stripe Configuration</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stripe-public-key">Public Key</Label>
                  <Input
                    id="stripe-public-key"
                    value={stripePublicKey}
                    onChange={(e) => setStripePublicKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret-key">Secret Key</Label>
                  <Input
                    id="stripe-secret-key"
                    type="password"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">PayPal Configuration</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input
                    id="paypal-client-id"
                    value={paypalClientId}
                    onChange={(e) => setPaypalClientId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-secret">Client Secret</Label>
                  <Input
                    id="paypal-client-secret"
                    type="password"
                    value={paypalClientSecret}
                    onChange={(e) => setPaypalClientSecret(e.target.value)}
                  />
                </div>
              </div>
              <Separator />
              <h3 className="text-lg font-medium">General Payment Settings</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="cad">CAD ($)</SelectItem>
                      <SelectItem value="aud">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePaymentSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

