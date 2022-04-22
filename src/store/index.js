import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tagReducer from './tag';
import questionReducer from './question';

const rootReducer = combineReducers({
  tag: tagReducer,
  question: questionReducer,
});

export default configureStore({ reducer: rootReducer });
