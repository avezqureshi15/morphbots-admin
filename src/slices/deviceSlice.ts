import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URLS } from '../constants/urlConstants';
import axiosInstance from '../api/axiosInstance';

interface Device {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    active: boolean;
}

interface DeviceTypeState {
    devices: Device[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: DeviceTypeState = {
    devices: [],
    loading: false,
    error: null,
    success: false,
};

// Async thunk to create a new device type
export const createDeviceType = createAsyncThunk(
    'deviceType/create',
    async (data: { name: string; description: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(URLS.CREATE_DEVICE, {
                name: data.name,
                description: data.description,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to fetch devices
export const getDevices = createAsyncThunk(
    'deviceType/getDevices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.CREATE_DEVICE);
            return response.data.data; // Assuming the devices are inside a 'data' key
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const deviceSlice = createSlice({
    name: 'deviceType',
    initialState,
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handling createDeviceType
            .addCase(createDeviceType.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createDeviceType.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.devices.push(action.payload.data); // Assuming response includes the created device in 'data'
            })
            .addCase(createDeviceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // Handling getDevices
            .addCase(getDevices.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getDevices.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.devices = action.payload;
            })
            .addCase(getDevices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetState } = deviceSlice.actions;
export default deviceSlice.reducer;
