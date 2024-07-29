import React from 'react'
import { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
  let url = 'https://food-delivery-3fc4.onrender.com'
  const [image, setimage] = useState(false)
  const [data, setdata] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad'
  })


  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setdata(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('name',data.name)
    formData.append('description',data.description)
    formData.append('price',Number(data.price))
    formData.append('category',data.category)
    formData.append('image',image)
    const response = await axios.post(`${url}/api/food/add`,formData)
    try{
      if(response.data.success){
        setdata({
          name: '',
          description: '',
          price: '',
          category: 'Salad'
        })
        setimage(false)
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    }catch(error){
      toast.error("Error while upload")
    }
  }

  return (
    <div className='col-9 mx-auto py-4 px-5'>
      <h2 className="upload-img">Upload Image</h2>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="image">
          <img className='upload-img-area' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
        </label>
        <input onChange={(e) => { setimage(e.target.files[0]) }} type="file" id="image" hidden required />
        <div className="add-product-name">
          <h4>Product Name</h4>
          <input onChange={(e) => handleChange(e)} className="form-control add-name" type="text" placeholder='Type Here' name='name' />
        </div>
        <div className="add-product-desc">
          <h4>Product Description</h4>
          <textarea onChange={(e) => handleChange(e)} value={data.description} name='description' className="form-control add-desc" id="exampleFormControlTextarea1" rows="3" placeholder='Write content here'></textarea>
        </div>
        <div className="add-product-category">
          <h4>Product Category</h4>
          <select onChange={(e) => handleChange(e)} name='category' className="form-select add-category" aria-label="Default select example">
            <option   >Open this select menu</option>
            <option value="Salad">Salad</option>
            <option value="Rolls">Rolls</option>
            <option value="Deserts">Deserts</option>
            <option value="Sandwich">Sandwich</option>
            <option value="Cake">Cake</option>
            <option value="Pure Veg">Pure Veg</option>
            <option value="Pasta">Pasta</option>
            <option value="Noodles">Noodles</option>
          </select>
        </div>
        <div className="add-product-price">
          <h4>Product Price</h4>
          <input onChange={(e) => handleChange(e)} name='price' value={data.price} className="form-control add-price" type="number" placeholder='Type Here' />
        </div>
        <button className="btn btn-tomato my-3">Add</button>
      </form>
    </div>
  )
}

export default Add
