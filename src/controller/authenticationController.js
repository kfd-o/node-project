import { fetchUserByUsername, fetchUserByIdAndRoute } from "../models/userModel.js"; // Assuming you have fetchUserById function
import { getConnection, releaseConnection } from "../utils/connection.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authenticationController = {
    loginUser: async (req, res, next) => {
        const { username, password } = req.body;

        try {
            req.conn = await getConnection();
            const user = await fetchUserByUsername(username);

            if (!user) {
                return res.status(401).json({ status: 401, msg: "Invalid credentials." });
            }

            const comparedPassword = await bcrypt.compare(password, user.password);

            if (!comparedPassword) {
                return res.status(401).json({ status: 401, msg: "Invalid credentials." });
            }

            const token = jwt.sign({ id: user.id, route: user.route }, process.env.SECRET_KEY, { expiresIn: '7d' });
            const refresh_token = jwt.sign({ id: user.id, route: user.route }, process.env.REFRESH_KEY, { expiresIn: '180d' });

            res.status(200).json({ token: token, refresh_token: refresh_token });
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    checkToken: async (req, res, next) => {
        try {
            req.conn = await getConnection();

            const user = await fetchUserByIdAndRoute(req.userId, req.userRoute);

            if (!user) {
                return res.status(404).json({ status: 404, msg: 'User not found.' });
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    refreshToken: async (req, res, next) => {
        const { token: refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ status: 400, msg: 'Refresh token is required.' });
        }

        try {
            req.conn = await getConnection();
            jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ status: 401, msg: 'Invalid or expired refresh token.' });
                }

                const user = await fetchUserById(decoded.id);

                if (!user) {
                    return res.status(401).json({ status: 401, msg: 'User not found.' });
                }

                const newAccessToken = jwt.sign({ id: user.id, route: user.route }, process.env.SECRET_KEY, { expiresIn: '7d' });
                const newRefreshToken = jwt.sign({ id: user.id, route: user.route }, process.env.REFRESH_KEY, { expiresIn: '180d' });

                res.status(200).json({ token: newAccessToken, refresh_token: newRefreshToken });
            });
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    }
};

export default authenticationController;
