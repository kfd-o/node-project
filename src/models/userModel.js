import conn from '../config/config.js'

const User = {
    fetchAll: async () => {
        return await conn.query('SELECT * FROM users');
    },
    fetchById: async (id) => {
        return await conn.execute('SELECT * FROM users WHERE id = ?', [id]);
    },
    create: async (username, email, password) => {
        return await conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    },
    changePassword: async (password) => {
        return await conn.execute('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    },
    deleteById: async (id) => {
        return await conn.execute('DELETE FROM users WHERE id = ?', [id]);
    },
}

export default User;