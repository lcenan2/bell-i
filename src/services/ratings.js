// src/services/ratings.ts
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, } from "firebase/firestore";
export async function saveRating(r) {
    await addDoc(collection(db, "ratings"), {
        ...r,
        createdAt: serverTimestamp(),
    });
}
export async function fetchRatings(restaurantId) {
    const q = query(collection(db, "ratings"), where("restaurantId", "==", restaurantId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function fetchRatingsByUser(userId) {
    const q = query(collection(db, "ratings"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export function computeAverages(rs) {
    if (rs.length === 0) {
        return { avg: 0, taste: 0, price: 0, location: 0, environment: 0, count: 0 };
    }
    const sum = rs.reduce((a, r) => ({
        taste: a.taste + r.taste,
        price: a.price + r.price,
        location: a.location + r.location,
        environment: a.environment + r.environment,
    }), { taste: 0, price: 0, location: 0, environment: 0 });
    const count = rs.length;
    const taste = sum.taste / count;
    const price = sum.price / count;
    const location = sum.location / count;
    const environment = sum.environment / count;
    const avg = (taste + price + location + environment) / 4;
    return { avg, taste, price, location, environment, count };
}
