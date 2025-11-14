import { auth } from '../config/firebaseTestConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

describe('Firebase Auth Integration', () => {
  const testEmail = 'test-user@example.com';
  const testPassword = 'password123';

  

  test("sign up and login with real Firebase", async () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "testpassword123";

  const signUpResult = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
  expect(signUpResult.user.email).toBe(testEmail);

  const loginResult = await signInWithEmailAndPassword(auth, testEmail, testPassword);
  expect(loginResult.user.email).toBe(testEmail);
  await signUpResult.user.delete();
});
});