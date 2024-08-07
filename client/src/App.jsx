import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Explore from "./components/Explore";
import FoodDisplay from "./components/FoodDisplay";
import Footer from "./components/Footer";
import Cart from './components/cart/Cart';
import Login from './components/Login/Login';
import PlaceOrder from './components/placeorder/PlaceOrder'
import Verify from './components/verify/Verify'
import './App.css';
import MyOrders from "./components/myorders/MyOrders";

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
        <Route path="/cart" element={<Cart setShowLogin={setShowLogin} showLogin={showLogin} />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/myorders" element={<MyOrders/>} />
      </Routes>
    </Router>
  );
}

export default App;
