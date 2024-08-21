import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { URLS } from '../constants/urlConstants';
import ErrorResponse, { handleApiError } from '../utils/errorUtils';

// Define interfaces
interface CreateAdminRequest {
    full_name: string;
    email: string;
    password: string;
    role: string;
}

interface CreateAdminResponse {
    success: boolean;
    message: string;
}

interface Admin {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface AdminDetailsResponse {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface AdminState {
    status: 'idle' | 'loading' | 'failed';
    successMessage: string | null;
    error: string | null;
    admins: Admin[];
    loggedAdmin: AdminDetailsResponse | null;
}

// Define initial state
const initialState: AdminState = {
    status: 'idle',
    successMessage: null,
    error: null,
    admins: [],
    loggedAdmin: null,
};

// Define async thunks
export const createAdminThunk = createAsyncThunk<
    CreateAdminResponse,
    CreateAdminRequest,
    { rejectValue: string[] }
>(
    'admin/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<CreateAdminResponse>(URLS.CREATE_ADMIN, data);
            return response.data;
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const getAdminsThunk = createAsyncThunk<
    Admin[],
    void,
    { rejectValue: string[] }
>(
    'admin/get',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: Admin[] }>(URLS.GET_ADMINS);
            return response.data.data;
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const deleteAdminThunk = createAsyncThunk<
    { id: string; message: string },
    string, // id of the admin to be deleted
    { rejectValue: string[] }
>(
    'admin/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(URLS.DELETE_ADMIN(id));
            return { id, message: response.data.message }; // Return ID and message
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const editAdminThunk = createAsyncThunk<
    { id: string; message: string },
    { id: string; data: Partial<CreateAdminRequest> },
    { rejectValue: string[] }
>(
    'admin/edit',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put<{ success: boolean; message: string }>(URLS.EDIT_ADMIN(id), data);
            return { id, message: response.data.message }; // Return ID and message
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const getAdminDetailsThunk = createAsyncThunk<
    AdminDetailsResponse,
    void,
    { rejectValue: string[] }
>(
    'admin/getDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: AdminDetailsResponse }>(URLS.GET_ADMIN_DETAILS);
            return response.data.data;
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);


// Create slice
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAdminThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                createAdminThunk.fulfilled,
                (state, action: PayloadAction<CreateAdminResponse>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.message;
                    state.error = null;
                }
            )
            .addCase(createAdminThunk.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Failed to create admin';
            })
            .addCase(getAdminsThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                getAdminsThunk.fulfilled,
                (state, action: PayloadAction<Admin[]>) => {
                    state.status = 'idle';
                    state.admins = action.payload;
                    state.error = null;
                }
            )
            .addCase(getAdminsThunk.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Failed to fetch admins';
            })
            .addCase(deleteAdminThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                deleteAdminThunk.fulfilled,
                (state, action: PayloadAction<{ id: string; message: string }>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.message;
                    state.error = null;
                    // Remove the deleted admin from the state
                    state.admins = state.admins.filter(admin => admin.id !== action.payload.id);
                }
            )
            .addCase(deleteAdminThunk.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Failed to delete admin';
            })
            .addCase(editAdminThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                editAdminThunk.fulfilled,
                (state, action: PayloadAction<{ id: string; message: string }>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.message;
                    state.error = null;
                    const { id } = action.payload;
                    state.admins = state.admins.map(admin =>
                        //@ts-expect-error
                        admin.id === id ? { ...admin, ...action.meta.arg.data } : admin
                    );
                }
            )
            .addCase(editAdminThunk.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Failed to edit admin';
            })
            .addCase(getAdminDetailsThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loggedAdmin = null; // Clear previous details
            })
            .addCase(
                getAdminDetailsThunk.fulfilled,
                (state, action: PayloadAction<AdminDetailsResponse>) => {
                    state.status = 'idle';
                    state.loggedAdmin = action.payload;
                    state.error = null;
                }
            )
            .addCase(getAdminDetailsThunk.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Failed to fetch admin details';
            });
    },
});

export default adminSlice.reducer;
