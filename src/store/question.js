import { createSlice } from '@reduxjs/toolkit';

export const questionSlice = createSlice({
  name: 'question',
  initialState: {
    value: [],
  },
  reducers: {
    setQuestions: (state, action) => {
      state.value = action.payload;
    },
    addQuestions: (state, action) => {
      state.value = state.value.concat(action.payload);
    },
  },
});

export const { setQuestions, addQuestions } = questionSlice.actions;

export default questionSlice.reducer;
