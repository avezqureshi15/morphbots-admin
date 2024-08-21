export default interface ErrorResponse {
    message: string;
    error: {
        [key: string]: string[];
    };
}

export const handleApiError = (error: ErrorResponse) => {
    const combinedErrors: string[] = [];
    if (error.error) {
        Object.keys(error.error).forEach((key) => {
            combinedErrors.push(...error.error[key]);
        });
        return combinedErrors;
    } else {
        return [error.message];
    }
};
