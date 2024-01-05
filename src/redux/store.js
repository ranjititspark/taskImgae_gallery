import { configureStore } from '@reduxjs/toolkit'
import { imagesSlice } from './imageSlice'

 const store = configureStore({
  reducer: {
    images:imagesSlice.reducer
  },
})
export default store