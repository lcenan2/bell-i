import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { UtensilsCrossed, Star, MapPin, TrendingUp, Users, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import React, { useMemo, useState } from 'react';
import { fetchRatings, computeAverages } from '../services/ratings';
const restaurants = [
    {
        id: '1',
        name: 'Burrito King',
        cuisine: 'Mexican',
        rating: 4.5,
        reviewCount: 127,
        priceLevel: 2,
        imageUrl: '/restaurant-images/burrito-king.jpeg',
        location: 'Champaign',
    },
    {
        id: '2',
        name: 'Chopstix',
        cuisine: 'Chinese',
        rating: 4.7,
        reviewCount: 203,
        priceLevel: 2,
        imageUrl: '/restaurant-images/chopstix.jpeg',
        location: 'Champaign',
    },
    {
        id: '3',
        name: 'Jurrasic Grill',
        cuisine: 'American',
        rating: 4.3,
        reviewCount: 89,
        priceLevel: 2,
        imageUrl: '/restaurant-images/jurassic-grill.jpeg',
        location: 'Champaign',
    },
    {
        id: '4',
        name: "McDonald's",
        cuisine: 'American',
        rating: 0,
        reviewCount: 89,
        priceLevel: 1,
        imageUrl: '/restaurant-images/mcdonalds.jpeg',
        location: 'Champaign',
    },
    {
        id: '5',
        name: 'Sakanaya',
        cuisine: 'Japanese',
        rating: 0,
        reviewCount: 89,
        priceLevel: 3,
        imageUrl: '/restaurant-images/sakanaya.jpeg',
        location: 'Champaign',
    },
];
function Price({ level }) {
    const clamped = Math.max(1, Math.min(4, level));
    return (_jsx("span", { "aria-label": `${clamped} dollar signs`, className: "text-sm", children: '$'.repeat(clamped) }));
}
function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (_jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: 5 }).map((_, i) => {
            const filled = i < full || (i === full && half);
            return (_jsx(Star, { size: 18, className: filled
                    ? "text-orange-500 fill-current" // ⭐ IMPORTANT
                    : "text-gray-300", fill: filled ? "currentColor" : "none" }, i));
        }) }));
}
export function LandingPage({ onGetStarted, onLogin, onOpenRestaurant, isLoggedIn, onOpenProfile, userName, onLogout }) {
    console.log('LandingPage - isLoggedIn:', isLoggedIn, 'onLogout:', typeof onLogout);
    const [cuisineFilter, setCuisineFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all'); // 'all' or '1' | '2' | '3' | '4'
    const [minRating, setMinRating] = useState('0'); // '0', '3.5', '4', '4.5'
    // Unique cuisine list for the dropdown
    const cuisineOptions = useMemo(() => {
        const set = new Set();
        restaurants.forEach((r) => set.add(r.cuisine));
        return Array.from(set);
    }, []);
    const [ratingStats, setRatingStats] = React.useState({});
    React.useEffect(() => {
        let mounted = true;
        async function loadRatings() {
            try {
                const entries = await Promise.all(restaurants.map(async (r) => {
                    const rs = await fetchRatings(r.id);
                    return [r.id, computeAverages(rs)];
                }));
                if (!mounted)
                    return;
                setRatingStats(Object.fromEntries(entries));
            }
            catch (err) {
                console.error('Error loading ratings for landing page', err);
            }
        }
        loadRatings();
        return () => {
            mounted = false;
        };
    }, []);
    const filteredRestaurants = useMemo(() => {
        // First, filter according to the active filters
        const filtered = restaurants.filter((r) => {
            if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) {
                return false;
            }
            if (priceFilter !== 'all' && r.priceLevel !== Number(priceFilter)) {
                return false;
            }
            // Use dynamically computed averages from ratingStats when available
            const stats = ratingStats[r.id];
            const avg = stats && typeof stats.avg === 'number' && stats.count > 0 ? stats.avg : r.rating;
            if (Number(minRating) > 0 && avg < Number(minRating)) {
                return false;
            }
            return true;
        });
        // Then sort by overall rating descending (highest first). We don't mutate the
        // original `restaurants` array — we sort a shallow copy of the filtered list.
        return filtered.slice().sort((a, b) => {
            const aStats = ratingStats[a.id];
            const bStats = ratingStats[b.id];
            const aAvg = aStats && typeof aStats.avg === 'number' && aStats.count > 0 ? aStats.avg : a.rating;
            const bAvg = bStats && typeof bStats.avg === 'number' && bStats.count > 0 ? bStats.avg : b.rating;
            // Descending order: b - a
            if (bAvg === aAvg)
                return 0;
            return bAvg - aAvg;
        });
    }, [cuisineFilter, priceFilter, minRating, ratingStats]);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("nav", { className: "border-b sticky top-0 bg-white/90 backdrop-blur z-50", "aria-label": "Primary", children: _jsx("div", { className: "landing-container py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("a", { href: "#", className: "flex items-center gap-2", "aria-label": "bell-i home", children: [_jsx("div", { className: "w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center", children: _jsx(UtensilsCrossed, { className: "text-white", size: 24 }) }), _jsx("span", { className: "text-xl font-semibold", children: "bell-i" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "#features", className: "text-gray-700 hover:text-orange-500 transition-colors", children: "Features" }), _jsx("a", { href: "#testimonials", className: "text-gray-700 hover:text-orange-500 transition-colors", children: "Testimonials" }), isLoggedIn ? (_jsxs("div", { className: "flex items-center gap-2", children: [userName && _jsxs("span", { className: "text-sm text-gray-700 hidden sm:inline", children: ["Hi, ", userName] }), _jsx(Button, { variant: "ghost", onClick: onOpenProfile, "aria-label": "Open profile and rating history", children: "Profile" }), _jsx(Button, { variant: "ghost", onClick: onLogout, "aria-label": "Logout", children: "Logout" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", onClick: onLogin, "aria-label": "Login", children: "Login" }), _jsx(Button, { onClick: onGetStarted, "aria-label": "Get Started", children: "Get Started" })] }))] })] }) }) }), _jsx("section", { className: "section bg-gradient-to-b from-orange-50 to-white", children: _jsx("div", { className: "landing-container", children: _jsx("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: _jsxs("div", { className: "hero-text", children: [_jsx("h1", { className: "mb-6", children: "Discover & Rate Your Favorite Restaurants" }), _jsx("p", { className: "text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0", children: "Find the best dining experiences on UIUC campus. Share your reviews and help others discover amazing food." }), _jsxs("div", { className: "grid grid-cols-3 gap-6 mt-12", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "10K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Restaurants" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "50K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Reviews" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "25K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Users" })] })] })] }) }) }) }), _jsx("section", { className: "section", "aria-labelledby": "featured-heading", children: _jsxs("div", { className: "landing-container", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { id: "featured-heading", className: "section-title mb-1", children: "Featured Restaurants" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Filter by cuisine, price, and rating." }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Cuisine" }), _jsxs("select", { className: "border rounded-md px-3 py-1 text-sm h-9 w-32 appearance-none bg-white", value: cuisineFilter, onChange: (e) => setCuisineFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All" }), cuisineOptions.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Price" }), _jsxs("select", { className: "border rounded-md px-3 py-1 text-sm h-9 w-24 appearance-none bg-white", value: priceFilter, onChange: (e) => setPriceFilter(e.target.value), children: [_jsx("option", { value: "all", children: "Any" }), _jsx("option", { value: "1", children: "$" }), _jsx("option", { value: "2", children: "$$" }), _jsx("option", { value: "3", children: "$$$" }), _jsx("option", { value: "4", children: "$$$$" })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Min rating" }), _jsxs("select", { className: "border rounded-md px-3 py-1 text-sm h-9 w-28 appearance-none bg-white", value: minRating, onChange: (e) => setMinRating(e.target.value), children: [_jsx("option", { value: "0", children: "Any" }), _jsx("option", { value: "3.5", children: "3.5\u2605+" }), _jsx("option", { value: "4", children: "4.0\u2605+" }), _jsx("option", { value: "4.5", children: "4.5\u2605+" })] })] })] })] }), filteredRestaurants.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No restaurants match your filters yet." })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr", children: filteredRestaurants.map((r) => (_jsxs(Card, { className: "grid grid-cols-1 md:[grid-template-columns:160px_1fr] h-full overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-lg transition-shadow", onClick: () => onOpenRestaurant?.(r.id), role: "button", "aria-label": `Open ${r.name}`, tabIndex: 0, children: [_jsx("div", { className: "w-full overflow-hidden flex-shrink-0", style: { aspectRatio: '16/9' }, children: _jsx(ImageWithFallback, { src: r.imageUrl, alt: `${r.name} cover`, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsxs(CardHeader, { className: "px-4 pt-4 pb-2", children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: r.name }), _jsx(Price, { level: r.priceLevel })] }), _jsxs(CardDescription, { className: "mt-1 flex items-center gap-2 text-sm", children: [_jsx(MapPin, { size: 14 }), " ", r.location || 'Nearby', _jsx("span", { className: "mx-1", children: "\u2022" }), r.cuisine] })] }), _jsx(CardContent, { className: "mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-4 pt-1", children: (() => {
                                                    const stats = ratingStats[r.id];
                                                    const avg = stats && typeof stats.avg === 'number' && stats.count > 0 ? stats.avg : r.rating;
                                                    const count = stats && typeof stats.count === 'number' ? stats.count : r.reviewCount;
                                                    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "shrink-0", children: _jsx(Stars, { rating: avg }) }), _jsxs("span", { className: "text-sm text-gray-600", children: [count, " reviews"] })] }));
                                                })() })] })] }, r.id))) }))] }) }), _jsx("section", { id: "features", className: "section-muted", style: { scrollMarginTop: '300px' }, children: _jsxs("div", { className: "landing-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(TrendingUp, {}), _jsx(CardTitle, { children: "Trending Picks" }), _jsx(CardDescription, { children: "See what dishes and restaurants are top-rated right now." })] }) }), _jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(Users, {}), _jsx(CardTitle, { children: "Real Reviews" }), _jsx(CardDescription, { children: "Trusted ratings from a foodie community." })] }) }), _jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(Award, {}), _jsx(CardTitle, { children: "Dish-Level Ratings" }), _jsx(CardDescription, { children: "Rate individual menu items, not just restaurants." })] }) })] }) }), _jsx("section", { id: "how-it-works", className: "section", children: _jsxs("div", { className: "landing-container", children: [_jsx("h2", { className: "section-title mb-6", children: "How It Works" }), _jsxs("ol", { className: "list-decimal pl-6 space-y-2 text-gray-700 text-left max-w-xl mx-auto", children: [_jsx("li", { children: "Sign in or create a free account." }), _jsx("li", { children: "Search by cuisine, price, or rating." }), _jsx("li", { children: "Rate places you try and share your experience." })] })] }) }), _jsx("section", { id: "testimonials", className: "section-muted", children: _jsxs("div", { className: "landing-container", children: [_jsx("h2", { className: "section-title mb-6", children: "Testimonials" }), _jsx("p", { className: "text-gray-700 text-center max-w-xl mx-auto", children: "\u201Cbell-i helped me find a dinner spot in minutes.\u201D \u2014 A happy user" })] }) }), _jsx("footer", { className: "py-10 border-t", children: _jsxs("div", { className: "landing-container text-center text-sm text-gray-600", children: ["\u00A9 ", new Date().getFullYear(), " bell-i. All rights reserved."] }) })] }));
}
