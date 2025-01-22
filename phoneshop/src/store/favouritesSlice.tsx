import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const saveFavouritesToLocalStorage = (favourites: number[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("likedProducts", JSON.stringify(favourites));
  }
};

const loadFavouritesFromLocalStorage = (): number[] => {
  if (typeof window !== "undefined") {
    const storedFavourites = localStorage.getItem("likedProducts");
    if (storedFavourites) {
      return JSON.parse(storedFavourites);
    }
  }
  return [];
};

export interface FavouritesState {
  likedProducts: number[];
}

const initialState: FavouritesState = {
  likedProducts: loadFavouritesFromLocalStorage(),
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const index = state.likedProducts.indexOf(productId);
      if (index === -1) {
        state.likedProducts.push(productId);
      } else {
        state.likedProducts.splice(index, 1); 
      }
      saveFavouritesToLocalStorage(state.likedProducts);
    },
    resetFavourites(state) {
      state.likedProducts = [];
      saveFavouritesToLocalStorage(state.likedProducts);
    },
  },
});

export const { toggleFavourite, resetFavourites } = favouritesSlice.actions;

export default favouritesSlice.reducer;
