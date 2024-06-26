import conn from '../config/config.js'
import Visitor from '../models/visitorModel.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

const visitorController = {

    getAllVisitors: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const [rows, fields] = await Visitor.fetchAll();
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) {
                return await req.conn.release();
            }
        }
    },
    getVisitorById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ status: 400, msg: "Bad Request!" });
            }
            const [rows, fields] = await Visitor.fetchById(id);
            if (rows.length == 0) {
                return res.status(404).json({ status: 404, msg: "Visitor not found!" });
            }
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) {
                return await req.conn.release();
            }
        }
    },

    createVisitor: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { username, password } = req.body;
            const [rows] = await Visitor.fetchByUsername(username);
            if (rows.length > 0) {
                return res.status(409).json({ status: 409, msg: "Username is already in use." });
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const [result] = await Visitor.create(username, hashPassword);
            if (result.affectedRows === 0) {
                return res.status(400).json({ status: 400, msg: "Visitor creation failed." });
            }
            res.status(201).json(result);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) {
                return await req.conn.release();
            }
        }
    },

    deleteVisitorById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const id = parseInt(req.params.id);
            const [result, fields] = await Visitor.deleteById(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 404, msg: "Visitor not found." });
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) {
                return await req.conn.release();
            }
        }
    }
}

export default visitorController;