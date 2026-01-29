import { AppError } from "@/middleware/errorHandler";

const createTokenError = (code: string, statusCode: number = 401) => {
    const error = new Error('Invalid or expired authentication token') as AppError;
    error.statusCode = statusCode;
    error.code = code;
    return error;
};

export default createTokenError