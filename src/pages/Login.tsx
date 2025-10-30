import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login({ onBack }: { onBack?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // First authenticate the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user has a profile in Firestore
      const userProfileRef = doc(db, 'user_profiles', user.uid);
      const profileSnap = await getDoc(userProfileRef);
      
      if (!profileSnap.exists()) {
        // Create a new profile if one doesn't exist
        await setDoc(userProfileRef, {
          username: email,
          createdAt: new Date().toISOString(),
          // Add any other initial profile fields here
          preferences: {},
          favorites: []
        });
      }
      
      // Successfully logged in and profile exists/created
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
        // Optionally redirect to profile creation:
        // window.history.pushState(null, '', '/create-profile');
        // window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <Button variant="outline" type="button" onClick={onBack}>
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
