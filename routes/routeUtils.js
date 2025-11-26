const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

const asyncHandler = (handler, errorMessage = 'Internal server error') => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error(err);
        res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: errorMessage, error: err.message });
    }
};

module.exports = {
    HTTP_STATUS,
    asyncHandler
};
