import { configureStore, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Campaign slice
const campaignSlice = createSlice({
  name: 'campaigns',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCampaigns: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Workspace slice
const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWorkspaces: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Create store
export const store = configureStore({
  reducer: {
    campaigns: campaignSlice.reducer,
    workspaces: workspaceSlice.reducer,
  },
});

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
