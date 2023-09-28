import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import recipeReducer from '../features/recipes/recipeSlice';

export const store = configureStore({
  reducer: {
    recipe: recipeReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
