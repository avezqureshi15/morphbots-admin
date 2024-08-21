import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URLS } from '../constants/urlConstants';
import axiosInstance from '../api/axiosInstance';

interface DeviceType {
    name: string | null;
    description: string | null;
    active: boolean | null;
}

interface Configuration {
    id: string;
    created_at: string;
    updated_at: string;
    device_type_id: string;
    device_type: DeviceType;
    key: string;
    value: string;
    description: string;
}

interface ConfigurationsResponse {
    data: Configuration[];
    error: string;
}

interface ConfigurationsState {
    configurations: Configuration[];
    loading: boolean;
    error: string | null;
}

// Async thunk to fetch configurations based on device_type_id
export const getConfigurations = createAsyncThunk<Configuration[], string, { rejectValue: string }>(
    'configurations/get',
    async (device_type_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ConfigurationsResponse>(URLS.GET_CONFIGURATIONS(device_type_id));
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Something went wrong');
        }
    }
);

const configurationsSlice = createSlice({
    name: 'configurations',
    initialState: {
        configurations: [],
        loading: false,
        error: null,
    } as ConfigurationsState,
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConfigurations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConfigurations.fulfilled, (state, action) => {
                state.loading = false;
                state.configurations = action.payload;
            })
            .addCase(getConfigurations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetState } = configurationsSlice.actions;
export default configurationsSlice.reducer;
