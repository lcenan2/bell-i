export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    reviewCount: number;
    priceLevel: number; 
    imageUrl: string;
    location: string;
    likes: number;
    goodToKnow: string[];
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burrito King",
    cuisine: "Mexican",
    rating: 4.5,
    reviewCount: 127,
    priceLevel: 2,
    imageUrl: "/restaurant-images/burrito-king.jpeg",
    location: "408 E Green St, Champaign, IL 61820",
    likes: 0,
    goodToKnow: ["Open late", "Large portions", "Quick service"],
  },
  {
    id: "3",
    name: "Jurassic Grill",
    cuisine: "American",
    rating: 4.3,
    reviewCount: 89,
    priceLevel: 2,
    imageUrl: "/restaurant-images/jurassic-grill.jpeg",
    location: "404 E Green St, Champaign, IL 61820",
    likes: 0,
    goodToKnow: ["Late-night favorite", "Food trucks", "Free topings"],
  },
  {
    id: "2",
    name: "Chopstix",
    cuisine: "Chinese",
    rating: 3,
    reviewCount: 100, 
    priceLevel: 2,
    imageUrl: "/restaurant-images/chopstix.jpeg",
    location: "202 E Green St, Champaign, IL 61820",
    likes: 0,
    goodToKnow: ["Fast Chinese takeout", "Big portions", "Good value"],
  }, 
  {
        id: "4",
        name: "Mcdonalds",
        cuisine: "American",
        rating: 1,
        reviewCount: 100,
        priceLevel: 1,
        imageUrl: "/restaurant-images/mcdonalds.jpeg",
        location: "616 E Green St, Champaign, IL 61820",
        likes: 0,
        goodToKnow: ["Fast and reliable", "Cheap deals on the app", "Late-night options"],
    }, 
  {
        id: "5",
        name: "Sakanaya",
        cuisine: "Japanese",
        rating: 3,
        reviewCount: 100,
        priceLevel: 3,
        imageUrl: "/restaurant-images/sakanaya.jpeg",
        location: "403 E Green St, Champaign, IL 61820",
        likes: 0,
        goodToKnow: ["Fresh sushi", "Quality fish", "Slightly pricier"],
    }, 
    
];
