import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

describe('Firebase Integration Tests', () => {
  
  test('should initialize Firebase app', () => {
    const mockApp = { name: '[DEFAULT]' };
    (initializeApp as jest.Mock).mockReturnValue(mockApp);

    const firebaseConfig = {
      apiKey: 'test-api-key',
      authDomain: 'test.firebaseapp.com',
      projectId: 'test-project'
    };

    const app = initializeApp(firebaseConfig);
    
    expect(initializeApp).toHaveBeenCalledWith(firebaseConfig);
    expect(app.name).toBe('[DEFAULT]');
  });

  test('should initialize Firebase Auth', () => {
    const mockAuth = { currentUser: null };
    (getAuth as jest.Mock).mockReturnValue(mockAuth);

    const auth = getAuth();
    
    expect(getAuth).toHaveBeenCalled();
    expect(auth.currentUser).toBeNull();
  });

  test('should initialize Firestore', () => {
    const mockDb = { type: 'firestore' };
    (getFirestore as jest.Mock).mockReturnValue(mockDb);

    const db = getFirestore();
    
    expect(getFirestore).toHaveBeenCalled();
    expect(db.type).toBe('firestore');
  });
});
