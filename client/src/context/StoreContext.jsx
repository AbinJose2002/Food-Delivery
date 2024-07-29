import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [foodList, setFoodList] = useState([]);
    const [token, settoken] = useState(localStorage.getItem('token') || '');
    const url = 'https://food-delivery-3fc4.onrender.com';

    const addItem = async (itemId) => {
        const updatedCartItems = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
        setCartItems(updatedCartItems);
        if (token) {
            await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
        }
    };

    const removeItem = async (itemId) => {
        const updatedCartItems = { ...cartItems };
        if (updatedCartItems[itemId] > 1) {
            updatedCartItems[itemId] -= 1;
        } else {
            delete updatedCartItems[itemId];
        }
        setCartItems(updatedCartItems);
        if (token) {
            await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const itemInfo = foodList.find(product => product._id === itemId);
            return total + (itemInfo?.price || 0) * quantity;
        }, 0);
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching food list:', error);
        }
    };

    const loadCartData = async () => {
        if (token) {
            try {
                const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
                if (response.data.success) {
                    setCartItems(response.data.cartData);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error loading cart data:', error);
            }
        }
    };

    useEffect(() => {
        fetchFoodList();
        loadCartData();
    }, [token]);

    const contextValue = {
        getTotalCartAmount,
        foodList,
        cartItems,
        addItem,
        removeItem,
        url,
        token,
        settoken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
