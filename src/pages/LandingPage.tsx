import { Button } from '../components/Button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../components/Card';
import {UtensilsCrossed, Star, MapPin, TrendingUp, Users, Award, Search} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import React, {useMemo, useState} from 'react'
import { fetchRatings, computeAverages } from '../services/ratings';
export interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onOpenRestaurant?: (id: string | number) => void;
  isLoggedIn: boolean;
  onOpenProfile: () => void;
  userName?: string;
  onLogout?: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number; // 0..5
  reviewCount: number;
  priceLevel: number; // 1..4 as number of "$"
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
    imageUrl: '/restaurant-images/burrito-king.jpeg',
    location: 'Champaign',
  },
  {
    id: '2',
    name: 'Chopstix',
    cuisine: 'Chinese',
    rating: 4.7,
    reviewCount: 203,
    priceLevel: 2,
    imageUrl: '/restaurant-images/chopstix.jpeg',
    location: 'Champaign',
  },
  {
    id: '3',
    name: 'Jurrasic Grill',
    cuisine: 'American',
    rating: 4.3,
    reviewCount: 89,
    priceLevel: 2,
    imageUrl:
      '/restaurant-images/jurassic-grill.jpeg',
    location: 'Champaign',
  },
  {
    id: '4',
    name: "McDonald's",
    cuisine: 'American',
    rating: 0,
    reviewCount: 89,
    priceLevel: 1,
    imageUrl:
      '/restaurant-images/mcdonalds.jpeg',
    location: 'Champaign',
  },
  {
    id: '5',
    name: 'Sakanaya',
    cuisine: 'Japanese',
    rating: 0,
    reviewCount: 89,
    priceLevel: 3,
    imageUrl:
      '/restaurant-images/sakanaya.jpeg',
    location: 'Champaign',
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
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);

        return (
          <Star
            key={i}
            size={18}
            className={
              filled
                ? "text-orange-500 fill-current"   // ⭐ IMPORTANT
                : "text-gray-300"
            }
            fill={filled ? "currentColor" : "none"}  // ⭐ Safari fix
          />
        );
      })}
    </div>
  );
}

export function LandingPage({
  onGetStarted,
  onLogin,
  onOpenRestaurant,
  isLoggedIn,
  onOpenProfile,
  userName,
  onLogout
}: LandingPageProps) {
  console.log('LandingPage - isLoggedIn:', isLoggedIn, 'onLogout:', typeof onLogout);
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all'); // 'all' or '1' | '2' | '3' | '4'
  const [minRating, setMinRating] = useState<string>('0'); // '0', '3.5', '4', '4.5'

  // Unique cuisine list for the dropdown
  const cuisineOptions = useMemo(() => {
    const set = new Set<string>();
    restaurants.forEach((r) => set.add(r.cuisine));
    return Array.from(set);
  }, []);

  const [ratingStats, setRatingStats] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    let mounted = true;
    async function loadRatings() {
      try {
        const entries = await Promise.all(
          restaurants.map(async (r) => {
            const rs = await fetchRatings(r.id);
            return [r.id, computeAverages(rs)];
          })
        );
        if (!mounted) return;
        setRatingStats(Object.fromEntries(entries));
      } catch (err) {
        console.error('Error loading ratings for landing page', err);
      }
    }
    loadRatings();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredRestaurants = useMemo(() => {
    // First, filter according to the active filters
    const filtered = restaurants.filter((r) => {
      if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) {
        return false;
      }
      if (priceFilter !== 'all' && r.priceLevel !== Number(priceFilter)) {
        return false;
      }
      // Use dynamically computed averages from ratingStats when available
      const stats = ratingStats[r.id];
      const avg = stats && typeof stats.avg === 'number' && stats.count > 0 ? stats.avg : r.rating;
      if (Number(minRating) > 0 && avg < Number(minRating)) {
        return false;
      }
      return true;
    });

    // Then sort by overall rating descending (highest first). We don't mutate the
    // original `restaurants` array — we sort a shallow copy of the filtered list.
    return filtered.slice().sort((a, b) => {
      const aStats = ratingStats[a.id];
      const bStats = ratingStats[b.id];
      const aAvg = aStats && typeof aStats.avg === 'number' && aStats.count > 0 ? aStats.avg : a.rating;
      const bAvg = bStats && typeof bStats.avg === 'number' && bStats.count > 0 ? bStats.avg : b.rating;
      // Descending order: b - a
      if (bAvg === aAvg) return 0;
      return bAvg - aAvg;
    });
  }, [cuisineFilter, priceFilter, minRating, ratingStats]);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/90 backdrop-blur z-50" aria-label="Primary">
        <div className="landing-container py-4">
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
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors">
                Testimonials
              </a>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {userName && <span className="text-sm text-gray-700 hidden sm:inline">Hi, {userName}</span>}
                  <Button variant="ghost" onClick={onOpenProfile} aria-label="Open profile and rating history">
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={onLogout} aria-label="Logout">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={onLogin} aria-label="Login">
                    Login
                  </Button>
                  <Button onClick={onGetStarted} aria-label="Get Started">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-orange-50 to-white">
        <div className="landing-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="hero-text fade-in">
              <h1 className="mb-6">
                Discover &amp; Rate Your Favorite Restaurants
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Find the best dining experiences on UIUC campus. Share your reviews and
                help others discover amazing food.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 fade-in" style={{ animationDelay: '200ms' }}>
                <div className="text-center">
                  <div className="text-3xl text-orange-500 font-semibold mb-1">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-orange-500 font-semibold mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl text-orange-500 font-semibold mb-1">
                    25K+
                  </div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="section" aria-labelledby="featured-heading">
        <div className="landing-container">
          <div className="mb-6">
            <h2 id="featured-heading" className="section-title mb-1">
              Featured Restaurants
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Filter by cuisine, price, and rating.
            </p>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-3">
              {/* Cuisine filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Cuisine</label>
                <select
                  className="border rounded-md px-3 py-1 text-sm h-9 w-32 appearance-none bg-white"
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {cuisineOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Price</label>
                <select
                  className="border rounded-md px-3 py-1 text-sm h-9 w-24 appearance-none bg-white"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">Any</option>
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>
              </div>

              {/* Rating filter */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Min rating</label>
                <select
                  className="border rounded-md px-3 py-1 text-sm h-9 w-28 appearance-none bg-white"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="0">Any</option>
                  <option value="3.5">3.5★+</option>
                  <option value="4">4.0★+</option>
                  <option value="4.5">4.5★+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredRestaurants.length === 0 ? (
            <p className="text-sm text-gray-500">
              No restaurants match your filters yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {filteredRestaurants.map((r) => (
                <Card
                  key={r.id}
                  className="grid grid-cols-1 md:[grid-template-columns:160px_1fr] h-full overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-lg transition-shadow"
                  onClick={() => onOpenRestaurant?.(r.id)}
                  role="button"
                  aria-label={`Open ${r.name}`}
                  tabIndex={0}
                >
                  {/* IMAGE column (fixed width on md+) */}
                  <div
                    className="w-full overflow-hidden flex-shrink-0"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <ImageWithFallback
                      src={r.imageUrl}
                      alt={`${r.name} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* TEXT column */}
                  <div className="flex flex-col">
                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>{r.name}</span>
                        <Price level={r.priceLevel} />
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-sm">
                        <MapPin size={14} /> {r.location || 'Nearby'}
                        <span className="mx-1">•</span>
                        {r.cuisine}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-4 pt-1">
                      {(() => {
                        const stats = ratingStats[r.id];
                        const avg = stats && typeof stats.avg === 'number' && stats.count > 0 ? stats.avg : r.rating;
                        const count = stats && typeof stats.count === 'number' ? stats.count : r.reviewCount;
                        return (
                          <>
                            <div className="shrink-0">
                              <Stars rating={avg} />
                            </div>
                            <span className="text-sm text-gray-600">{count} reviews</span>
                          </>
                        );
                      })()}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-muted" style={{ scrollMarginTop: '300px' }}>
        <div className="landing-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <TrendingUp />
              <CardTitle>Trending Picks</CardTitle>
              <CardDescription>
                See what dishes and restaurants are top-rated right now.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users />
              <CardTitle>Real Reviews</CardTitle>
              <CardDescription>
                Trusted ratings from a foodie community.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Award />
              <CardTitle>Dish-Level Ratings</CardTitle>
              <CardDescription>
                Rate individual menu items, not just restaurants.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section">
        <div className="landing-container">
          <h2 className="section-title mb-6">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 text-left max-w-xl mx-auto">
            <li>Sign in or create a free account.</li>
            <li>Search by cuisine, price, or rating.</li>
            <li>Rate places you try and share your experience.</li>
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-muted">
        <div className="landing-container">
          <h2 className="section-title mb-6">Testimonials</h2>
          <p className="text-gray-700 text-center max-w-xl mx-auto">
            “bell-i helped me find a dinner spot in minutes.” — A happy
            user
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="landing-container text-center text-sm text-gray-600">
          © {new Date().getFullYear()} bell-i. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
