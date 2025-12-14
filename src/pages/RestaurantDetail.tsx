import React, { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/Card'
import { Button } from '../components/Button'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { MapPin, Star, DollarSign, ArrowLeft } from 'lucide-react'
import RatingForm from '../components/RatingForm'
import { fetchRatings, saveRating, computeAverages } from '../services/ratings'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export function RestaurantDetails({ restaurant, onBack }: any) {
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState<any[]>([])
  const [menu, setMenu] = useState<any[]>([])

  const stats = useMemo(() => computeAverages(ratings), [ratings])

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      setLoading(true)
      try {
        const rs = await fetchRatings(restaurant.id)
        const menuItemsRef = collection(db, 'restaurants', restaurant.id, 'menuItems')
        const menuSnapshot = await getDocs(menuItemsRef)
        const menuData = menuSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        if (mounted) {
          setRatings(rs)
          setMenu(menuData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [restaurant.id])

  async function handleSubmit(values: any) {
    await saveRating({ restaurantId: restaurant.id, ...values })
    const rs = await fetchRatings(restaurant.id)
    setRatings(rs)
  }

  async function handleDishRate(menuItemId: string, value: number) {
    try {
      console.log(`Rating dish ${menuItemId} with ${value} stars`)
      alert('Dish rating saved! (Feature in progress)')
    } catch (error) {
      console.error('Error rating dish:', error)
    }
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
              <div className="w-full rounded-lg overflow-hidden h-64 md:h-96 max-h-96">
                <ImageWithFallback src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
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

          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>Rate your favorite dishes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading menu...</p>
              ) : menu.length === 0 ? (
                <p className="text-sm text-gray-500">No dishes yet for this restaurant.</p>
              ) : (
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {menu.map((dish) => (
                    <DishRow key={dish.id} dish={dish} onRate={handleDishRate} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

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
  )
}

function DishRow({ dish, onRate }: any) {
  const [value, setValue] = useState(5)
  return (
    <div className="border rounded-lg overflow-hidden">
      <ImageWithFallback src={dish.photoUrl} alt={dish.name} className="w-full h-32 object-cover" />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">{dish.name}</div>
            {dish.description && <div className="text-xs text-gray-600">{dish.description}</div>}
            {dish.priceCents && <div className="text-xs text-green-600 font-medium">${(dish.priceCents / 100).toFixed(2)}</div>}
          </div>
          <div className="text-xs text-gray-700 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{(dish.averageRating || 0).toFixed(1)}</span>
            </div>
            <div className="text-[11px] text-gray-500">{dish.ratingCount} rating{dish.ratingCount === 1 ? '' : 's'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span>Your rating:</span>
          <select className="border rounded px-1 py-[2px]" value={value} onChange={(e) => setValue(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <Button size="sm" className="ml-auto" onClick={() => onRate(dish.id, value)}>Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';


export interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onBack: () => void;
}

// Define the menu item type
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  priceCents?: number;
  photoUrl?: string;
  averageRating: number;
  ratingCount: number;
  likes: number;
}

export function RestaurantDetails({ restaurant, onBack }: RestaurantDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<any[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const stats = useMemo(() => computeAverages(ratings as any), [ratings]);

  // Fetch ratings and menu items from Firebase
  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      setLoading(true);
      
      try {
        // Fetch restaurant ratings
        const rs = await fetchRatings(restaurant.id);
        
        // Fetch menu items from Firebase
        const menuItemsRef = collection(db, 'restaurants', restaurant.id, 'menuItems');
        const menuSnapshot = await getDocs(menuItemsRef);
        
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];
        
        if (mounted) {
          setRatings(rs);
          setMenu(menuData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
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

  async function handleDishRate(menuItemId: string, value: number) {
    try {
      // Here you would save the dish rating to Firebase
      // For now, we'll just refresh the menu
      console.log(`Rating dish ${menuItemId} with ${value} stars`);
      // TODO: Implement dish rating save to Firebase
      alert('Dish rating saved! (Feature in progress)');
    } catch (error) {
      console.error('Error rating dish:', error);
    }
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
              <div className="w-full rounded-lg overflow-hidden h-64 md:h-96 max-h-96">
                <ImageWithFallback
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
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

          {/* Menu from Firebase */}
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>Rate your favorite dishes</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">Loading menu...</p>
                ) : menu.length === 0 ? (
                  <p className="text-sm text-gray-500">No dishes yet for this restaurant.</p>
                ) : (
                  
                  

                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      {menu.map((dish) => (
                        <DishRow key={dish.id} dish={dish} onRate={handleDishRate} />
                      ))}
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
  dish: MenuItem;
  onRate: (dishId: string, value: number) => void;
}

function DishRow({ dish, onRate }: DishRowProps) {
  const [value, setValue] = useState(5);

  return (
    <div className="border rounded-lg overflow-hidden">
      <ImageWithFallback
        src={dish.photoUrl}
        alt={dish.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">{dish.name}</div>
            {dish.description && (
              <div className="text-xs text-gray-600">{dish.description}</div>
            )}
            {dish.priceCents && (
              <div className="text-xs text-green-600 font-medium">
                ${(dish.priceCents / 100).toFixed(2)}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-700 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{dish.averageRating.toFixed(1)}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              {dish.ratingCount} rating{dish.ratingCount === 1 ? "" : "s"}
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