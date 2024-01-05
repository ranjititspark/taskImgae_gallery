import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: "",
  loadedImages: [],
};

export const imagesSlice = createSlice({
  name: "images", // Corrected the name here
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoadedImages: (state, action) => {
      state.loadedImages = [...state.loadedImages, ...action.payload];
    },
    setEmpty: (state) => {
      // Use spread syntax to create a new object with initialState values
      return { ...initialState };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearchQuery, setLoadedImages, setEmpty } = imagesSlice.actions;

export default imagesSlice.reducer;
