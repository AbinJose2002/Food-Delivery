import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './List.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const List = () => {
  const url = 'http://localhost:8080'
  const [list, setlist] = useState([])
  const fetchList = async () =>{
    const foodResponse = await axios.get(`${url}/api/food/list`)
    if(foodResponse.data.success){
      setlist(foodResponse.data.data)
    }else{
      toast.error('Error happened while fetching food!')
    }
  }

  const removeItem = async (foodId)=>{
    let removeResponse = await axios.post(`${url}/api/food/delete`,{id:foodId})
    console.log(removeResponse)
    if(removeResponse.data.success){
      toast.success('Food removed')
      await fetchList()
    }else{
      toast.error(removeResponse.data.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])
  
  return (
    <div className='col-10 xyz'>
        <h1 className=''>Food List</h1>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item,index) => (
            <TableRow
              key={index}
            >
              <TableCell component="th" scope="row">
                <img src={`${url}/images/`+item.image} className='admin-food-list-img' alt="" />
              </TableCell>
              <TableCell align="center">{item.name}</TableCell>
              <TableCell align="center">{item.category}</TableCell>
              <TableCell align="center">{item.price}</TableCell>
              <TableCell align="center"><p className="remove-symbol" onClick={()=>removeItem(item._id)}>X</p></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        
    </div>
  )
}

export default List
