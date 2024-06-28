import Visitor from '../models/userModel.js'
import getConnection from '../utils/getConnection.js'
import releaseConnection from '../utils/releaseConnection.js'

const visitorController = {

    getAllVisitors: async (req, res, next) => {
        try {
            req.conn = await getConnection();
            const [rows, fields] = await Visitor.fetchAll();

            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    getVisitorById: async (req, res, next) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, msg: "Bad Request!" });
        }

        try {
            req.conn = await getConnection();
            const [rows, fields] = await Visitor.fetchById(id);

            if (rows.length == 0) {
                return res.status(404).json({ status: 404, msg: "Visitor not found!" });
            }

            res.status(200).json(rows);
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    deleteVisitorById: async (req, res, next) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ status: 400, msg: "Bad Request!" });
        }

        try {
            req.conn = await getConnection();
            const [result, fields] = await Visitor.deleteById(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 404, msg: "Visitor not found." });
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        } finally {
            await releaseConnection(req);
        }
    }
}

export default visitorController;