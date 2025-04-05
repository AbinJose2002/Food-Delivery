import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { FaCalendar, FaClock, FaUsers } from 'react-icons/fa';
import './MyReservations.css'; // Add CSS import

const MyReservations = () => {
    const { url, token } = useContext(StoreContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${url}/api/reservation/user`, {
                    headers: { token }
                });
                if (response.data.success) {
                    setReservations(response.data.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReservations();
        }
    }, [token, url]);

    const handleCancel = async (reservationId) => {
        try {
            const response = await axios.post(
                `${url}/api/reservation/cancel`,
                { reservationId },
                { headers: { token } }
            );
            if (response.data.success) {
                setReservations(reservations.map(res => 
                    res._id === reservationId ? {...res, status: 'Cancelled'} : res
                ));
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Confirmed': return 'text-success';
            case 'Cancelled': return 'text-danger';
            case 'Completed': return 'text-primary';
            default: return 'text-warning';
        }
    };

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <h2 className="mb-4">My Reservations</h2>
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="row">
                        {reservations.length > 0 ? (
                            reservations.map((reservation) => (
                                <div key={reservation._id} className="col-12 mb-4">
                                    <div className="card reservation-card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="card-title">{reservation.name}</h5>
                                                <span className={`badge ${getStatusColor(reservation.status)}`}>
                                                    {reservation.status}
                                                </span>
                                            </div>
                                            <div className="reservation-details">
                                                <p><FaCalendar /> {new Date(reservation.date).toLocaleDateString()}</p>
                                                <p><FaClock /> {reservation.time}</p>
                                                <p><FaUsers /> {reservation.guests} Guests</p>
                                            </div>
                                            {reservation.status === 'Pending' && (
                                                <button
                                                    className="btn btn-danger mt-2"
                                                    onClick={() => handleCancel(reservation._id)}
                                                >
                                                    Cancel Reservation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No reservations found</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MyReservations;
