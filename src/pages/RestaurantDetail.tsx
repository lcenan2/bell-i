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
import { fetchRatings, saveRating, computeAverages, fetchReviewsWithComments, fetchUserRatingForRestaurant, updateRating } from '../services/ratings'
import { saveDishRating, subscribeToDishRatings, getDishStatsForRestaurant, fetchDishRatingsForRestaurant, fetchUserDishRating, updateDishRating } from '../services/dishRating'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { dishes as localDishes } from '../data/Dish'
import { ReviewsList } from '../components/ReviewsList'

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

export function RestaurantDetails({ restaurant, onBack, userId, username }: { restaurant: Restaurant; onBack: () => void; userId?: string; username?: string }) {
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [dishRatings, setDishRatings] = useState<any[]>([])
  const [existingRating, setExistingRating] = useState<any>(null)
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
        // Fetch reviews with comments
        const reviewData = await fetchReviewsWithComments(restaurant.id)
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

        // Check if user has already rated this restaurant
        let userRating = null
        if (userId) {
          userRating = await fetchUserRatingForRestaurant(userId, restaurant.id)
        }

        if (mounted) {
          setRatings(rs)
          setReviews(reviewData)
          setMenu(finalMenu)
          setExistingRating(userRating)
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
  }, [restaurant.id, userId])

  async function handleSubmit(values: any) {
    if (existingRating) {
      // Update existing rating
      await updateRating(existingRating.id, values)
    } else {
      // Create new rating
      await saveRating({
        restaurantId: restaurant.id,
        userId: userId,
        username: username,
        ...values,
      })
    }
    const rs = await fetchRatings(restaurant.id)
    setRatings(rs)
    // Refresh reviews to show the new comment if added
    const reviewData = await fetchReviewsWithComments(restaurant.id)
    setReviews(reviewData)
    // Update existing rating state
    if (userId) {
      const userRating = await fetchUserRatingForRestaurant(userId, restaurant.id)
      setExistingRating(userRating)
    }
  }

  async function handleDishRate(menuItemId: string, value: number) {
    try {
      // Check if user already has a rating for this dish
      let existingDishRating = null
      if (userId) {
        existingDishRating = await fetchUserDishRating(userId, menuItemId)
      }

      if (existingDishRating) {
        // Update existing rating
        await updateDishRating(existingDishRating.id, value)
        console.log(`Updated dish rating ${menuItemId} with ${value} stars`)
      } else {
        // Create new rating
        await saveDishRating({
          dishId: menuItemId,
          restaurantId: restaurant.id,
          value: value,
          userId: userId,
        })
        console.log(`Created new dish rating ${menuItemId} with ${value} stars`)
      }
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

      <main className="container mx-auto px-4 py-6 space-y-6">
        <section className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="!grid-rows-[auto]">
              <div>
                <div className="flex items-center justify-start gap-3 mb-1">
                  <CardTitle>{restaurant.name}</CardTitle>
                  <span className="flex items-center gap-2 text-sm font-normal">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>
                      {stats.avg.toFixed(1)} ({stats.count})
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full rounded-lg overflow-hidden h-64 md:h-96 max-h-96">
                <ImageWithFallback
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover object-top"
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
              <div className="flex items-center justify-start gap-3">
                <CardTitle>Community Averages</CardTitle>
                <p className="text-sm text-gray-500">Live from ratings</p>
              </div>
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
            <CardHeader className="!grid-rows-[auto]">
              <div>
                <CardTitle>Menu</CardTitle>
                <p className="text-sm font-medium text-gray-700 mt-1">Rate your favorite dishes</p>
              </div>
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
                      userId={userId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 col-span-full justify-start">
                  <CardTitle>Good to know</CardTitle>
                  <p className="text-sm text-gray-500">Tips from the community</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-gray-700">
                  {restaurant.goodToKnow.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="!grid-rows-[auto]">
              <div>
                <CardTitle>{existingRating ? 'Edit Your Rating' : `Rate ${restaurant.name}`}</CardTitle>
                <p className="text-sm text-gray-500 mt-6">
                  {existingRating ? 'Update your experience' : 'Share your experience'}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <RatingForm 
                onSubmit={handleSubmit} 
                busy={loading}
                initialValues={existingRating ? {
                  taste: existingRating.taste,
                  price: existingRating.price,
                  location: existingRating.location,
                  environment: existingRating.environment,
                  comment: existingRating.comment || '',
                } : undefined}
              />
            </CardContent>
          </Card>

          <div>
            <ReviewsList reviews={reviews} />
          </div>
        </section>
      </main>
    </div>
  )
}

function DishRow({ dish, dishStats, onRate, userId }: { dish: MenuItem; dishStats: DishStats; onRate: (dishId: string, value: number) => void; userId?: string }) {
  const [value, setValue] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [existingRating, setExistingRating] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Load user's existing rating for this dish
  useEffect(() => {
    async function loadExistingRating() {
      if (userId) {
        try {
          const rating = await fetchUserDishRating(userId, dish.id)
          if (rating) {
            setExistingRating(rating)
            setValue(rating.value)
          }
        } catch (error) {
          console.error('Error fetching user dish rating:', error)
        }
      }
      setLoading(false)
    }
    loadExistingRating()
  }, [userId, dish.id])

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
            disabled={submitted || loading}
            onClick={async () => {
              try {
                await onRate(dish.id, value)
                setSubmitted(true)
                // Reload existing rating after update
                if (userId) {
                  const rating = await fetchUserDishRating(userId, dish.id)
                  if (rating) {
                    setExistingRating(rating)
                  }
                }
                // Reset submitted state after a short delay
                setTimeout(() => setSubmitted(false), 2000)
              } catch (error) {
                console.error('Error submitting rating:', error)
              }
            }}
          >
            {submitted ? (existingRating ? 'Updated!' : 'Submitted!') : (existingRating ? 'Update' : 'Submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
