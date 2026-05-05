let favourites = [];

export const getFavourites = () => favourites;

export const addFavourite = item => {
  if (!item?.id) {
    return favourites;
  }
  const exists = favourites.some(fav => fav.id === item.id);
  if (!exists) {
    favourites = [...favourites, item];
  }
  return favourites;
};

export const removeFavourite = id => {
  favourites = favourites.filter(fav => fav.id !== id);
  return favourites;
};

