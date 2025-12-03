import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
const auth = getAuth();
// Mock Firebase
jest.mock('firebase/auth');
describe('Firebase Authentication Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('User Sign Up', () => {
        test('should successfully create a new user account', async () => {
            const mockUser = {
                uid: 'test-uid-123',
                email: 'test@illinois.edu',
                displayName: null
            };
            createUserWithEmailAndPassword.mockResolvedValue({
                user: mockUser
            });
            const email = 'test@illinois.edu';
            const password = 'testPassword123';
            const result = await createUserWithEmailAndPassword(auth, email, password);
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
            expect(result.user.email).toBe(email);
            expect(result.user.uid).toBe('test-uid-123');
        });
        test('should fail with invalid email format', async () => {
            const error = new Error('auth/invalid-email');
            createUserWithEmailAndPassword.mockRejectedValue(error);
            const email = 'invalid-email';
            const password = 'testPassword123';
            await expect(createUserWithEmailAndPassword(auth, email, password)).rejects.toThrow('auth/invalid-email');
        });
        test('should fail with weak password', async () => {
            const error = new Error('auth/weak-password');
            createUserWithEmailAndPassword.mockRejectedValue(error);
            const email = 'test@illinois.edu';
            const password = '123'; // Too short
            await expect(createUserWithEmailAndPassword(auth, email, password)).rejects.toThrow('auth/weak-password');
        });
        test('should fail when email already exists', async () => {
            const error = new Error('auth/email-already-in-use');
            createUserWithEmailAndPassword.mockRejectedValue(error);
            const email = 'existing@illinois.edu';
            const password = 'testPassword123';
            await expect(createUserWithEmailAndPassword(auth, email, password)).rejects.toThrow('auth/email-already-in-use');
        });
    });
    describe('User Login', () => {
        test('should successfully sign in with valid credentials', async () => {
            const mockUser = {
                uid: 'test-uid-123',
                email: 'test@illinois.edu',
                displayName: 'Test User'
            };
            signInWithEmailAndPassword.mockResolvedValue({
                user: mockUser
            });
            const email = 'test@illinois.edu';
            const password = 'testPassword123';
            const result = await signInWithEmailAndPassword(auth, email, password);
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
            expect(result.user.email).toBe(email);
        });
        test('should fail with incorrect password', async () => {
            const error = new Error('auth/wrong-password');
            signInWithEmailAndPassword.mockRejectedValue(error);
            const email = 'test@illinois.edu';
            const password = 'wrongPassword';
            await expect(signInWithEmailAndPassword(auth, email, password)).rejects.toThrow('auth/wrong-password');
        });
        test('should fail with non-existent user', async () => {
            const error = new Error('auth/user-not-found');
            signInWithEmailAndPassword.mockRejectedValue(error);
            const email = 'nonexistent@illinois.edu';
            const password = 'testPassword123';
            await expect(signInWithEmailAndPassword(auth, email, password)).rejects.toThrow('auth/user-not-found');
        });
        test('should fail with empty email', async () => {
            const error = new Error('auth/invalid-email');
            signInWithEmailAndPassword.mockRejectedValue(error);
            await expect(signInWithEmailAndPassword(auth, '', 'password123')).rejects.toThrow('auth/invalid-email');
        });
    });
    describe('User Logout', () => {
        test('should successfully sign out user', async () => {
            signOut.mockResolvedValue(undefined);
            await signOut(auth);
            expect(signOut).toHaveBeenCalledWith(auth);
        });
        test('should handle sign out errors', async () => {
            const error = new Error('auth/network-request-failed');
            signOut.mockRejectedValue(error);
            await expect(signOut(auth)).rejects.toThrow('auth/network-request-failed');
        });
    });
    describe('User Profile Update', () => {
        test('should successfully update user display name', async () => {
            const mockUser = {
                uid: 'test-uid-123',
                email: 'test@illinois.edu',
                displayName: null
            };
            updateProfile.mockResolvedValue(undefined);
            await updateProfile(mockUser, { displayName: 'New Name' });
            expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'New Name' });
        });
    });
});
