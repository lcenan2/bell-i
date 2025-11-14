export const initializeApp = jest.fn();
export const getApps = jest.fn(() => []);
export const getApp = jest.fn();

// --- Firestore Mocking ---

export const getFirestore = jest.fn(() => ({}));
export const collection = jest.fn((db, path) => ({ db, path }));
export const doc = jest.fn((db, collection, id) => ({ db, collection, id }));

export const query = jest.fn((...args) => ({ args }));
export const where = jest.fn((field, op, value) => ({ field, op, value }));
export const orderBy = jest.fn((field, direction) => ({ field, direction }));
export const limit = jest.fn((count) => ({ count }));

export const addDoc = jest.fn();
export const getDocs = jest.fn();
export const getDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const onSnapshot = jest.fn();

// --- Auth Mocking ---

export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(),
  currentUser: null,
}));

export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const updateProfile = jest.fn();
export const onAuthStateChanged = jest.fn();


export class FirebaseError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}