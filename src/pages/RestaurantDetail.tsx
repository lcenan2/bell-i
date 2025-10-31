// src/pages/RestaurantDetail.tsx
import type { Restaurant } from "../data/Restaurants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { MapPin, Star, DollarSign, ArrowLeft } from "lucide-react";
import RatingForm from "../components/RatingForm";
import { fetchRatings, saveRating, computeAverages } from "../services/ratings";
import { useEffect, useMemo, useState } from "react";

export interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function RestaurantDetails({ restaurant, onBack }: RestaurantDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<any[]>([]);
  const stats = useMemo(() => computeAverages(ratings as any), [ratings]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const rs = await fetchRatings(restaurant.id);
      if (mounted) {
        setRatings(rs);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

  async function handleSubmit(values: {
    taste: number; price: number; location: number; environment: number; comment: string;
  }) {
    await saveRating({
      restaurantId: restaurant.id,
      ...values,
    });
    // re-fetch to update averages
    const rs = await fetchRatings(restaurant.id);
    setRatings(rs);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
          <h1 className="text-lg font-semibold">{restaurant.name}</h1>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-4 py-6 md:grid-cols-3">
        {/* Left: hero + info */}
        <section className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{restaurant.name}</span>
                <span className="flex items-center gap-2 text-sm font-normal">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{stats.avg.toFixed(1)} ({stats.count})</span>
                </span>
              </CardTitle>
              <CardDescription>{restaurant.cuisine}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageWithFallback
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="h-64 w-full rounded-lg object-cover"
              />
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: restaurant.priceLevel }, (_, i) => (
                    <DollarSign key={i} size={16} className="text-green-600" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Averages</CardTitle>
              <CardDescription>Live from ratings</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : stats.count === 0 ? (
                <p className="text-sm text-gray-500">No ratings yet—be the first!</p>
              ) : (
                <ul className="grid gap-1 text-sm">
                  <li>Taste: {stats.taste.toFixed(1)}</li>
                  <li>Price: {stats.price.toFixed(1)}</li>
                  <li>Location: {stats.location.toFixed(1)}</li>
                  <li>Environment: {stats.environment.toFixed(1)}</li>
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Right: rating form */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate {restaurant.name}</CardTitle>
              <CardDescription>Share your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingForm onSubmit={handleSubmit} busy={loading} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
              <CardDescription>Tips from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                <li>Walk-ins welcome</li>
                <li>Family friendly</li>
                <li>Takeout available</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

