const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ status: 500, message: "Something went wrong!" });
}

export default errorHandlerMiddleware;