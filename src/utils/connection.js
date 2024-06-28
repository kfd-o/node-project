import conn from '../config/config.js'

export const getConnection = async () => {
    return await conn.getConnection();
}

export const releaseConnection = async (req) => {
    if (req.conn) {
        await req.conn.release();
    }
}

