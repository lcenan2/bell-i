import React, { useEffect, useMemo, useState } from 'react'
import type { Restaurant } from "../data/Restaurants";
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
import { saveDishRating, subscribeToDishRatings, getDishStatsForRestaurant, fetchDishRatingsForRestaurant } from '../services/dishRating'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { dishes as localDishes } from '../data/Dish'

interface MenuItem {
  id: string
  name: string
  description?: string
  priceCents?: number
  photoUrl?: string
  likes?: number
  averageRating?: number
  ratingCount?: number
}

interface DishStats {
  avg: number
  count: number
}

export function RestaurantDetails({ restaurant, onBack }: { restaurant: Restaurant; onBack: () => void }) {
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState<any[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [dishRatings, setDishRatings] = useState<any[]>([])
  const stats = useMemo(() => computeAverages(ratings), [ratings])
  const dishStats = useMemo(() => {
    const stats = getDishStatsForRestaurant(dishRatings)
    console.log('Updated dishStats:', stats)
    console.log('From dishRatings:', dishRatings)
    return stats
  }, [dishRatings])
  const sortedMenu = useMemo(() => {
    const sorted = [...menu].sort((a, b) => {
      const ratingA = dishStats[a.id]?.avg ?? 0
      const ratingB = dishStats[b.id]?.avg ?? 0
      console.log(`Comparing ${a.name} (${ratingA}) vs ${b.name} (${ratingB})`)
      // Sort by rating descending (highest first)
      if (ratingA !== ratingB) {
        return ratingB - ratingA
      }
      // Break ties alphabetically by name
      return a.name.localeCompare(b.name)
    })
    console.log('Final sorted menu:', sorted.map(d => ({ name: d.name, id: d.id, rating: dishStats[d.id]?.avg ?? 0 })))
    return sorted
  }, [menu, dishStats])

  // Subscribe to real-time dish rating updates and fetch initial ratings
  useEffect(() => {
    let mounted = true
    
    // First, fetch the existing ratings
    async function loadInitialRatings() {
      try {
        const initialRatings = await fetchDishRatingsForRestaurant(restaurant.id)
        if (mounted) {
          setDishRatings(initialRatings)
        }
      } catch (error) {
        console.error('Error fetching initial dish ratings:', error)
      }
    }
    
    loadInitialRatings()
    
    // Then subscribe to updates
    const unsubscribe = subscribeToDishRatings(restaurant.id, (ratings) => {
      if (mounted) {
        setDishRatings(ratings)
      }
    })
    
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [restaurant.id])

  // Fetch ratings and menu items from Firebase
  useEffect(() => {
    let mounted = true
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch restaurant ratings
        const rs = await fetchRatings(restaurant.id)
        // Fetch menu items from Firebase
        const menuItemsRef = collection(db, 'restaurants', restaurant.id, 'menuItems')
        const menuSnapshot = await getDocs(menuItemsRef)
        const menuData = menuSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[]

        // If local dishes exist for this restaurant and we're in development,
        // prefer them so edits to src/data/Dish.ts show immediately.
        const localForThis = (Array.isArray(localDishes) ? localDishes : [])
          .filter(d => String(d.restaurantId).trim() === String(restaurant.id).trim())

        const finalMenu: MenuItem[] = (localForThis.length > 0 && process.env.NODE_ENV !== 'production')
          ? localForThis.map(d => ({
            id: String(d.id),
            name: d.name,
            description: d.description || '',
            priceCents: d.priceCents || 0,
            photoUrl: d.photoUrl || '',
            likes: 0,
            averageRating: 0,
            ratingCount: 0,
          }))
          : menuData

        if (mounted) {
          setRatings(rs)
          setMenu(finalMenu)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [restaurant.id])

  async function handleSubmit(values: any) {
    await saveRating({
      restaurantId: restaurant.id,
      ...values,
    })
    const rs = await fetchRatings(restaurant.id)
    setRatings(rs)
  }

  async function handleDishRate(menuItemId: string, value: number) {
    try {
      await saveDishRating({
        dishId: menuItemId,
        restaurantId: restaurant.id,
        value: value,
      })
      console.log(`Rating dish ${menuItemId} with ${value} stars saved to Firebase`)
    } catch (error) {
      console.error('Error rating dish:', error)
      alert('Failed to save dish rating. Please try again.')
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
                <div className="grid sm:grid-cols-2 gap-4">
                  {sortedMenu.map((dish) => (
                    <DishRow
                      key={dish.id}
                      dish={dish}
                      dishStats={dishStats[dish.id] || { avg: 0, count: 0 }}
                      onRate={handleDishRate}
                    />
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

function DishRow({ dish, dishStats, onRate }: { dish: MenuItem; dishStats: DishStats; onRate: (dishId: string, value: number) => void }) {
  const [value, setValue] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  // Normalize price from either dollars (floats/ints) or cents (integers >= 100).
  const getDisplayPrice = (p?: number): string | null => {
    if (p == null) return null
    const num = Number(p)
    if (Number.isNaN(num)) return null
    // Non-integers are already dollars (e.g., 12.99)
    if (!Number.isInteger(num)) return num.toFixed(2)
    // Small integers (<100) are dollar values in seed data (e.g., 13 -> $13.00)
    if (Math.abs(num) < 100) return num.toFixed(2)
    // Larger integers are cents from Firestore (e.g., 1299 -> $12.99)
    return (num / 100).toFixed(2)
  }

  const displayPrice = getDisplayPrice(dish.priceCents)
  const avgRating = dishStats?.avg ?? 0
  const ratingCount = dishStats?.count ?? 0

  return (
    <div className="border rounded-lg overflow-hidden">
      <ImageWithFallback
        src={dish.photoUrl || ''}
        alt={dish.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">{dish.name}</div>
            {dish.description && <div className="text-xs text-gray-600">{dish.description}</div>}
            {displayPrice != null && <div className="text-xs text-green-600 font-medium">${displayPrice}</div>}
          </div>
          <div className="text-xs text-gray-700 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span>{avgRating.toFixed(1)}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              {ratingCount} rating{ratingCount === 1 ? '' : 's'}
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
          <button
            className="ml-auto px-3 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            disabled={submitted}
            onClick={async () => {
              try {
                await onRate(dish.id, value)
                setSubmitted(true)
              } catch (error) {
                console.error('Error submitting rating:', error)
              }
            }}
          >
            {submitted ? 'Submitted' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
