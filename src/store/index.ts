import { configureStore } from '@reduxjs/toolkit';
import labReducer from './slices/labSlice';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';

export const store = configureStore({
    reducer: {
        labs: labReducer,
        auth: authReducer,
        doctor: doctorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
