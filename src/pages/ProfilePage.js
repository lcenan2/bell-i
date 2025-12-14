import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ProfilePage.tsx
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "../components/Card";
import { Star, MapPin, Clock } from "lucide-react";
import { fetchRatingsByUser } from "../services/ratings";
import { getAllDishRatings } from "../services/dishRating";
export function ProfilePage({ userId, userName, onBack, onLogout, restaurants = [], dishes = [], }) {
    const [profile, setProfile] = useState(null);
    const [restaurantRatings, setRestaurantRatings] = useState([]);
    const [dishRatings, setDishRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    // Debug: log if onLogout is received
    console.log('ProfilePage received onLogout:', typeof onLogout, onLogout ? 'YES' : 'NO');
    const restaurantNameById = useMemo(() => {
        const map = new Map();
        for (const r of restaurants) {
            map.set(r.id, r);
        }
        return map;
    }, [restaurants]);
    const dishNameById = useMemo(() => {
        const map = new Map();
        for (const d of dishes) {
            map.set(d.id, d);
        }
        return map;
    }, [dishes]);
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser)
            return;
        // Fetch the current user's profile using their UID
        const fetchProfile = async () => {
            const profileRef = doc(db, "user_profiles", currentUser.uid);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
                setProfile(profileSnap.data());
            }
        };
        fetchProfile();
    }, []);
    useEffect(() => {
        async function load() {
            const currentUser = auth.currentUser;
            if (!currentUser)
                return;
            setLoading(true);
            try {
                // Use the current logged-in user's UID, not the userId prop
                const rs = await fetchRatingsByUser(currentUser.uid);
                setRestaurantRatings(rs);
                const dr = getAllDishRatings(); // all for this browser
                setDishRatings(dr);
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    function formatDate(val) {
        if (!val)
            return "";
        // Firestore Timestamp
        if (typeof val === "object" && "toDate" in val) {
            return val.toDate().toLocaleString();
        }
        // number or string
        const d = new Date(val);
        return isNaN(d.getTime()) ? "" : d.toLocaleString();
    }
    const totalRestaurantRatings = restaurantRatings.length;
    const totalDishRatings = dishRatings.length;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("nav", { className: "border-b bg-white/90 backdrop-blur z-50", children: _jsxs("div", { className: "landing-container py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-semibold", children: userName.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Profile" }), _jsx("div", { className: "text-lg font-semibold", children: userName })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [onBack && (_jsx(Button, { variant: "ghost", onClick: onBack, children: "Back to Discover" })), onLogout ? (_jsx(Button, { variant: "outline", onClick: onLogout, children: "Logout" })) : (_jsx("span", { className: "text-xs text-red-500 font-bold", children: "\u26A0\uFE0F onLogout missing" }))] })] }) }), _jsx("main", { className: "section", children: _jsxs("div", { className: "landing-container grid gap-6 lg:grid-cols-3", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Your Stats" }), _jsx(CardDescription, { children: "Overview of your activity on bell-i." })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3 text-sm text-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Restaurant ratings" }), _jsx("span", { className: "font-semibold", children: totalRestaurantRatings })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Dish ratings (this device)" }), _jsx("span", { className: "font-semibold", children: totalDishRatings })] })] }) })] }) }), _jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Restaurant Rating History" }), _jsx(CardDescription, { children: "All restaurants you've rated." })] }), _jsxs(CardContent, { children: [loading && (_jsx("div", { className: "text-sm text-gray-500", children: "Loading\u2026" })), !loading && restaurantRatings.length === 0 && (_jsx("div", { className: "text-sm text-gray-500", children: "You haven't rated any restaurants yet." })), !loading && restaurantRatings.length > 0 && (_jsx("ul", { className: "space-y-3 text-sm", children: restaurantRatings
                                                        .slice()
                                                        .sort((a, b) => {
                                                        const da = a.createdAt?.toMillis?.() ??
                                                            new Date(a.createdAt).getTime();
                                                        const db = b.createdAt?.toMillis?.() ??
                                                            new Date(b.createdAt).getTime();
                                                        return db - da;
                                                    })
                                                        .map((r, idx) => {
                                                        const meta = restaurantNameById.get(r.restaurantId);
                                                        const name = meta?.name ?? `Restaurant ${r.restaurantId}`;
                                                        const loc = meta?.location;
                                                        const avg = (r.taste + r.price + r.location + r.environment) / 4;
                                                        return (_jsxs("li", { className: "border border-gray-100 rounded-lg px-3 py-2 flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "font-semibold", children: name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { size: 14, className: "text-orange-500 fill-orange-500" }), _jsx("span", { children: avg.toFixed(1) })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-gray-500", children: [loc && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 12 }), loc] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), formatDate(r.createdAt)] })] }), _jsxs("div", { className: "text-gray-600", children: [_jsxs("span", { className: "mr-2", children: ["Taste: ", _jsx("strong", { children: r.taste })] }), _jsxs("span", { className: "mr-2", children: ["Price: ", _jsx("strong", { children: r.price })] }), _jsxs("span", { className: "mr-2", children: ["Location: ", _jsx("strong", { children: r.location })] }), _jsxs("span", { children: ["Environment: ", _jsx("strong", { children: r.environment })] })] }), r.comment && (_jsxs("div", { className: "text-gray-700 italic", children: ["\u201C", r.comment, "\u201D"] }))] }, idx));
                                                    }) }))] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Dish Rating History" }), _jsx(CardDescription, { children: "Dishes you've rated on this device." })] }), _jsxs(CardContent, { children: [!loading && dishRatings.length === 0 && (_jsx("div", { className: "text-sm text-gray-500", children: "You haven't rated any dishes yet." })), !loading && dishRatings.length > 0 && (_jsx("ul", { className: "space-y-3 text-sm", children: dishRatings
                                                        .slice()
                                                        .sort((a, b) => b.createdAt - a.createdAt)
                                                        .map((dr) => {
                                                        const dishMeta = dishNameById.get(dr.dishId);
                                                        const restMeta = restaurantNameById.get(dr.restaurantId);
                                                        const dishName = dishMeta?.name ?? `Dish ${dr.dishId}`;
                                                        const restName = restMeta?.name ?? `Restaurant ${dr.restaurantId}`;
                                                        return (_jsxs("li", { className: "border border-gray-100 rounded-lg px-3 py-2 flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: dishName }), _jsx("div", { className: "text-gray-500 text-xs", children: restName })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Star, { size: 14, className: "text-orange-500 fill-orange-500" }), _jsx("span", { children: dr.value })] })] }), _jsxs("div", { className: "flex items-center gap-1 text-gray-500", children: [_jsx(Clock, { size: 12 }), formatDate(dr.createdAt)] })] }, dr.id));
                                                    }) }))] })] })] })] }) })] }));
}
