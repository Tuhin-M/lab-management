import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  type: string;
  amount: number;
}

interface DoctorStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
}

interface DoctorState {
  appointments: Appointment[];
  prescriptions: any[];
  stats: DoctorStats;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  appointments: [],
  prescriptions: [],
  stats: {
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
  },
  loading: false,
  error: null,
};

export const fetchDoctorDashboardData = createAsyncThunk(
  'doctor/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch appointments for this doctor
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id) // Assuming doctor ID is same as user ID
        .order('appointment_date', { ascending: false });

      if (apptError) throw apptError;

      // Fetch prescriptions for this doctor
      const { data: prescriptions, error: pError } = await supabase
        .from('prescriptions')
        .select('*, prescription_medicines(*)')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      // Calculate stats
      const stats = {
        totalAppointments: appointments?.length || 0,
        pendingAppointments: appointments?.filter(a => a.status === 'confirmed').length || 0,
        completedAppointments: appointments?.filter(a => a.status === 'completed').length || 0,
        totalRevenue: appointments?.filter(a => a.status === 'completed').reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0,
      };

      return { appointments: appointments || [], prescriptions: prescriptions || [], stats };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'doctor/updateAppointmentStatus',
  async ({ id, status }: { id: string, status: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
        state.prescriptions = action.payload.prescriptions;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDoctorDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export default doctorSlice.reducer;
