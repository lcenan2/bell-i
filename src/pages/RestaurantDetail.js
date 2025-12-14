import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '../components/Card';
import { Button } from '../components/Button';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MapPin, Star, DollarSign, ArrowLeft } from 'lucide-react';
import RatingForm from '../components/RatingForm';
import { fetchRatings, saveRating, computeAverages } from '../services/ratings';
import { saveDishRating, subscribeToDishRatings, getDishStatsForRestaurant } from '../services/dishRating';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { dishes as localDishes } from '../data/Dish';
export function RestaurantDetails({ restaurant, onBack }) {
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState([]);
    const [menu, setMenu] = useState([]);
    const [dishRatings, setDishRatings] = useState([]);
    const stats = useMemo(() => computeAverages(ratings), [ratings]);
    const dishStats = useMemo(() => getDishStatsForRestaurant(dishRatings), [dishRatings]);
    // Subscribe to real-time dish rating updates
    useEffect(() => {
        const unsubscribe = subscribeToDishRatings(restaurant.id, (ratings) => {
            setDishRatings(ratings);
        });
        return () => unsubscribe();
    }, [restaurant.id]);
    // Fetch ratings and menu items from Firebase
    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch restaurant ratings
                const rs = await fetchRatings(restaurant.id);
                // Fetch menu items from Firebase
                const menuItemsRef = collection(db, 'restaurants', restaurant.id, 'menuItems');
                const menuSnapshot = await getDocs(menuItemsRef);
                const menuData = menuSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // If local dishes exist for this restaurant and we're in development,
                // prefer them so edits to src/data/Dish.ts show immediately.
                const localForThis = (Array.isArray(localDishes) ? localDishes : [])
                    .filter(d => String(d.restaurantId).trim() === String(restaurant.id).trim());
                const finalMenu = (localForThis.length > 0 && process.env.NODE_ENV !== 'production')
                    ? localForThis.map(d => ({
                        id: String(d.id),
                        name: d.name,
                        description: d.description || '',
                        priceCents: d.priceCents || 0,
                        photoUrl: d.photoUrl || '',
                        likes: 0,
                        averageRating: 0,
                        ratingCount: 0,
                    }))
                    : menuData;
                if (mounted) {
                    setRatings(rs);
                    setMenu(finalMenu);
                    setLoading(false);
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        }
        fetchData();
        return () => {
            mounted = false;
        };
    }, [restaurant.id]);
    async function handleSubmit(values) {
        await saveRating({
            restaurantId: restaurant.id,
            ...values,
        });
        const rs = await fetchRatings(restaurant.id);
        setRatings(rs);
    }
    async function handleDishRate(menuItemId, value) {
        try {
            await saveDishRating({
                dishId: menuItemId,
                restaurantId: restaurant.id,
                value: value,
            });
            console.log(`Rating dish ${menuItemId} with ${value} stars saved to Firebase`);
        }
        catch (error) {
            console.error('Error rating dish:', error);
            alert('Failed to save dish rating. Please try again.');
        }
    }
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx("header", { className: "sticky top-0 z-50 border-b bg-white", children: _jsxs("div", { className: "container mx-auto flex items-center gap-3 px-4 py-4", children: [_jsxs(Button, { variant: "ghost", onClick: onBack, className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { size: 16 }), " Back"] }), _jsx("h1", { className: "text-lg font-semibold", children: restaurant.name })] }) }), _jsxs("main", { className: "container mx-auto grid gap-6 px-4 py-6 md:grid-cols-3", children: [_jsxs("section", { className: "md:col-span-2 space-y-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: restaurant.name }), _jsxs("span", { className: "flex items-center gap-2 text-sm font-normal", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-400 fill-yellow-400" }), _jsxs("span", { children: [stats.avg.toFixed(1), " (", stats.count, ")"] })] })] }), _jsx(CardDescription, { children: restaurant.cuisine })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "w-full rounded-lg overflow-hidden h-64 md:h-96 max-h-96", children: _jsx(ImageWithFallback, { src: restaurant.imageUrl, alt: restaurant.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-gray-700", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 16 }), " ", _jsx("span", { children: restaurant.location })] }), _jsx("div", { className: "flex items-center", children: Array.from({ length: restaurant.priceLevel }, (_, i) => (_jsx(DollarSign, { size: 16, className: "text-green-600" }, i))) })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Community Averages" }), _jsx(CardDescription, { children: "Live from ratings" })] }), _jsx(CardContent, { children: loading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Loading\u2026" })) : stats.count === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No ratings yet\u2014be the first!" })) : (_jsxs("ul", { className: "grid gap-1 text-sm", children: [_jsxs("li", { children: ["Taste: ", stats.taste.toFixed(1)] }), _jsxs("li", { children: ["Price: ", stats.price.toFixed(1)] }), _jsxs("li", { children: ["Location: ", stats.location.toFixed(1)] }), _jsxs("li", { children: ["Environment: ", stats.environment.toFixed(1)] })] })) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Menu" }), _jsx(CardDescription, { children: "Rate your favorite dishes" })] }), _jsx(CardContent, { children: loading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Loading menu..." })) : menu.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No dishes yet for this restaurant." })) : (_jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: menu.map((dish) => (_jsx(DishRow, { dish: dish, dishStats: dishStats[dish.id] || { avg: 0, count: 0 }, onRate: handleDishRate }, dish.id))) })) })] })] }), _jsxs("aside", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: ["Rate ", restaurant.name] }), _jsx(CardDescription, { children: "Share your experience" })] }), _jsx(CardContent, { children: _jsx(RatingForm, { onSubmit: handleSubmit, busy: loading }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Good to know" }), _jsx(CardDescription, { children: "Tips from the community" })] }), _jsx(CardContent, { children: _jsxs("ul", { className: "list-disc space-y-1 pl-5 text-gray-700", children: [_jsx("li", { children: "Walk-ins welcome" }), _jsx("li", { children: "Family friendly" }), _jsx("li", { children: "Takeout available" })] }) })] })] })] })] }));
}
function DishRow({ dish, dishStats, onRate }) {
    const [value, setValue] = useState(5);
    // Normalize price from either dollars (floats/ints) or cents (integers >= 100).
    const getDisplayPrice = (p) => {
        if (p == null)
            return null;
        const num = Number(p);
        if (Number.isNaN(num))
            return null;
        // Non-integers are already dollars (e.g., 12.99)
        if (!Number.isInteger(num))
            return num.toFixed(2);
        // Small integers (<100) are dollar values in seed data (e.g., 13 -> $13.00)
        if (Math.abs(num) < 100)
            return num.toFixed(2);
        // Larger integers are cents from Firestore (e.g., 1299 -> $12.99)
        return (num / 100).toFixed(2);
    };
    const displayPrice = getDisplayPrice(dish.priceCents);
    const avgRating = dishStats?.avg ?? 0;
    const ratingCount = dishStats?.count ?? 0;
    return (_jsxs("div", { className: "border rounded-lg overflow-hidden", children: [_jsx(ImageWithFallback, { src: dish.photoUrl || '', alt: dish.name, className: "w-full h-64 object-cover" }), _jsxs("div", { className: "p-3 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sm", children: dish.name }), dish.description && _jsx("div", { className: "text-xs text-gray-600", children: dish.description }), displayPrice != null && _jsxs("div", { className: "text-xs text-green-600 font-medium", children: ["$", displayPrice] })] }), _jsxs("div", { className: "text-xs text-gray-700 text-right", children: [_jsxs("div", { className: "flex items-center gap-1 justify-end", children: [_jsx(Star, { className: "h-3 w-3 text-yellow-400 fill-yellow-400" }), _jsx("span", { children: avgRating.toFixed(1) })] }), _jsxs("div", { className: "text-[11px] text-gray-500", children: [ratingCount, " rating", ratingCount === 1 ? '' : 's'] })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx("span", { children: "Your rating:" }), _jsx("select", { className: "border rounded px-1 py-[2px]", value: value, onChange: (e) => setValue(Number(e.target.value)), children: [1, 2, 3, 4, 5].map((n) => (_jsx("option", { value: n, children: n }, n))) }), _jsx(Button, { size: "sm", className: "ml-auto", onClick: () => onRate(dish.id, value), children: "Submit" })] })] })] }));
}
