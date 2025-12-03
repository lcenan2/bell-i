jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
}));
import * as auth from 'firebase/auth';
// Mock auth service functions
class AuthService {
    async signUp(email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(null, email, password);
            return { success: true, user: userCredential.user };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(null, email, password);
            return { success: true, user: userCredential.user };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async logout() {
        try {
            await auth.signOut(null);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
describe('AuthService', () => {
    let authService;
    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });
    test('signUp should return success with user data', async () => {
        const mockUser = { uid: '123', email: 'test@illinois.edu' };
        auth.createUserWithEmailAndPassword.mockResolvedValue({
            user: mockUser
        });
        const result = await authService.signUp('test@illinois.edu', 'password123');
        expect(result.success).toBe(true);
        expect(result.user?.email).toBe('test@illinois.edu');
    });
    test('signUp should return error on failure', async () => {
        auth.createUserWithEmailAndPassword.mockRejectedValue(new Error('auth/email-already-in-use'));
        const result = await authService.signUp('test@illinois.edu', 'password123');
        expect(result.success).toBe(false);
        expect(result.error).toBe('auth/email-already-in-use');
    });
    test('login should return success with user data', async () => {
        const mockUser = { uid: '123', email: 'test@illinois.edu' };
        auth.signInWithEmailAndPassword.mockResolvedValue({
            user: mockUser
        });
        const result = await authService.login('test@illinois.edu', 'password123');
        expect(result.success).toBe(true);
        expect(result.user?.email).toBe('test@illinois.edu');
    });
    test('logout should return success', async () => {
        auth.signOut.mockResolvedValue(undefined);
        const result = await authService.logout();
        expect(result.success).toBe(true);
    });
});
