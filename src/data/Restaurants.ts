export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    reviewCount: number;
    priceLevel: number; 
    imageUrl: string;
    location: string;
}

export const restaurants: Restaurant[] = [
    {
      id: "1",
      name: "Burrito King",
      cuisine: "Mexican",
      rating: 4.5,
      reviewCount: 127,
      priceLevel: 2,
      imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1974&auto=format&fit=crop",
      location: "Downtown • 1.2 mi",
    },
    {
      id: "3",
      name: "Jurrasic Grill",
      cuisine: "American",
      rating: 4.3,
      reviewCount: 89,
      priceLevel: 2,
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrSmXkxBih3yWh0eIhrFy_xOBu069fhhF5Iw&s",
      location: "Riverside • 2.1 mi",
    },
];