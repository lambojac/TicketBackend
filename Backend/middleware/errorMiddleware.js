const errorHandler = (err, req, res, next) => {

    const codeStatus = res.codeStatus ? res.
    codeStatus: 500
    res.status(codeStatus)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? 
        err.stack : null,
    });
};

export default errorHandler;
