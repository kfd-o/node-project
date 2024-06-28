import conn from '../config/config.js'

const getConnection = async () => {
    return await conn.getConnection();
}

export default getConnection;