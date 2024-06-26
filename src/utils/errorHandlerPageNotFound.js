const errorHandlerPageNotFound = (req, res) => {
    return res.status(404).json({ status: 404, msg: "Page Not Found." });
}

export default errorHandlerPageNotFound;