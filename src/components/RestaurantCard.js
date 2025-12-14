import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Stars } from '../components/Stars';
import { MapPin, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
export function RestaurantCard({ name, cuisine, rating, reviewCount, priceLevel, imageUrl, location, onClick }) {
    // Use a single default image for all restaurants so every card shows the same picture.
    // This avoids broken or missing images from external sources.
    const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop';
    const displayImage = DEFAULT_RESTAURANT_IMAGE;
    return (_jsxs(Card, { className: "overflow-hidden cursor-pointer hover:shadow-lg transition-shadow", onClick: onClick, children: [_jsx("h3", { className: "truncate text-base font-semibold", children: name }), _jsx("div", { className: "aspect-video w-full overflow-hidden", children: _jsx(ImageWithFallback, { src: displayImage, alt: name, className: "w-full h-full object-cover hover:scale-105 transition-transform duration-300" }) }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h3", { className: "flex-1", children: name }), _jsx(Badge, { variant: "secondary", children: cuisine })] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "star-wrapper", children: _jsx(Stars, { rating: rating, size: 16 }) }), _jsxs("span", { className: "text-sm text-gray-600", children: [rating.toFixed(1), " (", reviewCount, ")"] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 14 }), _jsx("span", { children: location })] }), _jsx("div", { className: "flex items-center", children: Array.from({ length: priceLevel }, (_, i) => (_jsx(DollarSign, { size: 14, className: "text-green-600" }, i))) })] })] })] }));
}
