// Login.js
import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/frontendAssets/assets';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'

const Login = ({ showLogin, setShowLogin }) => {
  const {url} = useContext(StoreContext)
  const {token, settoken} = useContext(StoreContext)
  const [currentState, setCurrentState] = useState('Sign Up');
  const [data, setdata] = useState({
    'name': '',
    'email': '',
    'password': ''
  })

  const changeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setdata(data=>({...data,[name]:value}))
  }

  const handleSubmit = async (event) =>{
    event.preventDefault()
    console.log(data);
    let newUrl = url
    if(currentState=='Sign Up'){
      newUrl+='/api/user/register'
    }else{
      newUrl+='/api/user/login'
    }
    let logResponse = await axios.post(newUrl,data)
    if(logResponse.data.success){
      settoken(logResponse.data.token)
      localStorage.setItem('token', logResponse.data.token)
      setShowLogin(false)
    }else{
      alert(logResponse.data.message);
    }
  }
  

  return (
    <div className="login-popup">
      <form onSubmit={handleSubmit} action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img src={assets.cross_icon} onClick={() => setShowLogin(false)} alt="close" />
        </div>
        <div className="login-popup-inputs">
          {currentState === 'Sign Up' && <input type="text" name="name" value={data.name} onChange={changeHandler} placeholder="Enter your name" required/>}
          <input type="email" name="email" placeholder="Enter your email" value={data.email} onChange={changeHandler} required/>
          <input type="password" name="password" placeholder="Enter your password" value={data.password} onChange={changeHandler} required/>
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
