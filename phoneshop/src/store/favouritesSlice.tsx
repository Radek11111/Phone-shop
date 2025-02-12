import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const saveFavouritesToLocalStorage = (favourites: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("likedProducts", JSON.stringify(favourites));
  }
};

const loadFavouritesFromLocalStorage = (): string[] => {
  if (typeof window !== "undefined") {
    const storedFavourites = localStorage.getItem("likedProducts");
    if (storedFavourites) {
      return JSON.parse(storedFavourites);
    }
  }
  return [];
};

export interface FavouritesState {
  likedProducts: string[];
}

const initialState: FavouritesState = {
  likedProducts: loadFavouritesFromLocalStorage(),
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<string>) {
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
