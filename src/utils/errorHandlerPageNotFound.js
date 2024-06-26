const errorHandlerPageNotFound = (req, res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = "Page Not Found!"
    next(error);
}

export default errorHandlerPageNotFound;