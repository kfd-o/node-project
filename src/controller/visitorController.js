import conn from '../config/config.js'
import Visitor from '../models/userModel.js'

const visitorController = {
    getAllVisitors: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const [rows, fields] = await Visitor.fetchAll();
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    },
    getVisitorById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ status: 400, msg: "Bad Request!" });
            const [rows, fields] = await Visitor.fetchById(id);
            if (rows.length == 0) return res.status(404).json({ status: 404, msg: "Visitor not found!" });
            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    },
    deleteVisitorById: async (req, res, next) => {
        try {
            req.conn = await conn.getConnection();
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ status: 400, msg: "Bad Request!" });
            const [result, fields] = await Visitor.deleteById(id);
            if (result.affectedRows === 0) return res.status(404).json({ status: 404, msg: "Visitor not found." });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        } finally {
            if (req.conn) return await req.conn.release();
        }
    }
}

export default visitorController;