import conn from '../config/config.js'

const User = {

    Visitor: {
        fetchAll: async () => {
            return await conn.query('SELECT * FROM visitors');
        },
        fetchById: async (id) => {
            return await conn.execute('SELECT * FROM visitors WHERE id = ?', [id]);
        },
        fetchByUsername: async (username) => {
            return await conn.execute('SELECT * FROM visitors WHERE username = ?', [username]);
        },
        create: async (first_name, last_name, username, password, email, contact_num) => {
            return await conn.execute('INSERT INTO visitors (first_name, last_name, username, password, email, contact_num) VALUES (?, ?, ?, ?, ?, ?)', [first_name, last_name, username, password, email, contact_num]);
        },
        changePassword: async (password) => {
            return await conn.execute('UPDATE visitors SET password = ? WHERE id = ?', [password, id]);
        },
        deleteById: async (id) => {
            return await conn.execute('DELETE FROM visitors WHERE id = ?', [id]);
        },
    },

    Homeowner: {
        fetchAll: async () => {
            return await conn.query('SELECT * FROM homeowners');
        },
        fetchById: async (id) => {
            return await conn.execute('SELECT * FROM homeowners WHERE id = ?', [id]);
        },
        fetchByUsername: async (username) => {
            return await conn.execute('SELECT * FROM homeowners WHERE username = ?', [username]);
        },
        create: async (username, password) => {
            return await conn.execute('INSERT INTO homeowners (username, password) VALUES (?, ?)', [username, password]);
        },
        changePassword: async (password) => {
            return await conn.execute('UPDATE homeowners SET password = ? WHERE id = ?', [password, id]);
        },
        deleteById: async (id) => {
            return await conn.execute('DELETE FROM homeowners WHERE id = ?', [id]);
        },
    },

    Admin: {
        fetchAll: async () => {
            return await conn.query('SELECT * FROM admins');
        },
        fetchById: async (id) => {
            return await conn.execute('SELECT * FROM admins WHERE id = ?', [id]);
        },
        fetchByUsername: async (username) => {
            return await conn.execute('SELECT * FROM admins WHERE username = ?', [username]);
        },
        create: async (username, password) => {
            return await conn.execute('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password]);
        },
        changePassword: async (password) => {
            return await conn.execute('UPDATE admins SET password = ? WHERE id = ?', [password, id]);
        },
        deleteById: async (id) => {
            return await conn.execute('DELETE FROM admins WHERE id = ?', [id]);
        },
    },
}

export default User;