import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { URLS } from '../constants/urlConstants';

interface Slot {
    id: string;
    created_at: string;
    updated_at: string;
    booking_type: string;
    time: number;
    cost: number;
}

interface SlotState {
    slots: Slot[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SlotState = {
    slots: [],
    loading: false,
    error: null,
    success: false,
};

// Async thunk to fetch slots
export const getSlots = createAsyncThunk(
    'slot/getSlots',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(URLS.GET_SLOTS);
            return response.data; // Directly return the array of slots
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createSlot = createAsyncThunk(
    'slot/createSlot',
    async (data: { booking_type: string; time: number; cost: number }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(URLS.CREATE_SLOT, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to update a slot
export const updateSlot = createAsyncThunk(
    'slot/updateSlot',
    async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${URLS.UPDATE_SLOTS(id)}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const slotSlice = createSlice({
    name: 'slot',
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
            // Handling getSlots
            .addCase(getSlots.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getSlots.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.slots = action.payload; // Set slots to the response data array
            })
            .addCase(getSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // Handling updateSlot
            .addCase(updateSlot.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateSlot.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Update the slot in the slots array
                const updatedSlot = action.payload;
                state.slots = state.slots.map(slot =>
                    slot.id === updatedSlot.id ? updatedSlot : slot
                );
            })
            .addCase(updateSlot.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(createSlot.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createSlot.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Add the new slot to the slots array
                state.slots.push(action.payload);
            })
            .addCase(createSlot.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetState } = slotSlice.actions;
export default slotSlice.reducer;
