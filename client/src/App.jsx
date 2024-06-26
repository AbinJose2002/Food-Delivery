import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Explore from "./components/Explore"
import FoodDisplay from "./components/FoodDisplay"
import './App.css'
import { useState } from "react"

function App() {
  const [category, setCategory] = useState('All')
  return (
    <>
      <Navbar/>
      <Home/>
      <Explore category={category} setCategory={setCategory}/>
      <FoodDisplay categor={category}/>
    </>
  )
}

export default App
