import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
export default function Login({ onBack, onLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
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
            onLoggedIn?.();
            // Successfully logged in and profile exists/created
            // Optionally redirect to profile creation:
            // window.history.pushState(null, '', '/create-profile');
            // window.dispatchEvent(new PopStateEvent('popstate'));
            //}
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || 'Sign in failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-6", children: _jsxs("div", { className: "w-full max-w-md bg-white p-6 rounded shadow", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Sign in" }), error && _jsx("div", { className: "text-sm text-red-600 mb-3", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", disabled: loading, children: loading ? 'Signing in…' : 'Sign in' }), _jsx(Button, { variant: "outline", type: "button", onClick: onBack, children: "Back" })] })] }), _jsxs("p", { className: "text-sm text-center text-gray-600 mt-4", children: ["Don't have an account?", ' ', _jsx("button", { type: "button", onClick: () => {
                                window.history.pushState(null, '', '/signup');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }, className: "text-blue-600 hover:underline", children: "Sign up" })] })] }) }));
}
