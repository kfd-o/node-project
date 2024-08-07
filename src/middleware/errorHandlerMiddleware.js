const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Something went wrong!" });
}

export default errorHandlerMiddleware;