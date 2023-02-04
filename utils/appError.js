class AppError extends Error {
    constructor(message, statusCode) {
        super(message);  // parent class called
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')? 'fail' : 'error';
        this.isOperational = true;       // for operational errors
        Error.captureStackTrace(this, this.constructor); // replaces 'err.stackTrace' 
    }
}

module.exports = AppError;