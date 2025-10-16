import { useState } from "react";
import { Button } from "../components/login/button";
import { Input } from "../components/login/input";
import { Label } from "../components/login/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/login/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/login/card";
// import { ImageWithFallback } from "../components/login/figma/ImageWithFallback";
import { Utensils, Star, TrendingUp } from "lucide-react";

export default function App() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic will be implemented with Supabase
    console.log("Login attempt:", { loginEmail, loginPassword });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic will be implemented with Supabase
    console.log("Signup attempt:", { signupName, signupEmail, signupPassword });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-orange-600 p-3 rounded-xl">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl text-blue-900">Bell-I</h1>
          </div>
          
          <h2 className="text-3xl mb-4 text-blue-900">Discover the Best Eats at UIUC</h2>
          <p className="text-xl text-gray-700 mb-8">
            Rate restaurants, share reviews, and find the most popular dishes on campus
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-700">Rate Your Favorites</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-700">View Top-Rated Restaurants & Dishes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login/Signup Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-orange-600 p-3 rounded-xl">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl text-orange-600">Bell-I</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to continue rating and reviewing restaurants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@illinois.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="text-sm text-orange-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Join Bell-I to start rating restaurants at UIUC
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@illinois.edu"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-gray-600 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}