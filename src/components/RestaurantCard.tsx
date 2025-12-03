import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Stars } from '../components/Stars';
import { MapPin, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  imageUrl: string;
  location: string;
  onClick: () => void;
}

export function RestaurantCard({
  name,
  cuisine,
  rating,
  reviewCount,
  priceLevel,
  imageUrl,
  location,
  onClick
}: RestaurantCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h3 className="truncate text-base font-semibold">{name}</h3>

      <div className="aspect-video w-full overflow-hidden">
        <ImageWithFallback 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1">{name}</h3>
          <Badge variant="secondary">{cuisine}</Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="star-wrapper">
            <Stars rating={rating} size={16} />
          </div>
          <span className="text-sm text-gray-600">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            {Array.from({ length: priceLevel }, (_, i) => (
              <DollarSign key={i} size={14} className="text-green-600" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
