import { create, usernameExist, fetchUser } from "../models/userModel.js"
import { getConnection, releaseConnection } from "../utils/connection.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator"

const authenticationController = {

    signupVisitor: async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const table = process.env.V;
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            contact_num: req.body.contact_num
        }

        try {

            req.conn = await getConnection();

            const isExist = await usernameExist(userData.username);

            if (isExist) {
                return res.status(401).json({ status: 401, msg: "Username is already in use." });
            }

            const hashPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashPassword;

            const [result] = await create(table, userData);

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

        const { username, password } = req.body

        try {
            req.conn = await getConnection();
            const user = await fetchUser(username);

            if (!user) {
                return res.status(401).json({ status: 401, msg: "Invalid credentials." });
            }

            const comparedPassword = await bcrypt.compare(password, user.password);

            if (!comparedPassword) {
                return res.status(401).json({ status: 401, msg: "Invalid Credentials." });
            }

            const token = jwt.sign({ id: user.id, route: user.route }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const refresh_token = jwt.sign({ id: user.id, route: user.route }, process.env.REFRESH_KEY, { expiresIn: '7d' });

            res.status(200).json({ token: token, refresh_token: refresh_token });
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    }
}

export default authenticationController;