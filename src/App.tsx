// App.tsx
import React, { useEffect, useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { RestaurantDetails } from './pages/RestaurantDetail'
import { restaurants } from './data/Restaurants' // array of Restaurant
import { uploadAllData } from './scripts/uploadData';
import { AdminPanel } from './pages/AdminPanel';
import { ProfilePage } from './pages/ProfilePage'


function App() {
  const [path, setPath] = useState(window.location.pathname);

  // very simple auth stub for now
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = "demo-user-1";   // TODO: replace with real auth user id
  const userName = "Angela";      // TODO: replace with real auth user name

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState(null, "", to);
      setPath(to);
      window.scrollTo(0, 0);
    }
  };


  if (path === "/login") {
    return (
      <Login
        onBack={() => navigate("/")}
        onLoggedIn={() => {
          setIsLoggedIn(true);
          navigate("/profile"); // go straight to profile after login
        }}
      />
    );
  }

  if (path === "/signup") {
    return (
      <SignUp
        onBack={() => navigate("/")}
        onSignedUp={() => {
          setIsLoggedIn(true);
          navigate("/profile");
        }}
      />
    );
  }

  if (path === "/profile") {
    if (!isLoggedIn) {
      // not logged in → push them to login
      navigate("/login");
      return null;
    }

    return (
      <ProfilePage
        userId={userId}
        userName={userName}
        restaurants={restaurants.map((r) => ({
          id: r.id,
          name: r.name,
          location: r.location,
        }))}
        onBack={() => navigate("/")}
      />
    );
  }

  if (path === '/admin') {
    return <AdminPanel />;
  }

  const match = path.match(/^\/restaurant\/([^/]+)$/)
  if (match) {
    const id = decodeURIComponent(match[1]);
    const restaurant = restaurants.find((r) => r.id === id);

    if (!restaurant) {
      return (
        <div className="p-6">
          <button onClick={() => navigate("/")} className="underline">
            Back
          </button>
          <p className="mt-4">Restaurant not found.</p>
        </div>
      );
    }

    return (
      <RestaurantDetails
        restaurant={restaurant}
        onBack={() => navigate("/")}
      />
    );
  }

  // default route: "/"
  return (
    <>
    <LandingPage
      isLoggedIn={isLoggedIn}
      userName={userName}
      onGetStarted={() => navigate("/signup")}
      onLogin={() => navigate("/login")}
      onOpenProfile={() => navigate("/profile")}
      onOpenRestaurant={(id) =>
        navigate(`/restaurant/${encodeURIComponent(String(id))}`)
      }
    />
  </>
  )
}

export default App;
