import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl?.startsWith('http');

// Helper to create a "noop" or "mock" auth object to prevent crashes
const createMockSupabase = () => {
    const mockAuth = {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        refreshSession: async () => ({ data: { session: null }, error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
    };

    return {
        auth: mockAuth,
        storage: {
            from: () => ({
                upload: async () => ({ data: { path: '' }, error: new Error('Supabase not configured') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
                remove: async () => ({ error: new Error('Supabase not configured') }),
            }),
        },
        from: () => ({
            select: () => ({
                match: () => ({
                    maybeSingle: async () => ({ data: null, error: null }),
                }),
            }),
        }),
    } as any;
};

if (isPlaceholder || !supabaseAnonKey) {
    console.error('Supabase credentials are missing or invalid. Authentication features will not work until you update your .env file.');
}

export const supabase = !isPlaceholder && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabase();
