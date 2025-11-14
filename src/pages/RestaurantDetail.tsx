// src/pages/RestaurantDetail.tsx
import type { Restaurant } from "../data/Restaurants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { MapPin, Star, DollarSign, ArrowLeft } from "lucide-react";
import RatingForm from "../components/RatingForm";
import { fetchRatings, saveRating, computeAverages } from "../services/ratings";
import { useEffect, useMemo, useState } from "react";

// NEW imports for dishes:
import { dishes as allDishes } from "../data/Dish";
import { addDishRating, getDishStatsForRestaurant } from "../services/dishRating";

export interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function RestaurantDetails({ restaurant, onBack }: RestaurantDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<any[]>([]);
  const stats = useMemo(() => computeAverages(ratings as any), [ratings]);

  // --- new state for dish ratings ---
  const [dishStats, setDishStats] = useState<
    Record<string, { avg: number; count: number }>
  >({});

  // menu for this restaurant
  const menu = useMemo(
    () => allDishes.filter((d) => d.restaurantId === restaurant.id),
    [restaurant.id]
  );

  function refreshDishStats() {
    const s = getDishStatsForRestaurant(restaurant.id);
    setDishStats(s);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const rs = await fetchRatings(restaurant.id);
      if (mounted) {
        setRatings(rs);
        setLoading(false);
      }
      // load dish stats from localStorage
      refreshDishStats();
    })();
    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

  async function handleSubmit(values: {
    taste: number;
    price: number;
    location: number;
    environment: number;
    comment: string;
  }) {
    await saveRating({
      restaurantId: restaurant.id,
      ...values,
    });
    const rs = await fetchRatings(restaurant.id);
    setRatings(rs);
  }

  function handleDishRate(dishId: string, value: number) {
    addDishRating({ dishId, restaurantId: restaurant.id, value });
    refreshDishStats();
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
        {/* Left: hero + info + menu */}
        <section className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{restaurant.name}</span>
                <span className="flex items-center gap-2 text-sm font-normal">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>
                    {stats.avg.toFixed(1)} ({stats.count})
                  </span>
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

          {/* NEW: Menu (dishes) */}
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>Rate your favorite dishes</CardDescription>
            </CardHeader>
            <CardContent>
              {menu.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No dishes yet for this restaurant.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {menu.map((dish) => {
                    const stat = dishStats[dish.id] || { avg: 0, count: 0 };
                    return (
                      <DishRow
                        key={dish.id}
                        dish={dish}
                        avg={stat.avg}
                        count={stat.count}
                        onRate={handleDishRate}
                      />
                    );
                  })}
                </div>
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

interface DishRowProps {
  dish: {
    id: string;
    name: string;
    description?: string;
    priceCents?: number;
    photoUrl?: string;
  };
  avg: number;
  count: number;
  onRate: (dishId: string, value: number) => void;
}

function DishRow({ dish, avg, count, onRate }: DishRowProps) {
  const [value, setValue] = useState(5);

  return (
    <div className="border rounded-lg overflow-hidden">
      {dish.photoUrl && (
        <img
          src={dish.photoUrl}
          alt={dish.name}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">{dish.name}</div>
            {dish.description && (
              <div className="text-xs text-gray-600">{dish.description}</div>
            )}
          </div>
          <div className="text-xs text-gray-700 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{avg.toFixed(1)}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              {count} rating{count === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span>Your rating:</span>
          <select
            className="border rounded px-1 py-[2px]"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            className="ml-auto"
            onClick={() => onRate(dish.id, value)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
