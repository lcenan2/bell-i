import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { UtensilsCrossed, Star, MapPin, TrendingUp, Users, Award, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';


interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-white" size={24} />
              </div>
              <span className="text-xl">Bell-i</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors">
                Testimonials
              </a>
              <Button variant="ghost" onClick={onLogin}>
                Login
              </Button>
              <Button onClick={onGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6">
                Discover & Rate Your Favorite Restaurants
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find the best dining experiences near you. Share your reviews and help others discover amazing food.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={onGetStarted}>
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" onClick={onLogin}>
                  Sign In
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl text-orange-500 mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div>
                  <div className="text-3xl text-orange-500 mb-1">50K+</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div>
                  <div className="text-3xl text-orange-500 mb-1">25K+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0k3sbmnI7OsasK3Nfol5VhPfoErIf6kLjA&s"
                  alt="Restaurant dining"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Star className="text-orange-500" fill="currentColor" size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                    <div className="text-xl">4.8/5.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Choose Bell-i?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to discover and share amazing dining experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="text-orange-500" size={24} />
                </div>
                <CardTitle>Discover Restaurants</CardTitle>
                <CardDescription>
                  Search and filter thousands of restaurants by cuisine, rating, price, and location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="text-orange-500" size={24} />
                </div>
                <CardTitle>Rate & Review</CardTitle>
                <CardDescription>
                  Share your experiences with detailed ratings and reviews to help others make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="text-orange-500" size={24} />
                </div>
                <CardTitle>Find Nearby</CardTitle>
                <CardDescription>
                  Discover great restaurants in your area with location-based search and recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-orange-500" size={24} />
                </div>
                <CardTitle>Trending Spots</CardTitle>
                <CardDescription>
                  Stay updated with the hottest restaurants and trending dishes in your city
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-orange-500" size={24} />
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Join a community of food lovers sharing authentic reviews and recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-orange-500" size={24} />
                </div>
                <CardTitle>Verified Reviews</CardTitle>
                <CardDescription>
                  Read genuine reviews from real diners to make confident dining choices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                1
              </div>
              <h3 className="mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                2
              </div>
              <h3 className="mb-3">Explore Restaurants</h3>
              <p className="text-gray-600">
                Browse restaurants, read reviews, and check out menus.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                3
              </div>
              <h3 className="mb-3">Share Reviews</h3>
              <p className="text-gray-600">
                Rate your dining experience and help others discover great food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of food lovers who trust Bell-i
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill="currentColor" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Bell-i has completely changed how I discover new restaurants. The reviews are honest and helpful!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div>Sarah Johnson</div>
                    <div className="text-sm text-gray-500">Bell-i Blogger</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill="currentColor" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "I love how easy it is to find highly-rated restaurants near me. The app is super intuitive!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div>Michael Chen</div>
                    <div className="text-sm text-gray-500">Software Engineer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill="currentColor" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The community here is amazing. Real reviews from real people who love food as much as I do!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div>Emily Rodriguez</div>
                    <div className="text-sm text-gray-500">Marketing Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-white">Ready to Discover Amazing Food?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join Bell-i today and start exploring the best restaurants in your area
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onGetStarted}
            className="bg-white text-orange-500 hover:bg-gray-100"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="text-white" size={18} />
                </div>
                <span className="text-white">Bell-i</span>
              </div>
              <p className="text-sm">
                Discover and rate the best restaurants in your area.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2025 Bell-i. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
