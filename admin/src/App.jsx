import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Add from './pages/add/Add'
import Order from './pages/order/Order'
import List from './pages/list/List'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <ToastContainer />
      <Navbar />
      <div className="col-12 row container">
      <Sidebar />
      <Routes>
        <Route path='/add' element={<Add/>} />
        <Route path='/list' element={<List/>} />
        <Route path='/order' element={<Order/>} />
      </Routes> 
      </div>
    </>
  )
}

export default App
