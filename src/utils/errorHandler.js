const errorHandler = (err, req, res, next) => {
    return res.status(500).json({ status: 500, message: "Something went wrong!" });
}

export default errorHandler;