// App.tsx
import React, { useEffect, useState } from 'react'
import './styles/style.css'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { RestaurantDetails } from './pages/RestaurantDetail'
import { restaurants } from './data/Restaurants' // array of Restaurant
import { uploadAllData } from './scripts/uploadData';
import { AdminPanel } from './pages/AdminPanel';



function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState(null, '', to)
      setPath(to)
      window.scrollTo(0, 0)
    }
  }

  if (path === '/login') {
    return <Login onBack={() => navigate('/')} />
  }

  if (path === '/signup') {
    return <SignUp onBack={() => navigate('/')} />
  }

  if (path === '/admin') {
    return <AdminPanel />;
  }

  const match = path.match(/^\/restaurant\/([^/]+)$/)
  if (match) {
    // If your Restaurant.id is a number:
    const id = decodeURIComponent(match[1])
    const restaurant = restaurants.find(r => r.id === id)

    // If your Restaurant.id is a string, use:
    // const idStr = decodeURIComponent(match[1])
    // const restaurant = restaurants.find(r => r.id === idStr)

    if (!restaurant) {
      return (
        <div className="p-6">
          <button onClick={() => navigate('/')} className="underline">Back</button>
          <p className="mt-4">Restaurant not found.</p>
        </div>
      )
    }
    return <RestaurantDetails restaurant={restaurant} onBack={() => navigate('/')} />
  }

  return (
    <>
    <LandingPage
      onGetStarted={() => navigate('/login')}
      onLogin={() => navigate('/login')}
      onOpenRestaurant={(id: string | number) => navigate(`/restaurant/${id}`)}
    />
  </>
  )
}

export default App
