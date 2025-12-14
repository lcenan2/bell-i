import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// App.tsx
import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { RestaurantDetails } from './pages/RestaurantDetail';
import { restaurants } from './data/Restaurants';
import { AdminPanel } from './pages/AdminPanel';
import { ProfilePage } from './pages/ProfilePage';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
function App() {
    const [path, setPath] = useState(window.location.pathname);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setIsLoggedIn(true);
                // Fetch user profile from Firestore to get username
                const userProfileRef = doc(db, 'user_profiles', user.uid);
                const profileSnap = await getDoc(userProfileRef);
                if (profileSnap.exists()) {
                    const username = profileSnap.data().username || user.email || 'User';
                    setUserName(username);
                }
                else {
                    setUserName(user.email || 'User');
                }
            }
            else {
                setIsLoggedIn(false);
                setUserId('');
                setUserName('');
            }
            // Mark auth loading as complete
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const onPop = () => setPath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);
    const navigate = (to) => {
        if (window.location.pathname !== to) {
            window.history.pushState(null, '', to);
            setPath(to);
            window.scrollTo(0, 0);
        }
    };
    const handleLogout = async () => {
        try {
            await auth.signOut();
            setIsLoggedIn(false);
            setUserId('');
            setUserName('');
            navigate('/');
        }
        catch (err) {
            console.error('Logout failed:', err);
        }
    };
    if (authLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "text-xl", children: "Loading..." }) }));
    }
    if (path === '/login') {
        return (_jsx(Login, { onBack: () => navigate('/'), onLoggedIn: () => {
                navigate('/profile');
            } }));
    }
    if (path === '/signup') {
        return (_jsx(SignUp, { onBack: () => navigate('/'), onSignedUp: () => {
                navigate('/profile');
            } }));
    }
    if (path === '/profile') {
        // Wait for auth state to be determined
        if (authLoading) {
            return _jsx("div", { className: "flex items-center justify-center h-screen", children: "Loading..." });
        }
        if (!isLoggedIn) {
            navigate('/login');
            return null;
        }
        return (_jsx(ProfilePage, { userId: userId, userName: userName, restaurants: restaurants.map((r) => ({
                id: r.id,
                name: r.name,
                location: r.location,
            })), onBack: () => navigate('/'), onLogout: handleLogout }));
    }
    if (path === '/admin') {
        return _jsx(AdminPanel, {});
    }
    const match = path.match(/^\/restaurant\/([^/]+)$/);
    if (match) {
        const id = decodeURIComponent(match[1]);
        const restaurant = restaurants.find((r) => r.id === id);
        if (!restaurant) {
            return (_jsxs("div", { className: "p-6", children: [_jsx("button", { onClick: () => navigate('/'), className: "underline", children: "Back" }), _jsx("p", { className: "mt-4", children: "Restaurant not found." })] }));
        }
        return (_jsx(RestaurantDetails, { restaurant: restaurant, onBack: () => navigate('/') }));
    }
    return (_jsx(_Fragment, { children: _jsx(LandingPage, { isLoggedIn: isLoggedIn, userName: userName, onGetStarted: () => navigate('/signup'), onLogin: () => navigate('/login'), onOpenProfile: () => navigate('/profile'), onOpenRestaurant: (id) => navigate(`/restaurant/${encodeURIComponent(String(id))}`), onLogout: handleLogout }) }));
}
export default App;
