import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usernameExist from '../utils/usernameExist.js'
import getConnection from '../utils/getConnection.js'
import releaseConnection from '../utils/releaseConnection.js'
import { validationResult } from "express-validator"

const authenticationController = {

    signupVisitor: async (req, res, next) => {
        const { username, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            req.conn = await getConnection();
            const isExist = await usernameExist(username);

            if (isExist) {
                return res.status(401).json({ status: 401, msg: "Username is already in use." });
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const [result] = await User.Visitor.create(username, hashPassword);

            if (result.affectedRows === 0) {
                return res.status(400).json({ status: 400, msg: "Visitor creation failed." });
            }

            res.status(201).json(result);
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    loginUser: async (req, res, next) => {
        const { username, password } = req.body;

        try {
            req.conn = await getConnection();
            const [rows] = await User.Visitor.fetchByUsername(username);

            if (rows.length == 0) {
                return res.status(401).json({ status: 401, msg: "Invalid credentials." });
            }

            const user = await bcrypt.compare(password, rows[0].password);

            if (!user) {
                return res.status(401).json({ status: 401, msg: "Invalid Credentials." });
            }

            const token = jwt.sign({ name: rows[0].username, role: "visitor" }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const refresh_token = jwt.sign({ name: rows[0].username, role: "visitor" }, process.env.REFRESH_KEY, { expiresIn: '7d' });

            res.status(200).json({ token: token, refresh_token: refresh_token });
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    }
}

export default authenticationController;