import { createSlice } from '@reduxjs/toolkit';

export const tagSlice = createSlice({
  name: 'tag',
  initialState: {
    value: [],
  },
  reducers: {
    setTags: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTags } = tagSlice.actions;

export default tagSlice.reducer;
