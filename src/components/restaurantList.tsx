import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { RestaurantCard } from './RestaurantCard';

//testing firebase

interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  priceRange?: string;
  description?: string;
  averageRating?: number;
  totalRatings?: number;
  imageUrl?: string;
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurant'));
        const restaurantData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Restaurant[];
        
        setRestaurants(restaurantData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Convert priceRange string to number ($ = 1, $$ = 2, $$$ = 3)
  const getPriceLevel = (priceRange?: string): number => {
    if (!priceRange) return 2;
    return priceRange.length;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading restaurants...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Bell-I Restaurants</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Found {restaurants.length} restaurants from Firebase
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {restaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            cuisine={restaurant.cuisine}
            rating={restaurant.averageRating || 0}
            reviewCount={restaurant.totalRatings || 0}
            priceLevel={getPriceLevel(restaurant.priceRange)}
            imageUrl={restaurant.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
            location={restaurant.location}
            onClick={() => console.log('Clicked:', restaurant.name)}
          />
        ))}
      </div>
    </div>
  );
}