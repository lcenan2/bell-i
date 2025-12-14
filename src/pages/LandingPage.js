import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { UtensilsCrossed, Star, MapPin, TrendingUp, Users, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useMemo, useState } from 'react';
const restaurants = [
    {
        id: '1',
        name: 'Burrito King',
        cuisine: 'Mexican',
        rating: 4.5,
        reviewCount: 127,
        priceLevel: 2,
        imageUrl: 'data:image/jpeg;base64,...(truncated for brevity)...',
        location: 'Champaign',
    },
    {
        id: '2',
        name: 'Chopstix',
        cuisine: 'Chinese',
        rating: 4.7,
        reviewCount: 203,
        priceLevel: 2,
        imageUrl: 'data:image/jpeg;base64,...(truncated for brevity)...',
        location: 'Champaign',
    },
    {
        id: '3',
        name: 'Jurrasic Grill',
        cuisine: 'American',
        rating: 4.3,
        reviewCount: 89,
        priceLevel: 2,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrSmXkxBih3yWh0eIhrFy_xOBu069fhhF5Iw&s',
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
    const [cuisineFilter, setCuisineFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all'); // 'all' or '1' | '2' | '3' | '4'
    const [minRating, setMinRating] = useState('0'); // '0', '3.5', '4', '4.5'
    // Unique cuisine list for the dropdown
    const cuisineOptions = useMemo(() => {
        const set = new Set();
        restaurants.forEach((r) => set.add(r.cuisine));
        return Array.from(set);
    }, []);
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter((r) => {
            if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) {
                return false;
            }
            if (priceFilter !== 'all' && r.priceLevel !== Number(priceFilter)) {
                return false;
            }
            if (Number(minRating) > 0 && r.rating < Number(minRating)) {
                return false;
            }
            return true;
        });
    }, [cuisineFilter, priceFilter, minRating]);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("nav", { className: "border-b sticky top-0 bg-white/90 backdrop-blur z-50", "aria-label": "Primary", children: _jsx("div", { className: "landing-container py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("a", { href: "#", className: "flex items-center gap-2", "aria-label": "bell-i home", children: [_jsx("div", { className: "w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center", children: _jsx(UtensilsCrossed, { className: "text-white", size: 24 }) }), _jsx("span", { className: "text-xl font-semibold", children: "bell-i" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "#features", className: "text-gray-700 hover:text-orange-500 transition-colors", children: "Features" }), _jsx("a", { href: "#testimonials", className: "text-gray-700 hover:text-orange-500 transition-colors", children: "Testimonials" }), isLoggedIn ? (
                                    // WHEN LOGGED IN: show profile entry
                                    _jsxs("div", { className: "flex items-center gap-2", children: [userName && (_jsxs("span", { className: "text-sm text-gray-700 hidden sm:inline", children: ["Hi, ", userName] })), _jsx(Button, { variant: "ghost", onClick: onOpenProfile, "aria-label": "Open profile and rating history", children: "Profile" }), _jsx(Button, { variant: "ghost", onClick: onLogout, "aria-label": "Logout", children: "Logout" })] })) : (
                                    // WHEN LOGGED OUT: show auth actions
                                    _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", onClick: onLogin, "aria-label": "Login", children: "Login" }), _jsx(Button, { onClick: onGetStarted, "aria-label": "Get Started", children: "Get Started" })] }))] })] }) }) }), _jsx("section", { className: "section bg-gradient-to-b from-orange-50 to-white", children: _jsx("div", { className: "landing-container", children: _jsx("div", { className: "grid md:grid-cols-2 gap-12 items-center", children: _jsxs("div", { className: "hero-text", children: [_jsx("h1", { className: "mb-6", children: "Discover & Rate Your Favorite Restaurants" }), _jsx("p", { className: "text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0", children: "Find the best dining experiences on UIUC campus. Share your reviews and help others discover amazing food." }), _jsxs("div", { className: "grid grid-cols-3 gap-6 mt-12", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "10K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Restaurants" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "50K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Reviews" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl text-orange-500 font-semibold mb-1", children: "25K+" }), _jsx("div", { className: "text-sm text-gray-600", children: "Users" })] })] })] }) }) }) }), _jsx("section", { className: "section", "aria-labelledby": "featured-heading", children: _jsxs("div", { className: "landing-container", children: [_jsxs("div", { className: "flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { id: "featured-heading", className: "section-title mb-1", children: "Featured Restaurants" }), _jsx("p", { className: "text-sm text-gray-500", children: "Filter by cuisine, price, and rating." })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Cuisine" }), _jsxs("select", { className: "border rounded-full px-3 py-1 text-sm", value: cuisineFilter, onChange: (e) => setCuisineFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All" }), cuisineOptions.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Price" }), _jsxs("select", { className: "border rounded-full px-3 py-1 text-sm", value: priceFilter, onChange: (e) => setPriceFilter(e.target.value), children: [_jsx("option", { value: "all", children: "Any" }), _jsx("option", { value: "1", children: "$" }), _jsx("option", { value: "2", children: "$$" }), _jsx("option", { value: "3", children: "$$$" }), _jsx("option", { value: "4", children: "$$$$" })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xs text-gray-500 mb-1", children: "Min rating" }), _jsxs("select", { className: "border rounded-full px-3 py-1 text-sm", value: minRating, onChange: (e) => setMinRating(e.target.value), children: [_jsx("option", { value: "0", children: "Any" }), _jsx("option", { value: "3.5", children: "3.5\u2605+" }), _jsx("option", { value: "4", children: "4.0\u2605+" }), _jsx("option", { value: "4.5", children: "4.5\u2605+" })] })] })] })] }), filteredRestaurants.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No restaurants match your filters yet." })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr", children: filteredRestaurants.map((r) => (_jsxs(Card, { className: "flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-lg transition-shadow", onClick: () => onOpenRestaurant?.(r.id), role: "button", "aria-label": `Open ${r.name}`, tabIndex: 0, children: [_jsx(ImageWithFallback, { src: r.imageUrl, alt: `${r.name} cover`, className: "w-full h-40 object-cover" }), _jsxs(CardHeader, { className: "px-4 pt-4 pb-2", children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: r.name }), _jsx(Price, { level: r.priceLevel })] }), _jsxs(CardDescription, { className: "mt-1 flex items-center gap-2 text-sm", children: [_jsx(MapPin, { size: 14 }), " ", r.location || 'Nearby', _jsx("span", { className: "mx-1", children: "\u2022" }), r.cuisine] })] }), _jsxs(CardContent, { className: "mt-auto flex items-center justify-between px-4 pb-4 pt-1", children: [_jsx(Stars, { rating: r.rating }), _jsxs("span", { className: "text-sm text-gray-600", children: [r.reviewCount, " reviews"] })] })] }, r.id))) }))] }) }), _jsx("section", { id: "features", className: "section-muted", children: _jsxs("div", { className: "landing-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(TrendingUp, {}), _jsx(CardTitle, { children: "Smart Discovery" }), _jsx(CardDescription, { children: "Personalized picks based on your tastes." })] }) }), _jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(Users, {}), _jsx(CardTitle, { children: "Real Reviews" }), _jsx(CardDescription, { children: "Trusted ratings from a foodie community." })] }) }), _jsx(Card, { children: _jsxs(CardHeader, { children: [_jsx(Award, {}), _jsx(CardTitle, { children: "Top Lists" }), _jsx(CardDescription, { children: "See what\u2019s trending in your city." })] }) })] }) }), _jsx("section", { id: "how-it-works", className: "section", children: _jsxs("div", { className: "landing-container", children: [_jsx("h2", { className: "section-title mb-6", children: "How It Works" }), _jsxs("ol", { className: "list-decimal pl-6 space-y-2 text-gray-700 text-left max-w-xl mx-auto", children: [_jsx("li", { children: "Sign in or create a free account." }), _jsx("li", { children: "Search by cuisine, price, or vibe." }), _jsx("li", { children: "Rate places you try and share photos." })] })] }) }), _jsx("section", { id: "testimonials", className: "section-muted", children: _jsxs("div", { className: "landing-container", children: [_jsx("h2", { className: "section-title mb-6", children: "Testimonials" }), _jsx("p", { className: "text-gray-700 text-center max-w-xl mx-auto", children: "\u201Cbell-i helped me find my dinner spot in minutes.\u201D \u2014 A happy user" })] }) }), _jsx("footer", { className: "py-10 border-t", children: _jsxs("div", { className: "landing-container text-center text-sm text-gray-600", children: ["\u00A9 ", new Date().getFullYear(), " bell-i. All rights reserved."] }) })] }));
}
