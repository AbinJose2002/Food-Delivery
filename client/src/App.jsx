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
import Reservation from "./components/reservation/Reservation";
import MyReservations from "./components/reservation/MyReservations";
import StaffLogin from './components/staff/StaffLogin';
import StaffRegister from './components/staff/StaffRegister';
import StaffDashboard from './components/staff/StaffDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminRegister from './components/admin/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';

const App = () => {
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
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/myreservations" element={<MyReservations />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/register" element={<StaffRegister />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
