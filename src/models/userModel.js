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
        create: async (username, password) => {
            return await conn.execute('INSERT INTO visitors (username, password) VALUES (?, ?)', [username, password]);
        },
        changePassword: async (password) => {
            return await conn.execute('UPDATE visitors SET password = ? WHERE id = ?', [password, id]);
        },
        deleteById: async (id) => {
            return await conn.execute('DELETE FROM visitors WHERE id = ?', [id]);
        },
    }


}

export default User;