import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
// Mock Firestore
jest.mock('firebase/firestore');
const db = getFirestore();
describe('Firebase Firestore Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Restaurant Operations', () => {
        test('should add a new restaurant to Firestore', async () => {
            const mockRestaurant = {
                name: 'Kams',
                location: '618 E Daniel St',
                ratings: { taste: 0, price: 0, location: 0, environment: 0 },
                totalLikes: 0
            };
            const mockDocRef = { id: 'restaurant-123' };
            addDoc.mockResolvedValue(mockDocRef);
            const restaurantsCollection = collection(db, 'restaurants');
            const result = await addDoc(restaurantsCollection, mockRestaurant);
            expect(addDoc).toHaveBeenCalledWith(restaurantsCollection, mockRestaurant);
            expect(result.id).toBe('restaurant-123');
        });
        test('should fetch all restaurants from Firestore', async () => {
            const mockRestaurants = [
                { id: '1', data: () => ({ name: 'Kams', location: '618 E Daniel St' }) },
                { id: '2', data: () => ({ name: 'Kohinoor', location: '1301 S Busey Ave' }) }
            ];
            getDocs.mockResolvedValue({
                docs: mockRestaurants,
                empty: false,
                size: 2
            });
            const restaurantsCollection = collection(db, 'restaurants');
            const snapshot = await getDocs(restaurantsCollection);
            expect(getDocs).toHaveBeenCalledWith(restaurantsCollection);
            expect(snapshot.docs.length).toBe(2);
            expect(snapshot.docs[0].data().name).toBe('Kams');
        });
        test('should fetch a single restaurant by ID', async () => {
            const mockRestaurant = {
                name: 'Kams',
                location: '618 E Daniel St',
                ratings: { taste: 4.5, price: 3.0 }
            };
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockRestaurant,
                id: 'restaurant-123'
            });
            const docRef = doc(db, 'restaurants', 'restaurant-123');
            const docSnap = await getDoc(docRef);
            expect(getDoc).toHaveBeenCalledWith(docRef);
            expect(docSnap.exists()).toBe(true);
            if (docSnap.exists()) {
                expect(docSnap.data().name).toBe('Kams');
            }
        });
        test('should return null for non-existent restaurant', async () => {
            getDoc.mockResolvedValue({
                exists: () => false,
                data: () => undefined
            });
            const docRef = doc(db, 'restaurants', 'non-existent');
            const docSnap = await getDoc(docRef);
            expect(docSnap.exists()).toBe(false);
        });
        test('should update restaurant ratings', async () => {
            updateDoc.mockResolvedValue(undefined);
            const docRef = doc(db, 'restaurants', 'restaurant-123');
            const updates = {
                'ratings.taste': 4.5,
                'ratings.price': 3.5,
                totalLikes: 42
            };
            await updateDoc(docRef, updates);
            expect(updateDoc).toHaveBeenCalledWith(docRef, updates);
        });
        test('should delete a restaurant', async () => {
            deleteDoc.mockResolvedValue(undefined);
            const docRef = doc(db, 'restaurants', 'restaurant-123');
            await deleteDoc(docRef);
            expect(deleteDoc).toHaveBeenCalledWith(docRef);
        });
    });
    describe('Menu Items Operations', () => {
        test('should add a menu item to a restaurant', async () => {
            const mockMenuItem = {
                restaurantId: 'restaurant-123',
                name: 'Chicken Tikka Masala',
                likes: 0,
                ratings: []
            };
            const mockDocRef = { id: 'menu-item-456' };
            addDoc.mockResolvedValue(mockDocRef);
            const menuItemsCollection = collection(db, 'menuItems');
            const result = await addDoc(menuItemsCollection, mockMenuItem);
            expect(addDoc).toHaveBeenCalledWith(menuItemsCollection, mockMenuItem);
            expect(result.id).toBe('menu-item-456');
        });
        test('should fetch top menu items for a restaurant', async () => {
            const mockMenuItems = [
                { id: '1', data: () => ({ name: 'Chicken Tikka', likes: 100 }) },
                { id: '2', data: () => ({ name: 'Naan', likes: 85 }) }
            ];
            getDocs.mockResolvedValue({
                docs: mockMenuItems,
                empty: false,
                size: 2
            });
            const menuItemsCollection = collection(db, 'menuItems');
            const q = query(menuItemsCollection, where('restaurantId', '==', 'restaurant-123'), orderBy('likes', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            expect(snapshot.docs.length).toBe(2);
            expect(snapshot.docs[0].data().likes).toBe(100);
        });
        test('should update menu item likes', async () => {
            updateDoc.mockResolvedValue(undefined);
            const docRef = doc(db, 'menuItems', 'menu-item-456');
            await updateDoc(docRef, { likes: 101 });
            expect(updateDoc).toHaveBeenCalledWith(docRef, { likes: 101 });
        });
    });
    describe('User Ratings Operations', () => {
        test('should add a user rating for a restaurant', async () => {
            const mockRating = {
                userId: 'user-789',
                restaurantId: 'restaurant-123',
                ratings: {
                    taste: 5,
                    price: 4,
                    location: 5,
                    environment: 4
                },
                timestamp: new Date()
            };
            const mockDocRef = { id: 'rating-999' };
            addDoc.mockResolvedValue(mockDocRef);
            const ratingsCollection = collection(db, 'ratings');
            const result = await addDoc(ratingsCollection, mockRating);
            expect(addDoc).toHaveBeenCalledWith(ratingsCollection, mockRating);
            expect(result.id).toBe('rating-999');
        });
        test('should fetch user ratings history', async () => {
            const mockRatings = [
                { id: '1', data: () => ({ restaurantId: 'restaurant-123', ratings: { taste: 5 } }) },
                { id: '2', data: () => ({ restaurantId: 'restaurant-456', ratings: { taste: 4 } }) }
            ];
            getDocs.mockResolvedValue({
                docs: mockRatings,
                empty: false,
                size: 2
            });
            const ratingsCollection = collection(db, 'ratings');
            const q = query(ratingsCollection, where('userId', '==', 'user-789'));
            const snapshot = await getDocs(q);
            expect(snapshot.docs.length).toBe(2);
        });
    });
    describe('User Profile Operations', () => {
        test('should create user profile document', async () => {
            const mockUserProfile = {
                uid: 'user-789',
                email: 'test@illinois.edu',
                displayName: 'Test User',
                likedRestaurants: [],
                likedMenuItems: [],
                createdAt: new Date()
            };
            const mockDocRef = { id: 'user-789' };
            addDoc.mockResolvedValue(mockDocRef);
            const usersCollection = collection(db, 'users');
            const result = await addDoc(usersCollection, mockUserProfile);
            expect(addDoc).toHaveBeenCalledWith(usersCollection, mockUserProfile);
        });
        test('should fetch user profile', async () => {
            const mockProfile = {
                uid: 'user-789',
                email: 'test@illinois.edu',
                likedRestaurants: ['restaurant-123'],
                likedMenuItems: ['menu-item-456']
            };
            getDoc.mockResolvedValue({
                exists: () => true,
                data: () => mockProfile,
                id: 'user-789'
            });
            const docRef = doc(db, 'users', 'user-789');
            const docSnap = await getDoc(docRef);
            expect(docSnap.exists()).toBe(true);
            if (docSnap.exists()) {
                expect(docSnap.data().email).toBe('test@illinois.edu');
            }
        });
        test('should update user liked restaurants', async () => {
            updateDoc.mockResolvedValue(undefined);
            const docRef = doc(db, 'users', 'user-789');
            await updateDoc(docRef, {
                likedRestaurants: ['restaurant-123', 'restaurant-456']
            });
            expect(updateDoc).toHaveBeenCalledWith(docRef, {
                likedRestaurants: ['restaurant-123', 'restaurant-456']
            });
        });
    });
    describe('Leaderboard Operations', () => {
        test('should fetch top rated dishes of the week', async () => {
            const mockDishes = [
                { id: '1', data: () => ({ name: 'Chicken Tikka', weeklyLikes: 150 }) },
                { id: '2', data: () => ({ name: 'Pad Thai', weeklyLikes: 130 }) }
            ];
            getDocs.mockResolvedValue({
                docs: mockDishes,
                empty: false,
                size: 2
            });
            const menuItemsCollection = collection(db, 'menuItems');
            const q = query(menuItemsCollection, orderBy('weeklyLikes', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            expect(snapshot.docs.length).toBe(2);
            expect(snapshot.docs[0].data().weeklyLikes).toBe(150);
        });
        test('should fetch top rated restaurants', async () => {
            const mockRestaurants = [
                { id: '1', data: () => ({ name: 'Kams', averageRating: 4.8 }) },
                { id: '2', data: () => ({ name: 'Kohinoor', averageRating: 4.6 }) }
            ];
            getDocs.mockResolvedValue({
                docs: mockRestaurants,
                empty: false,
                size: 2
            });
            const restaurantsCollection = collection(db, 'restaurants');
            const q = query(restaurantsCollection, orderBy('averageRating', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            expect(snapshot.docs.length).toBe(2);
            expect(snapshot.docs[0].data().averageRating).toBe(4.8);
        });
    });
    describe('Error Handling', () => {
        test('should handle Firestore permission denied error', async () => {
            const error = new Error('permission-denied');
            getDocs.mockRejectedValue(error);
            const restaurantsCollection = collection(db, 'restaurants');
            await expect(getDocs(restaurantsCollection)).rejects.toThrow('permission-denied');
        });
        test('should handle network errors', async () => {
            const error = new Error('network-request-failed');
            addDoc.mockRejectedValue(error);
            const restaurantsCollection = collection(db, 'restaurants');
            const mockData = { name: 'Test Restaurant' };
            await expect(addDoc(restaurantsCollection, mockData)).rejects.toThrow('network-request-failed');
        });
        test('should handle invalid data format', async () => {
            const error = new Error('invalid-argument');
            addDoc.mockRejectedValue(error);
            const restaurantsCollection = collection(db, 'restaurants');
            const invalidData = { name: null }; // Invalid data
            await expect(addDoc(restaurantsCollection, invalidData)).rejects.toThrow('invalid-argument');
        });
    });
});
