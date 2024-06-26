import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Explore from "./components/Explore";
import FoodDisplay from "./components/FoodDisplay";
import Footer from "./components/Footer";
import Cart from './components/cart/Cart';
import Login from './components/Login/Login';
import './App.css';

function App() {
  const [category, setCategory] = useState('All');
  const [showLogin, setShowLogin] = useState(false); // Corrected to boolean

  const MainPage = () => (
    <>
      <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />
      <Home />
      <Explore category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Footer />
    </>
  );

  return (
    <Router>
      {showLogin && <Login setShowLogin={setShowLogin} showLogin={showLogin} />} {/* Conditional rendering of Login component */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
