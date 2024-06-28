import conn from "../config/config.js";

const fetchUser = async (username) => {
    const tables = [process.env.V, process.env.H, process.env.A];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        const [rows] = await conn.execute(sql, [username]);

        if (rows.length > 0) return rows[0];
    }

    return false;
}

export default fetchUser;