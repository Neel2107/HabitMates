export const jsonLog = (data: any) => {
    console.log(  JSON.stringify(data, null, 2));
};

export const handleError = (error: any) => {
    console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
    });
};