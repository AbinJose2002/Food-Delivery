// Login.js
import React, { useState } from 'react';
import { assets } from '../../assets/frontendAssets/assets';
import './Login.css';

const Login = ({ showLogin, setShowLogin }) => {
  const [currentState, setCurrentState] = useState('Sign Up');

  return (
    <div className="login-popup">
      <form action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={assets.cross_icon} onClick={() => setShowLogin(false)} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currentState === 'Sign Up' && <input type="text" name="uname" placeholder="Enter your name" />}
          <input type="email" name="uemail" placeholder="Enter your email" />
          <input type="password" name="upassword" placeholder="Enter your password" />
        </div>
        <button type="submit">{currentState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        <div className="login-pop-condition">
          <input type="checkbox" required />
          <p>By clicking this, I agree to the terms of use and privacy policy.</p>
        </div>
          {currentState === 'Sign Up' ? (
            <p className='redirect-link'>
              Already have an Account <span onClick={() => setCurrentState('Login')}><a href="#">Click Here!</a></span>
            </p>
          ) : (
            <p className='redirect-link'>
              Create a new Account <span onClick={() => setCurrentState('Sign Up')}><a href="#">Click Here!</a></span>
            </p>
          )}
      </form>
    </div>
  );
};

export default Login;
