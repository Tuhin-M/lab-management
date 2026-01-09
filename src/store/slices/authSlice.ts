import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

interface AuthState {
    user: any | null;
    role: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null, // This will be populated by checkAuth or on login
    role: localStorage.getItem('userRole'),
    isAuthenticated: !!localStorage.getItem('userRole'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; role: string }>) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
