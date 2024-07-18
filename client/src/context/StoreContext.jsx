import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/frontendAssets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, settoken] = useState('')
    const url = 'http://localhost:8080'

    // Add item to the cart
    const addItem = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
        getTotalCartAmount()
    };

    // Remove item from the cart
    const removeItem = (itemId) => {
        setCartItems((prev) => {
            if (prev[itemId] > 1) {
                return { ...prev, [itemId]: prev[itemId] - 1 };
            } else {
                const newCartItems = { ...prev };
                delete newCartItems[itemId];
                return newCartItems;
            }
        });
    };

    // Calculate the total price
    let totalAmount 
    const getTotalCartAmount = () => {
        totalAmount=0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount
    }

    // Context value to provide to consumers
    const contextValue = {
        getTotalCartAmount,
        food_list,
        cartItems,
        setCartItems,
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
