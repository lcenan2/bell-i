// src/pages/ProfilePage.tsx
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Star, MapPin, Clock } from "lucide-react";
import { RatingDoc, fetchRatingsByUser } from "../services/ratings";
import { DishRating, getAllDishRatings, fetchDishRatingsByUser } from "../services/dishRating";
import { restaurants as staticRestaurants } from "../data/Restaurants";
import { dishes as staticDishes } from "../data/Dish";

interface RestaurantMeta {
  id: string;
  name: string;
  location?: string;
}

interface DishMeta {
  id: string;
  name: string;
  restaurantId: string;
}

export interface ProfilePageProps {
  userId: string;
  userName: string;
  onBack?: () => void;
  onLogout?: () => Promise<void>;

  // Optional metadata so we can show names instead of raw IDs
  restaurants?: RestaurantMeta[];
  dishes?: DishMeta[];
}

export function ProfilePage({
  userId,
  userName,
  onBack,
  onLogout,
  restaurants = [],
  dishes = [],
}: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [restaurantRatings, setRestaurantRatings] = useState<RatingDoc[]>([]);
  const [dishRatings, setDishRatings] = useState<DishRating[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: log if onLogout is received
  console.log('ProfilePage received onLogout:', typeof onLogout, onLogout ? 'YES' : 'NO');

  const restaurantNameById = useMemo(() => {
    const map = new Map<string, RestaurantMeta>();
    const source = restaurants.length ? restaurants : staticRestaurants;
    for (const r of source) {
      map.set(r.id, r as RestaurantMeta);
    }
    return map;
  }, [restaurants]);

  const dishNameById = useMemo(() => {
    const map = new Map<string, DishMeta>();
    const source = dishes.length ? dishes : staticDishes;
    for (const d of source) {
      map.set(d.id, d as DishMeta);
    }
    return map;
  }, [dishes]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Fetch the current user's profile using their UID
    const fetchProfile = async () => {
      const profileRef = doc(db, "user_profiles", currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    async function load() {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      setLoading(true);
      try {
        // Use the current logged-in user's UID, not the userId prop
        const rs = await fetchRatingsByUser(currentUser.uid);
        setRestaurantRatings(rs);

        // Fetch user's dish ratings from Firestore instead of localStorage
        const dr = await fetchDishRatingsByUser(currentUser.uid);
        setDishRatings(dr);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(val: any): string {
    if (!val) return "";
    // Firestore Timestamp
    if (typeof val === "object" && "toDate" in val) {
      return (val as any).toDate().toLocaleString();
    }
    // number or string
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  }

  const totalRestaurantRatings = restaurantRatings.length;
  const totalDishRatings = dishRatings.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple top bar */}
      <nav className="border-b bg-white/90 backdrop-blur z-50">
        <div className="landing-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-gray-500">Profile</div>
              <div className="text-lg font-semibold">{userName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                Back to Discover
              </Button>
            )}
            {onLogout ? (
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            ) : (
              <span className="text-xs text-red-500 font-bold">⚠️ onLogout missing</span>
            )}
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="landing-container space-y-6">
          {/* Summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>
                Overview of your activity on bell-i.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Restaurant ratings</span>
                  <span className="font-semibold">
                    {totalRestaurantRatings}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dish ratings</span>
                  <span className="font-semibold">
                    {totalDishRatings}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History section - side by side */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Restaurant rating history */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Rating History</CardTitle>
                <CardDescription>
                  All restaurants you&apos;ve rated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="text-sm text-gray-500">Loading…</div>
                )}

                {!loading && restaurantRatings.length === 0 && (
                  <div className="text-sm text-gray-500">
                    You haven&apos;t rated any restaurants yet.
                  </div>
                )}

                {!loading && restaurantRatings.length > 0 && (
                  <ul className="space-y-3 text-sm">
                    {restaurantRatings
                      .slice()
                      .sort((a, b) => {
                        const da =
                          (a.createdAt as any)?.toMillis?.() ??
                          new Date(a.createdAt).getTime();
                        const db =
                          (b.createdAt as any)?.toMillis?.() ??
                          new Date(b.createdAt).getTime();
                        return db - da;
                      })
                      .map((r, idx) => {
                        const meta = restaurantNameById.get(r.restaurantId);
                        const name = meta?.name ?? `Restaurant ${r.restaurantId}`;
                        const loc = meta?.location;

                        const avg =
                          (r.taste + r.price + r.location + r.environment) / 4;

                        return (
                          <li
                            key={idx}
                            className="border border-gray-100 rounded-lg px-3 py-2 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{name}</div>
                              <div className="flex items-center gap-1">
                                <Star
                                  size={14}
                                  className="text-orange-500 fill-orange-500"
                                />
                                <span>{avg.toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                              {loc && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {loc}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatDate(r.createdAt)}
                              </span>
                            </div>
                            <div className="text-gray-600">
                              <span className="mr-2">
                                Taste: <strong>{r.taste}</strong>
                              </span>{" "}
                              <span className="mr-2">
                                Price: <strong>{r.price}</strong>
                              </span>{" "}
                              <span className="mr-2">
                                Location: <strong>{r.location}</strong>
                              </span>{" "}
                              <span>
                                Environment: <strong>{r.environment}</strong>
                              </span>
                            </div>
                            {r.comment && (
                              <div className="text-gray-700 italic">
                                “{r.comment}”
                              </div>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Dish rating history */}
            <Card>
              <CardHeader>
                <CardTitle>Dish Rating History</CardTitle>
                <CardDescription>
                  All dishes you&apos;ve rated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!loading && dishRatings.length === 0 && (
                  <div className="text-sm text-gray-500">
                    You haven&apos;t rated any dishes yet.
                  </div>
                )}

                {!loading && dishRatings.length > 0 && (
                  <ul className="space-y-3 text-sm">
                    {dishRatings
                      .slice()
                      .sort((a, b) => {
                        const da = (a.createdAt as any)?.toMillis?.() ?? new Date(a.createdAt).getTime();
                        const db = (b.createdAt as any)?.toMillis?.() ?? new Date(b.createdAt).getTime();
                        return db - da;
                      })
                      .map((dr) => {
                        const dishMeta = dishNameById.get(dr.dishId);
                        const restMeta = restaurantNameById.get(
                          dr.restaurantId
                        );
                        const dishName =
                          dishMeta?.name ?? `Dish ${dr.dishId}`;
                        const restName =
                          restMeta?.name ?? `Restaurant ${dr.restaurantId}`;

                        return (
                          <li
                            key={dr.id}
                            className="border border-gray-100 rounded-lg px-3 py-2 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{dishName}</div>
                                <div className="text-gray-500 text-xs">
                                  {restName}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star
                                  size={14}
                                  className="text-orange-500 fill-orange-500"
                                />
                                <span>{dr.value}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock size={12} />
                              {formatDate(dr.createdAt)}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
