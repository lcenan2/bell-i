import React from 'react';
import { Star } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Button } from './Button';

export type Dish = {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  averageRating: number;
  ratingCount: number;
  priceCents?: number;
};

export default function RecommendedDishes({
  dishes,
  onRate,
}: {
  dishes: Dish[];
  onRate?: (dishId: string, value: number) => void;
}) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">Recommended Dishes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((d) => (
          <div key={d.id} className="border rounded-lg overflow-hidden bg-white">
            {d.photoUrl ? (
              <ImageWithFallback
                src={d.photoUrl}
                alt={d.name}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center">No image</div>
            )}

            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{d.name}</div>
                  {d.description && <div className="text-xs text-gray-600">{d.description}</div>}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{d.averageRating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{d.ratingCount} rating{d.ratingCount === 1 ? '' : 's'}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" onClick={() => onRate && onRate(d.id, 5)}>Rate 5</Button>
                <Button variant="ghost" size="sm" onClick={() => onRate && onRate(d.id, 4)}>Rate 4</Button>
                <div className="ml-auto text-xs text-gray-600">{d.priceCents ? `$${(d.priceCents/100).toFixed(2)}` : ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
