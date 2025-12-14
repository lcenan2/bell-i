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
  doc,
  updateDoc,
} from "firebase/firestore";

export interface DishRating {
  id: string;
  dishId: string;
  restaurantId: string;
  value: number;      // 1..5
  createdAt: any;     // Firestore timestamp or number (local)
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

  // Also store a local copy so Profile Page can show
  // "Dish ratings (this device)" without requiring auth.
  try {
    const LOCAL_KEY = "belli:dishRatings";
    const prevRaw = localStorage.getItem(LOCAL_KEY);
    const prev: DishRating[] = prevRaw ? JSON.parse(prevRaw) : [];
    const localEntry: DishRating = {
      id: `local-${Date.now()}-${params.dishId}`,
      dishId: params.dishId,
      restaurantId: params.restaurantId,
      value,
      createdAt: Date.now(),
      userId: params.userId,
    };
    prev.push(localEntry);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prev));
  } catch (e) {
    // non-fatal
    console.warn("Failed to save local dish rating", e);
  }
}

/**
 * Update an existing dish rating
 */
export async function updateDishRating(ratingId: string, value: number): Promise<void> {
  const normalizedValue = Math.max(1, Math.min(5, Math.round(value)));
  const ratingRef = doc(db, "dishRatings", ratingId);
  await updateDoc(ratingRef, {
    value: normalizedValue,
  });

  // Also update the local copy so it's in sync
  try {
    const LOCAL_KEY = "belli:dishRatings";
    const prevRaw = localStorage.getItem(LOCAL_KEY);
    const prev: DishRating[] = prevRaw ? JSON.parse(prevRaw) : [];
    const index = prev.findIndex(r => r.id === ratingId);
    if (index !== -1) {
      prev[index].value = normalizedValue;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(prev));
    }
  } catch (e) {
    console.warn("Failed to update local dish rating", e);
  }
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
 * Fetch all dish ratings by a specific user
 */
export async function fetchDishRatingsByUser(userId: string): Promise<DishRating[]> {
  const q = query(collection(db, "dishRatings"), where("userId", "==", userId));
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
  // Read local-only dish ratings for this device.
  try {
    const LOCAL_KEY = "belli:dishRatings";
    const raw = localStorage.getItem(LOCAL_KEY);
    const arr: DishRating[] = raw ? JSON.parse(raw) : [];
    // Basic validation
    return Array.isArray(arr) ? arr.filter((r) => !!r && !!r.dishId && !!r.restaurantId) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch a user's rating for a specific dish
 */
export async function fetchUserDishRating(userId: string, dishId: string): Promise<(DishRating & { id: string }) | null> {
  const q = query(
    collection(db, "dishRatings"),
    where("userId", "==", userId),
    where("dishId", "==", dishId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as DishRating & { id: string };
}
  