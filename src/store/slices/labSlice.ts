import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { labOwnerAPI } from '../../services/api';

interface LabState {
    labs: any[];
    stats: {
        totalLabs: number;
        totalAppointments: number;
        totalTests: number;
        totalRevenue: number;
        pendingAppointments: number;
        recentAppointments: any[];
        analytics: any[];
    };
    loading: boolean;
    error: string | null;
}

const initialState: LabState = {
    labs: [],
    stats: {
        totalLabs: 0,
        totalAppointments: 0,
        totalTests: 0,
        totalRevenue: 0,
        pendingAppointments: 0,
        recentAppointments: [],
        analytics: [],
    },
    loading: false,
    error: null,
};

export const fetchDashboardData = createAsyncThunk(
    'labs/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const [labsRes, statsRes] = await Promise.all([
                labOwnerAPI.getOwnedLabs(),
                labOwnerAPI.getLabStats(),
            ]);
            return {
                labs: labsRes.data ?? labsRes,
                stats: statsRes.data ?? statsRes,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    }
);

export const addLab = createAsyncThunk(
    'labs/addLab',
    async (labData: any, { rejectWithValue, dispatch }) => {
        try {
            const response = await labOwnerAPI.addLab(labData);
            dispatch(fetchDashboardData()); // Refresh stats after adding
            return response.data ?? response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add lab');
        }
    }
);

export const deleteLab = createAsyncThunk(
    'labs/deleteLab',
    async (id: string, { rejectWithValue }) => {
        try {
            await labOwnerAPI.deleteLab(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete lab');
        }
    }
);

const labSlice = createSlice({
    name: 'labs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.labs = action.payload.labs;
                state.stats = action.payload.stats;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteLab.fulfilled, (state, action) => {
                state.labs = state.labs.filter((lab) => (lab.id || lab._id) !== action.payload);
            });
    },
});

export default labSlice.reducer;
