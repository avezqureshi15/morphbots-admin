import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import ErrorResponse, { handleApiError } from '../utils/errorUtils';
import { URLS } from '../constants/urlConstants';
import axios from 'axios';
type LoginRequest = {
    email: string;
    password: string;
};

type VerifyOTPRequest = {
    email: string;
    otp: string;
};

interface LoginResponse {
    data: string; // The access token
    error: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponse {
    successMessage: string;
    token?: string; // Optional token
    error?: string; // Optional error
}

interface VerifyOTPResponse {
    successMessage: string;
    data?: string; // Optional token
    error?: string; // Optional error
}

interface AuthState {
    status: 'idle' | 'loading' | 'failed';
    access_token: string | null;
    forgotPasswordToken: string | null;
    error: string | null;
    successMessage: string | null;
}

// Initialize state with token from localStorage
const initialState: AuthState = {
    status: 'idle',
    access_token: localStorage.getItem('accessToken') || null,
    forgotPasswordToken: null,
    error: null,
    successMessage: null,
};

export const login = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string[] }>(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<LoginResponse>(URLS.LOGIN, data);
            const { data: token, error } = response.data;

            if (error) {
                console.error('Login error:', error);
                return rejectWithValue([error]);
            }

            localStorage.setItem('accessToken', token);

            return response.data;
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const forgotPassword = createAsyncThunk<
    ForgotPasswordResponse,
    ForgotPasswordRequest,
    { rejectValue: string[] }
>(
    'auth/forgotPassword',
    //@ts-expect-error
    async (request, { rejectWithValue }) => {
        try {
            const url = URLS.FORGOT_PASSWORD(request.email);
            const response = await axiosInstance.post<ForgotPasswordResponse>(url);

            // Ensure response conforms to ForgotPasswordResponse
            const { successMessage, token, error } = response.data;

            if (error) {
                console.error('Forgot password error:', error);
                return rejectWithValue([error]);
            }

            return { successMessage, token: token || null, error: error || null };
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const resendOtp = createAsyncThunk<
    ForgotPasswordResponse,
    ForgotPasswordRequest,
    { rejectValue: string[] }
>(
    'auth/resendOtp',
    //@ts-expect-error
    async (request, { rejectWithValue }) => {
        try {
            const url = URLS.RESEND_OTP(request.email);
            const response = await axiosInstance.post<ForgotPasswordResponse>(url);

            // Ensure response conforms to ForgotPasswordResponse
            const { successMessage, token, error } = response.data;

            if (error) {
                console.error('Resend password error:', error);
                return rejectWithValue([error]);
            }

            return { successMessage, token: token || null, error: error || null };
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const verifyOtp = createAsyncThunk<
    VerifyOTPResponse,
    VerifyOTPRequest,
    { rejectValue: string[] }
>(
    'auth/verifyOtp',
    //@ts-expect-error
    async (data, { rejectWithValue }) => {
        try {
            const url = URLS.VERIFY_OTP(data.email, data.otp);
            const response = await axiosInstance.post<VerifyOTPResponse>(url);

            const { data: token, error } = response.data;

            if (error) {
                console.error('Password verification error:', error);
                return rejectWithValue([error]);
            }

            return { successMessage: 'OTP verified successfully', token, error: null };
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

export const changePassword = createAsyncThunk<
    any,
    string, // the payload is just the password
    { rejectValue: string[] }
>(
    'auth/changePassword',
    async (password: string, { rejectWithValue }) => {
        try {
            const url = URLS.CHANGE_PASSWORD(password);
            const resetToken = localStorage.getItem('resetToken');

            if (!resetToken) {
                throw new Error('No reset token found');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${resetToken}`,
                },
            };

            const response = await axios.post(url, null, config);
            console.log(response);
            return { successMessage: 'Changed Password successfully', error: null };
        } catch (error) {
            const apiErrors = handleApiError(error as ErrorResponse);
            return rejectWithValue(apiErrors);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('accessToken');
            state.access_token = null;
            state.status = 'idle';
            state.error = null;
            state.successMessage = null;
            state.forgotPasswordToken = null;
        },
        resetForgotPasswordState: (state) => {
            state.status = 'idle';
            state.successMessage = null;
            state.error = null;
            state.forgotPasswordToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.status = 'idle';
                    state.access_token = action.payload.data;
                    state.error = null;
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Login failed';
            })
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(
                forgotPassword.fulfilled,
                (state, action: PayloadAction<ForgotPasswordResponse>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.successMessage;
                    state.forgotPasswordToken = action.payload.token || null;
                    state.error = null;
                }
            )
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Forgot password failed';
            })
            .addCase(verifyOtp.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(
                verifyOtp.fulfilled,
                (state, action: PayloadAction<ForgotPasswordResponse>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.successMessage;
                    state.access_token = action.payload.token || null;
                    state.error = null;
                    if (state.access_token) {
                        localStorage.setItem('resetToken', state.access_token);
                    }
                }
            )
            .addCase(verifyOtp.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Password verification failed';
            })
            .addCase(changePassword.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.successMessage = null;
            })
            .addCase(
                changePassword.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.status = 'idle';
                    state.successMessage = action.payload.successMessage;
                    state.error = null;
                }
            )
            .addCase(changePassword.rejected, (state, action) => {
                state.status = 'failed';
                const errors = action.payload as string[];
                state.error = errors[0] || 'Password change failed';
            });
    },
});

export const { logout, resetForgotPasswordState } = authSlice.actions;
export default authSlice.reducer;
