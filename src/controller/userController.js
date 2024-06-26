import conn from '../config/config.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

const userController = {

    getAllUsers: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const [rows, fields] = await User.fetchAll();
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    },
    getUserById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            const id = parseInt(req.params.id);
            const [rows, fields] = await User.fetchById(id);
            if (rows.length === 0) {
                const error = new Error();
                error.status = 404;
                error.message = "User not found!";
                return next(error);
            }
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    },

    createUser: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
            const [result, fields] = await User.create(username, email, hashPassword);

            if (result.affectedRows === 0) {
                const error = new Error('User creation failed!');
                error.status = 400;
                return next(error);
            }

            res.status(201).json(result);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) {
                try {
                    await req.conn.release();
                } catch (releaseError) {
                    console.error('Error releasing connection:', releaseError);
                }
            }
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            const id = parseInt(req.params.id);
            const [result, fields] = await User.deleteById(id);
            if (result.affectedRows === 0) {
                const error = new Error();
                error.status = 404;
                error.message = "User not found!";
                return next(error);
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    }
}

export default userController;