import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFavourites, addFavourite as storeAdd, removeFavourite as storeRemove } from './favouritesStore';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Initialize from store on mount
    useEffect(() => {
        setFavorites(getFavourites());
    }, []);

    const addFavorite = (item) => {
        const updated = storeAdd(item);
        setFavorites([...updated]);
    };

    const removeFavorite = (id) => {
        const updated = storeRemove(id);
        setFavorites([...updated]);
    };

    const isFavorite = (id) => favorites.some(fav => fav.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
