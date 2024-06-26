import express from 'express'
import conn from '../config/config.js'
import Visitor from '../models/visitorModel.js';
import bcrypt from 'bcrypt'

const router = express();

router.post('/', async (req, res, next) => {
    try {
        req.conn = await conn.getConnection();
        const { username, password } = req.body
        const [rows] = await Visitor.fetchByUsername(username)
        const user = await bcrypt.compare(password, rows[0].password);
        if (!user) {
            return res.status(401).json({ status: 401, msg: "Invalid Credentials." })
        }

        res.status(200).json({ msg: "Login Successfully." })
    } catch (error) {
        next(error)
    } finally {
        if (req.conn) {
            return await req.conn.release()
        }
    }
})

export default router;