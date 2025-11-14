
export type ID = string;

export interface Dish {
  id: ID;
  restaurantId: ID;
  name: string;
  priceCents?: number;
  photoUrl?: string;
  description?: string;
  createdAt: number; // epoch ms
}

export interface DishFeedback { // both ratings & likes live here
  id: ID;
  dishId: ID;
  restaurantId: ID;
  userId: ID;
  rating?: number;   // 1..5 optional (likes have no rating)
  liked?: boolean;   // true if a "heart" click
  comment?: string;
  createdAt: number; // epoch ms for weekly windows
}

export interface DishStats { // computed client-side
  dishId: ID;
  restaurantId: ID;
  avgRating: number;   // 0..5
  ratingCount: number;
  likeCount: number;
  score: number;       // blended score we sort by
}

export const dishes: Dish[] = [
  // ----- Burrito King (restaurantId = "1") -----
  {
    id: "d1",
    restaurantId: "1",
    name: "Carne Asada Burrito",
    description: "Grilled steak, rice, beans, pico de gallo.",
    priceCents: 1299,
    photoUrl:
      "https://images.unsplash.com/photo-1601924582971-c7c3c5df63f0?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // ~6 days ago
  },
  {
    id: "d2",
    restaurantId: "1",
    name: "California Burrito",
    description: "Steak, fries, cheese, and salsa.",
    priceCents: 1399,
    photoUrl:
      "https://images.unsplash.com/photo-1625944520715-d2f1c4e6a2a5?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
  id: "d3",
    restaurantId: "1",
    name: "Chicken Quesadilla",
    description: "Large flour tortilla, grilled chicken, cheese.",
    priceCents: 999,
    photoUrl:
      "https://images.unsplash.com/photo-1598866215963-d5046ed6a9c0?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },

  // ----- Jurassic Grill (restaurantId = "3") -----
  {
    id: "d4",
    restaurantId: "3",
    name: "T-Rex Burger",
    description: "Half-pound patty, bacon, cheddar, grilled onions.",
    priceCents: 1499,
    photoUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "d5",
    restaurantId: "3",
    name: "Dino Nuggets",
    description: "Crispy, fun-shaped chicken nuggets.",
    priceCents: 799,
    photoUrl:
      "https://images.unsplash.com/photo-1626076383919-8e4f3fc2972b?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "d6",
    restaurantId: "3",
    name: "Volcano Wings",
    description: "Spicy buffalo wings with lava sauce.",
    priceCents: 1199,
    photoUrl:
      "https://images.unsplash.com/photo-1608032077016-c9c85c45aa5c?q=80&w=1974&auto=format&fit=crop",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];