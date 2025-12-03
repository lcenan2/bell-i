import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { RestaurantCard } from './RestaurantCard';
export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'restaurant'));
                const restaurantData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRestaurants(restaurantData);
                setLoading(false);
            }
            catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to load restaurants');
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);
    // Convert priceRange string to number ($ = 1, $$ = 2, $$$ = 3)
    const getPriceLevel = (priceRange) => {
        if (!priceRange)
            return 2;
        return priceRange.length;
    };
    if (loading) {
        return (_jsx("div", { style: { padding: '40px', textAlign: 'center' }, children: _jsx("h2", { children: "Loading restaurants..." }) }));
    }
    if (error) {
        return (_jsx("div", { style: { padding: '40px', textAlign: 'center', color: 'red' }, children: _jsxs("h2", { children: ["Error: ", error] }) }));
    }
    return (_jsxs("div", { style: { padding: '40px', maxWidth: '1200px', margin: '0 auto' }, children: [_jsx("h1", { style: { fontSize: '32px', marginBottom: '10px' }, children: "Bell-I Restaurants" }), _jsxs("p", { style: { marginBottom: '30px', color: '#666' }, children: ["Found ", restaurants.length, " restaurants from Firebase"] }), _jsx("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }, children: restaurants.map(restaurant => (_jsx(RestaurantCard, { id: restaurant.id, name: restaurant.name, cuisine: restaurant.cuisine, rating: restaurant.averageRating || 0, reviewCount: restaurant.totalRatings || 0, priceLevel: getPriceLevel(restaurant.priceRange), imageUrl: restaurant.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image', location: restaurant.location, onClick: () => console.log('Clicked:', restaurant.name) }, restaurant.id))) })] }));
}
