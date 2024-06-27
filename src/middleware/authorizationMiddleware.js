import jwt from 'jsonwebtoken'

const authorizationMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ status: 401, msg: "Token is missing." });
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json("Invalid or expired token.");
        }
        console.log(user)
        req.user = user;
        next();
    });
}

export default authorizationMiddleware;