import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/frontendAssets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setcartItem] = useState({});

    // Add item to the cart
    const addItem = (itemId) => {
        if (!cartItems[itemId]) {
            setcartItem((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setcartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    // Remove item from the cart
    const removeItem = (itemId) => {
        if (cartItems[itemId] > 0) { // Ensure the item count doesn't go below 0
            setcartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        }
    };

    // Example useEffect for debugging purposes
    useEffect(() => {
    }, [cartItems]);

    // Context value to provide to consumers
    const contextValue = {
        food_list,
        cartItems,
        setcartItem,
        addItem,
        removeItem,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
