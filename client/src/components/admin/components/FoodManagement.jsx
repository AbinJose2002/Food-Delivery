import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const FoodManagement = () => {
    const { url } = useContext(StoreContext);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: null
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoods(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            if (selectedFood) {
                await axios.put(`${url}/api/food/${selectedFood._id}`, formDataToSend);
            } else {
                await axios.post(`${url}/api/food/add`, formDataToSend);
            }
            fetchFoods();
            setShowForm(false);
            setSelectedFood(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                image: null
            });
        } catch (error) {
            console.error('Error saving food:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`${url}/api/food/${id}`);
                fetchFoods();
            } catch (error) {
                console.error('Error deleting food:', error);
            }
        }
    };

    const handleEdit = (food) => {
        setSelectedFood(food);
        setFormData({
            name: food.name,
            price: food.price,
            description: food.description,
            category: food.category,
            image: null
        });
        setShowForm(true);
    };

    return (
        <div className="food-management">
            <h2>Food Items Management</h2>
            <button className="add-btn" onClick={() => setShowForm(true)}>
                <FaPlus />
            </button>

            {showForm && (
                <div className="form-overlay">
                    <div className="food-form">
                        <h3>{selectedFood ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Food Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Starters">Starters</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input
                                    type="file"
                                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                                    accept="image/*"
                                    required={!selectedFood}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    {selectedFood ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setShowForm(false);
                                    setSelectedFood(null);
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="food-grid">
                    {foods.map((food) => (
                        <div key={food._id} className="food-card">
                            <img src={`${url}/images/${food.image}`} alt={food.name} />
                            <div className="food-info">
                                <h3>{food.name}</h3>
                                <p className="price">${food.price.toFixed(2)}</p>
                                <p className="food-description">{food.description}</p>
                                <span className="category">{food.category}</span>
                            </div>
                            <div className="food-actions">
                                <button onClick={() => handleEdit(food)} className="edit-btn" title="Edit">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(food._id)} className="delete-btn" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodManagement;
