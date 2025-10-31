import type { Restaurant } from "../data/Restaurants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { MapPin, Star, DollarSign, ArrowLeft } from "lucide-react";

export interface RestaurantDetailsProps {
  restaurant: Restaurant;       // << required
  onBack: () => void;           // << handler to go back
}

export function RestaurantDetails({ restaurant, onBack }: RestaurantDetailsProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <ImageWithFallback
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{restaurant.name}</span>
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" />
                {restaurant.rating.toFixed(1)} <span className="text-gray-500">({restaurant.reviewCount})</span>
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <MapPin size={16} /> {restaurant.location}
              </span>
              <span aria-hidden>•</span>
              <span>{restaurant.cuisine}</span>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1" aria-label={`Price level ${restaurant.priceLevel} of 4`}>
                {Array.from({ length: restaurant.priceLevel }).map((_, i) => <DollarSign key={i} size={14} />)}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="text-gray-700">
                Casual spot serving tasty {restaurant.cuisine.toLowerCase()} fare. Friendly service, quick bites,
                and a cozy atmosphere. Crowd favorites include signature burgers and milkshakes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Good to know</h3>
              <ul className="text-gray-700 list-disc pl-5 space-y-1">
                <li>Walk-ins welcome</li>
                <li>Family friendly</li>
                <li>Takeout available</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
