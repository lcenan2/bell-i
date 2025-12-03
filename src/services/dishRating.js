// src/services/dishRatings.ts
const STORAGE_KEY = "dishRatings";
function readAll() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function writeAll(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
export function addDishRating(params) {
    const all = readAll();
    const value = Math.max(1, Math.min(5, Math.round(params.value)));
    const record = {
        id: `dr_${all.length}_${Date.now()}`,
        dishId: params.dishId,
        restaurantId: params.restaurantId,
        value,
        createdAt: Date.now(),
    };
    all.push(record);
    writeAll(all);
}
export function getDishStatsForRestaurant(restaurantId) {
    const all = readAll().filter((r) => r.restaurantId === restaurantId);
    const byDish = new Map();
    for (const r of all) {
        if (!byDish.has(r.dishId)) {
            byDish.set(r.dishId, { sum: 0, count: 0 });
        }
        const entry = byDish.get(r.dishId);
        entry.sum += r.value;
        entry.count += 1;
    }
    // lookup: dishId -> { avg, count }
    const result = {};
    for (const [dishId, { sum, count }] of byDish.entries()) {
        result[dishId] = {
            avg: count ? sum / count : 0,
            count,
        };
    }
    return result;
}
export function getAllDishRatings() {
    return readAll();
}
