import { configureStore } from '@reduxjs/toolkit';
import labReducer from './slices/labSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        labs: labReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
