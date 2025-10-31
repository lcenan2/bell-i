import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { UtensilsCrossed, Star, MapPin, TrendingUp, Users, Award, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onOpenRestaurant?: (id: string | number) => void;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;        // 0..5
  reviewCount: number;
  priceLevel: number;    // 1..4 as number of "$"
  imageUrl: string;
  location: string;
}

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burrito King',
    cuisine: 'Mexican',
    rating: 4.5,
    reviewCount: 127,
    priceLevel: 2,
    imageUrl: 'data:image/jpeg;base64,...(truncated for brevity)...',
    location: 'Champaign'
  },
  {
    id: '2',
    name: 'Chopstix',
    cuisine: 'Chinese',
    rating: 4.7,
    reviewCount: 203,
    priceLevel: 2,
    imageUrl: 'data:image/jpeg;base64,...(truncated for brevity)...',
    location: 'Champaign'
  },
  {
    id: '3',
    name: 'Jurrasic Grill',
    cuisine: 'American',
    rating: 4.3,
    reviewCount: 89,
    priceLevel: 2,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrSmXkxBih3yWh0eIhrFy_xOBu069fhhF5Iw&s',
    location: 'Champaign'
  },
];

function Price({ level }: { level: number }) {
  const clamped = Math.max(1, Math.min(4, level));
  return (
    <span aria-label={`${clamped} dollar signs`} className="text-sm">
      {'$'.repeat(clamped)}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  // Render 5 icons with half support
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            size={16}
            className={filled ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}
          />
        );
      })}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export function LandingPage({ onGetStarted, onLogin, onOpenRestaurant }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/90 backdrop-blur z-50" aria-label="Primary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2" aria-label="bell-i home">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-white" size={24} />
              </div>
              <span className="text-xl font-semibold">bell-i</span>
            </a>
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
              <Button variant="ghost" onClick={onLogin} aria-label="Login">
                Login
              </Button>
              <Button onClick={onGetStarted} aria-label="Get Started">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Discover & Rate Your Favorite Restaurants
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find the best dining experiences near you. Share your reviews and help others discover amazing food.
              </p>
              <div className="flex flex-wrap gap-4">
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
                  <div className="text-3xl text-orange-500 font-semibold mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div>
                  <div className="text-3xl text-orange-500 font-semibold mb-1">50K+</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div>
                  <div className="text-3xl text-orange-500 font-semibold mb-1">25K+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="data:image/jpeg;base64,...(hero preview)…"
                  alt="People enjoying food at a restaurant"
                  className="w-full h-[360px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white shadow-xl rounded-xl p-4 flex items-center gap-3">
                <Search />
                <div className="text-sm">
                  <div className="font-medium">Try: “best tacos”</div>
                  <div className="text-gray-500">near you</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-14" aria-labelledby="featured-heading">
        <div className="container mx-auto px-4">
          <h2 id="featured-heading" className="text-2xl font-semibold mb-6">Featured Restaurants</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(r => (
              <Card
                key={r.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onOpenRestaurant?.(r.id)}
                role="button"
                aria-label={`Open ${r.name}`}
                tabIndex={0}
              >
                <ImageWithFallback
                  src={r.imageUrl}
                  alt={`${r.name} cover`}
                  className="w-full h-44 object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{r.name}</span>
                    <Price level={r.priceLevel} />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin size={14} /> {r.location || 'Nearby'}
                    <span className="mx-2">•</span>
                    {r.cuisine}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <span className="text-sm text-gray-600">{r.reviewCount} reviews</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-orange-50/50">
        <div className="container mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <TrendingUp />
              <CardTitle>Smart Discovery</CardTitle>
              <CardDescription>Personalized picks based on your tastes.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users />
              <CardTitle>Real Reviews</CardTitle>
              <CardDescription>Trusted ratings from a foodie community.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Award />
              <CardTitle>Top Lists</CardTitle>
              <CardDescription>See what’s trending in your city.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Sign in or create a free account.</li>
            <li>Search by cuisine, price, or vibe.</li>
            <li>Rate places you try and share photos.</li>
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-orange-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>
          <p className="text-gray-700">“bell-i helped me find my favorite ramen spot in minutes.” — A happy user</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} bell-i. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
