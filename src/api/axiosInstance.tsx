import { BASE_URL } from '../constants/urlConstants';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure this is installed and imported

// Function to retrieve the access token from local storage or authentication state
const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// Create an Axios instance with default options
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Ensure credentials are sent with each request
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        // Add the Origin header
        config.headers['Origin'] = 'https://admin-morphbots.netlify.app';
        return config;
    },
    (error) => {
        // Handle request errors
        toast.error('Request error: ' + error.message);
        return Promise.reject(error);
    }
);


// Response interceptor to handle both success and error messages globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Check if the response contains a success message
        if (response.data && response.data.successMessage) {
            toast.success(response.data.successMessage);
        }
        return response;
    },
    (error) => {
        const { response } = error;
        if (response) {
            const { status, data } = response;

            // Aggregate all error messages into a single string
            let errorMessage = '';

            if (data.errors && Array.isArray(data.errors)) {
                errorMessage = data.errors.join(' | '); // Join all error messages with a separator
            } else {
                // Default message if no array of errors is provided
                switch (status) {
                    case 400:
                        errorMessage = 'Bad Request: ' + (data.message || 'Invalid data');
                        break;
                    case 401:
                        errorMessage = 'Unauthorized access. Please log in again.';
                        localStorage.removeItem('accessToken');
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to access this resource.';
                        break;
                    case 404:
                        errorMessage = 'The requested resource was not found.';
                        break;
                    case 500:
                        errorMessage = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = 'An error occurred. Please try again.';
                        break;
                }
            }

            // Show all error messages in a single toast notification
            toast.error(errorMessage);

        } else {
            // Handle network errors or cases where response is not available
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
