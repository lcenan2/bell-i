import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
export default function SignUp({ onBack, onSignedUp }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        setLoading(true);
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: username
            });
            // Create user profile in Firestore
            await setDoc(doc(db, 'user_profiles', user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString(),
                preferences: {},
                favorites: [],
                likedRestaurants: [],
                likedDishes: [],
                ratings: []
            });
            onSignedUp?.();
            // Successfully signed up - redirect to home
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || 'Sign up failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-6", children: _jsxs("div", { className: "w-full max-w-md bg-white p-6 rounded shadow", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Create Your Bell-I Account" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Join UIUC's restaurant rating community" }), error && _jsx("div", { className: "text-sm text-red-600 mb-3", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Username" }), _jsx(Input, { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Choose a username", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "At least 6 characters", required: true, minLength: 6 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Confirm Password" }), _jsx(Input, { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Confirm your password", required: true })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", disabled: loading, children: loading ? 'Creating Account…' : 'Sign Up' }), _jsx(Button, { variant: "outline", type: "button", onClick: onBack, children: "Back" })] })] }), _jsxs("p", { className: "text-sm text-center text-gray-600 mt-4", children: ["Already have an account?", ' ', _jsx("button", { type: "button", onClick: () => {
                                window.history.pushState(null, '', '/login');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }, className: "text-blue-600 hover:underline", children: "Log in" })] })] }) }));
}
