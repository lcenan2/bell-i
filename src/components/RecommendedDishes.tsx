import React from 'react'
import { ImageWithFallback } from './ImageWithFallback'
import { Star } from 'lucide-react'

interface RecommendedDishesProps {
  dishes: Array<any>
  onRate: (dishId: string, value: number) => void
}

export default function RecommendedDishes() {
  // Disabled: prefer the full menu list with dropdown ratings (DishRow).
  return null
}
