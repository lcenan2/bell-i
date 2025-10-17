// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import './pages/LandingPage'
import { LandingPage } from './pages/LandingPage'
import './styles/style.css'
//import RestaurantList from './components/restaurantList'

function App() {
  //return <RestaurantList />; 
  return <LandingPage onGetStarted={() => {}} onLogin={() => {}} />;
}

export default App
