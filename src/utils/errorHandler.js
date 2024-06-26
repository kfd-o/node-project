const errorHandler = (err, req, res, next) => {
    if (err.status == 404) return res.status(404).json(err);
    if (err.status == 400) return res.status(400).json(err);

    res.status(500).json({ status: 500, message: "Something went wrong!" });
}

export default errorHandler;