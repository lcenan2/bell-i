// src/services/dishRatings.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

export interface DishRating {
  id: string;
  dishId: string;
  restaurantId: string;
  value: number;      // 1..5
  createdAt: any;     // Firestore timestamp
  userId?: string;    // optional if you add auth
}

export interface DishStats {
  avg: number;
  count: number;
}

/**
 * Save a dish rating to Firebase
 */
export async function saveDishRating(params: {
  dishId: string;
  restaurantId: string;
  value: number;
  userId?: string;
}): Promise<void> {
  const value = Math.max(1, Math.min(5, Math.round(params.value)));
  await addDoc(collection(db, "dishRatings"), {
    dishId: params.dishId,
    restaurantId: params.restaurantId,
    value,
    userId: params.userId || null,
    createdAt: serverTimestamp(),
  });
}

/**
 * Fetch all ratings for a specific dish
 */
export async function fetchDishRatings(dishId: string): Promise<DishRating[]> {
  const q = query(collection(db, "dishRatings"), where("dishId", "==", dishId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DishRating));
}

/**
 * Fetch all ratings for all dishes in a restaurant
 */
export async function fetchDishRatingsForRestaurant(restaurantId: string): Promise<DishRating[]> {
  const q = query(collection(db, "dishRatings"), where("restaurantId", "==", restaurantId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DishRating));
}

/**
 * Get stats (average rating and count) for all dishes in a restaurant
 */
export function getDishStatsForRestaurant(ratings: DishRating[]): Record<string, DishStats> {
  const byDish = new Map<string, { sum: number; count: number }>();

  for (const r of ratings) {
    if (!byDish.has(r.dishId)) {
      byDish.set(r.dishId, { sum: 0, count: 0 });
    }
    const entry = byDish.get(r.dishId)!;
    entry.sum += r.value;
    entry.count += 1;
  }

  // lookup: dishId -> { avg, count }
  const result: Record<string, DishStats> = {};
  for (const [dishId, { sum, count }] of byDish.entries()) {
    result[dishId] = {
      avg: count ? sum / count : 0,
      count,
    };
  }
  return result;
}

/**
 * Subscribe to real-time updates for all dish ratings in a restaurant
 */
export function subscribeToDishRatings(
  restaurantId: string,
  onUpdate: (ratings: DishRating[]) => void
): Unsubscribe {
  const q = query(collection(db, "dishRatings"), where("restaurantId", "==", restaurantId));
  return onSnapshot(q, (snap) => {
    const ratings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DishRating));
    onUpdate(ratings);
  });
}

export function getAllDishRatings(): DishRating[] {
  // Deprecated: use fetchDishRatingsForRestaurant or subscribeToDishRatings instead
  return [];
}
  