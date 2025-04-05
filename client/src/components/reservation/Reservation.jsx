import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './Reservation.css';
import { FaCalendar, FaClock, FaUsers, FaUtensils } from 'react-icons/fa';

const Reservation = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '1',
        specialRequests: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                throw new Error('Please login to make a reservation');
            }

            const response = await axios.post(
                `${url}/api/reservation/create`,
                formData,
                { headers: { token } }
            );

            if (response.data.success) {
                alert('Reservation created successfully!');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    guests: '1',
                    specialRequests: ''
                });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.message || 'Error creating reservation');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Navbar />
            <div className="reservation-container">
                <div className="reservation-hero">
                    <h1>Reserve Your Table</h1>
                    <p>Enjoy a delightful dining experience with us</p>
                </div>
                
                <div className="reservation-form-container">
                    {error && (
                        <div className="alert alert-danger mb-3">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="reservation-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <div className="input-icon">
                                    <FaCalendar />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-icon">
                                    <FaClock />
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <div className="input-icon">
                                    <FaUsers />
                                    <select
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        required
                                    >
                                        {[1,2,3,4,5,6,7,8].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <textarea
                                name="specialRequests"
                                placeholder="Special Requests (Optional)"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-reservation"
                            disabled={loading}
                        >
                            {loading ? 'Creating Reservation...' : 'Reserve Table'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Reservation;
