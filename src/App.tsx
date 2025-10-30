// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React, { useEffect, useState } from 'react'
import './App.css'
import './styles/style.css'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login'

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
    }
  }

  if (path === '/login') {
    return <Login onBack={() => navigate('/')} />
  }

  return <LandingPage onGetStarted={() => navigate('/login')} onLogin={() => navigate('/login')} />
}

export default App