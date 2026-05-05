import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState({});

    // reviews structure: { coffeeId: [ { id, userName, rating, comment, date } ] }

    const addReview = (coffeeId, review) => {
        setReviews((prev) => {
            const coffeeReviews = prev[coffeeId] || [];
            return {
                ...prev,
                [coffeeId]: [
                    {
                        id: Date.now().toString(),
                        date: new Date().toLocaleDateString(),
                        ...review,
                    },
                    ...coffeeReviews,
                ],
            };
        });
    };

    const getAverageRating = (coffeeId, initialRating = 4.8) => {
        const coffeeReviews = reviews[coffeeId] || [];
        if (coffeeReviews.length === 0) return initialRating;

        const total = coffeeReviews.reduce((sum, r) => sum + r.rating, 0);
        return ((total + initialRating) / (coffeeReviews.length + 1)).toFixed(1);
    };

    const deleteReview = (coffeeId, reviewId) => {
        setReviews((prev) => {
            const coffeeReviews = prev[coffeeId] || [];
            return {
                ...prev,
                [coffeeId]: coffeeReviews.filter((r) => r.id !== reviewId),
            };
        });
    };

    const getReviewCount = (coffeeId, baseCount = 230) => {
        const coffeeReviews = reviews[coffeeId] || [];
        return baseCount + coffeeReviews.length;
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, deleteReview, getAverageRating, getReviewCount }}>
            {children}
        </ReviewContext.Provider>
    );
};
