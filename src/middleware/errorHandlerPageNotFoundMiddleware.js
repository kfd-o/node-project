const errorHandlerPageNotFound = (req, res) => {
    console.log('Page not found!')

    return res.status(404).json({ status: 404, msg: "Page Not Found." });
}

export default errorHandlerPageNotFound;