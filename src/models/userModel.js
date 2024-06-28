import conn from '../config/config.js'

export const create = async (table, userData) => {
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const columns = keys.join(", ");
    const placeholder = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholder})`;

    return await conn.execute(sql, values);
}

export const usernameExist = async (username) => {
    const tables = [process.env.V, process.env.H, process.env.A];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        const [rows] = await conn.execute(sql, [username]);

        if (rows.length > 0) return true;
    }

    return false;
}

export const fetchUser = async (username) => {
    const tables = [process.env.V, process.env.H, process.env.A];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        const [rows] = await conn.execute(sql, [username]);

        if (rows.length > 0) return rows[0];
    }

    return false;
}

// const user = {

//     visitor: {
//         fetchAll: async () => {
//             return await conn.query('SELECT * FROM visitors');
//         },
//         fetchById: async (id) => {
//             return await conn.execute('SELECT * FROM visitors WHERE id = ?', [id]);
//         },
//         fetchByUsername: async (username) => {
//             return await conn.execute('SELECT * FROM visitors WHERE username = ?', [username]);
//         },
//         create: async (first_name, last_name, username, password, email, contact_num) => {
//             return await conn.execute('INSERT INTO visitors (first_name, last_name, username, password, email, contact_num) VALUES (?, ?, ?, ?, ?, ?)', [first_name, last_name, username, password, email, contact_num]);
//         },
//         changePassword: async (password) => {
//             return await conn.execute('UPDATE visitors SET password = ? WHERE id = ?', [password, id]);
//         },
//         deleteById: async (id) => {
//             return await conn.execute('DELETE FROM visitors WHERE id = ?', [id]);
//         },
//     },

//     homeowner: {
//         fetchAll: async () => {
//             return await conn.query('SELECT * FROM homeowners');
//         },
//         fetchById: async (id) => {
//             return await conn.execute('SELECT * FROM homeowners WHERE id = ?', [id]);
//         },
//         fetchByUsername: async (username) => {
//             return await conn.execute('SELECT * FROM homeowners WHERE username = ?', [username]);
//         },
//         create: async (username, password) => {
//             return await conn.execute('INSERT INTO homeowners (username, password) VALUES (?, ?)', [username, password]);
//         },
//         changePassword: async (password) => {
//             return await conn.execute('UPDATE homeowners SET password = ? WHERE id = ?', [password, id]);
//         },
//         deleteById: async (id) => {
//             return await conn.execute('DELETE FROM homeowners WHERE id = ?', [id]);
//         },
//     },

//     admin: {
//         fetchAll: async () => {
//             return await conn.query('SELECT * FROM admins');
//         },
//         fetchById: async (id) => {
//             return await conn.execute('SELECT * FROM admins WHERE id = ?', [id]);
//         },
//         fetchByUsername: async (username) => {
//             return await conn.execute('SELECT * FROM admins WHERE username = ?', [username]);
//         },
//         create: async (username, password) => {
//             return await conn.execute('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password]);
//         },
//         changePassword: async (password) => {
//             return await conn.execute('UPDATE admins SET password = ? WHERE id = ?', [password, id]);
//         },
//         deleteById: async (id) => {
//             return await conn.execute('DELETE FROM admins WHERE id = ?', [id]);
//         },
//     },
// }

