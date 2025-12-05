// App.tsx
import React, { useEffect, useState } from 'react'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { RestaurantDetails } from './pages/RestaurantDetail'
import { restaurants } from './data/Restaurants'
import { uploadAllData } from './scripts/uploadData'
import { AdminPanel } from './pages/AdminPanel'
import { ProfilePage } from './pages/ProfilePage'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [authLoading, setAuthLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
        setIsLoggedIn(true)

        // Fetch user profile from Firestore to get username
        const userProfileRef = doc(db, 'user_profiles', user.uid)
        const profileSnap = await getDoc(userProfileRef)

        if (profileSnap.exists()) {
          const username = profileSnap.data().username || user.email || 'User'
          setUserName(username)
        } else {
          setUserName(user.email || 'User')
        }
      } else {
        setIsLoggedIn(false)
        setUserId('')
        setUserName('')
      }
      // Mark auth loading as complete
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

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

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setIsLoggedIn(false)
      setUserId('')
      setUserName('')
      navigate('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (path === '/login') {
    return (
      <Login
        onBack={() => navigate('/')}
        onLoggedIn={() => {
          navigate('/profile')
        }}
      />
    )
  }

  if (path === '/signup') {
    return (
      <SignUp
        onBack={() => navigate('/')}
        onSignedUp={() => {
          navigate('/profile')
        }}
      />
    )
  }

  if (path === '/profile') {
    // Wait for auth state to be determined
    if (authLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>
    }
    
    if (!isLoggedIn) {
      navigate('/login')
      return null
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
        onBack={() => navigate('/')}
        onLogout={handleLogout}
      />
    )
  }

  if (path === '/admin') {
    return <AdminPanel />
  }

  const match = path.match(/^\/restaurant\/([^/]+)$/)
  if (match) {
    const id = decodeURIComponent(match[1])
    const restaurant = restaurants.find((r) => r.id === id)

    if (!restaurant) {
      return (
        <div className="p-6">
          <button onClick={() => navigate('/')} className="underline">
            Back
          </button>
          <p className="mt-4">Restaurant not found.</p>
        </div>
      )
    }

    return (
      <RestaurantDetails
        restaurant={restaurant}
        onBack={() => navigate('/')}
      />
    )
  }

  return (
    <>
      <LandingPage
        isLoggedIn={isLoggedIn}
        userName={userName}
        onGetStarted={() => navigate('/signup')}
        onLogin={() => navigate('/login')}
        onOpenProfile={() => navigate('/profile')}
        onOpenRestaurant={(id) =>
          navigate(`/restaurant/${encodeURIComponent(String(id))}`)
        }
        onLogout={handleLogout}
      />
    </>
  )
}

export default App
