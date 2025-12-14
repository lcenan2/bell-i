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
        <div className="container mx-auto flex items-center gap-3 px-4 py-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-orange-500">
            <ArrowLeft size={16} /> Back
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 m-0">{restaurant.name}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <section className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="!grid-rows-[auto] bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-orange-100">
              <div className="space-y-3">
                <CardTitle className="text-gray-900">{restaurant.name}</CardTitle>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-normal bg-orange-100 px-2.5 py-1 rounded-lg w-fit">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-900">
                      {stats.avg.toFixed(1)} ({stats.count})
                    </span>
                  </span>
                  <p className="text-sm text-gray-600 font-medium">{restaurant.cuisine}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full rounded-xl overflow-hidden h-64 md:h-96 max-h-96 shadow-md ring-1 ring-orange-200/50">
                <ImageWithFallback
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 bg-orange-50/40 px-4 py-3 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <MapPin size={16} className="text-orange-500" /> <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: restaurant.priceLevel }, (_, i) => (
                    <DollarSign key={i} size={16} className="text-orange-500" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-orange-100">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-gray-900">Community Averages</CardTitle>
                <p className="text-sm text-orange-700 font-medium bg-orange-100 px-2 py-1 rounded w-fit">Live ratings</p>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : stats.count === 0 ? (
                <p className="text-sm text-gray-500">No ratings yet—be the first!</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-600 w-8 text-right">{stats.taste.toFixed(1)}</span>
                    <span className="text-gray-600">Taste</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-600 w-8 text-right">{stats.price.toFixed(1)}</span>
                    <span className="text-gray-600">Price</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-600 w-8 text-right">{stats.location.toFixed(1)}</span>
                    <span className="text-gray-600">Location</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-600 w-8 text-right">{stats.environment.toFixed(1)}</span>
                    <span className="text-gray-600">Environment</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="!grid-rows-[auto] bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-orange-100">
              <div>
                <CardTitle className="text-gray-900">Menu</CardTitle>
                <p className="text-sm font-medium text-orange-700 mt-1">Rate your favorite dishes</p>
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
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-orange-100">
                <div className="flex flex-col gap-2 col-span-full">
                  <CardTitle className="text-gray-900">Good to know</CardTitle>
                  <p className="text-sm text-orange-700 font-medium bg-orange-100 px-2 py-1 rounded w-fit">Tips from the community</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {restaurant.goodToKnow.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="!grid-rows-[auto] bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-orange-100">
              <div>
                <CardTitle className="text-gray-900">{existingRating ? 'Edit Your Rating' : `Rate ${restaurant.name}`}</CardTitle>
                <p className="text-sm text-orange-700 mt-1 font-medium">
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
    <div className="border border-orange-100/60 rounded-xl overflow-visible hover:shadow-md hover:border-orange-200 transition-all duration-200 bg-white hover:bg-orange-50/30">
      <div className="relative w-full bg-gray-100" style={{ aspectRatio: '4/3' }}>
        <ImageWithFallback
          src={dish.photoUrl || ''}
          alt={dish.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-orange-100">
          <div className="flex items-center gap-1 justify-end">
            <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span className="font-semibold text-orange-900 text-sm">{avgRating.toFixed(1)}</span>
          </div>
          <div className="text-[11px] text-gray-600 text-right">
            {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="font-semibold text-sm text-gray-900 mb-2">{dish.name}</div>
          {dish.description && <div className="text-xs text-gray-600 line-clamp-2 mb-2">{dish.description}</div>}
          {displayPrice != null && <div className="text-xs font-medium text-orange-600">${displayPrice}</div>}
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">Your rating:</span>
          <select
            className="border border-orange-200 rounded px-2 py-1 text-xs bg-white hover:border-orange-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}★
              </option>
            ))}
          </select>
          <button
            className="ml-auto px-3 py-1 text-xs rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 font-medium transition-colors"
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
                  // Reset submitted state after a short delay for logged-in users
                  setTimeout(() => setSubmitted(false), 2000)
                }
                // For logged-out users, keep submitted state permanently
              } catch (error) {
                console.error('Error submitting rating:', error)
              }
            }}
          >
            {submitted ? (existingRating ? '✓ Updated' : '✓ Sent') : (existingRating ? 'Update' : 'Submit')}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
