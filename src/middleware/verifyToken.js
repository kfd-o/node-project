import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ msg: 'No token provided.' });
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ msg: 'Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        req.userRoute = decoded.route;
        next();
    });
};

export default verifyToken;

