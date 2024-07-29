import conn from '../config/config.js'

// GENERAL OR GLOBAL
export const create = async (table, userData) => {
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const columns = keys.join(", ");
    const placeholder = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholder})`;

    return await conn.execute(sql, values);
}

export const deleteUserById = async (table, id) => {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    return await conn.execute(sql, [id]);
}

export const usernameExist = async (username) => {
    const tables = [process.env.A, process.env.H, process.env.SP, process.env.V];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        const [rows] = await conn.execute(sql, [username]);

        if (rows.length > 0) return true;
    }

    return false;
}

export const fetchUserByUsername = async (username) => {
    const tables = [process.env.A, process.env.H, process.env.SP, process.env.V];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        const [rows] = await conn.execute(sql, [username]);

        if (rows.length > 0) return rows[0];
    }

    return false;
}

export const changeUserPasswordByEmail = async (email, new_password) => {
    const tables = [process.env.A, process.env.H, process.env.SP, process.env.V];

    for (const table of tables) {
        const sql = `UPDATE ${table} SET password = ? WHERE email = ?`;
        const [result] = await conn.execute(sql, [new_password, email]);
        if (result.affectedRows > 0) {
            return result;
        }
    }

    return false;
}

export const fetchAllUsers = async () => {
    const tables = [process.env.A, process.env.H, process.env.SP, process.env.V];
    let allUsers = [];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table}`;
        const [rows] = await conn.execute(sql);

        if (rows.length > 0) {
            allUsers = allUsers.concat(rows);
        }
    }

    return allUsers.length > 0 ? allUsers : false;
}

export const fetchUsers = async (table) => {
    const sql = `SELECT * FROM ${table}`;
    const [rows] = await conn.query(sql);
    return rows;
}

export const fetchLastUser = async (table) => {
    const sql = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`;
    const [rows] = await conn.execute(sql);
    return rows[0];
}

export const fetchUserByIdAndRoute = async (id, route) => {
    const tables = [process.env.A, process.env.H, process.env.SP, process.env.V];

    for (const table of tables) {
        const sql = `SELECT * FROM ${table} WHERE id = ? AND route = ?`;
        const [rows] = await conn.execute(sql, [id, route]);

        if (rows.length > 0) return rows[0];
    }

    return false;
}

export const requestVisit = async (requestData) => {
    const keys = Object.keys(requestData);
    const values = Object.values(requestData);
    const columns = keys.join(", ");
    const placeholder = keys.map(() => "?").join(", ");
    const sql = `INSERT INTO ${process.env.RV} (${columns}) VALUES (${placeholder})`;

    return await conn.execute(sql, values);
}


// ADMIN
export const addHouse = async (model, description, bedroom, bathroom, carport, floor_area, lot_area, price, image) => {
    const sql = 'INSERT INTO house (model, description, bedroom, bathroom, carport, floor_area, lot_area, price, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return await conn.execute(sql, [model, description, bedroom, bathroom, carport, floor_area, lot_area, price, image]);
}

export const addHouseImages = async (houseId, imageUrls) => {
    const sql = 'INSERT INTO house_images (house_id, image_url) VALUES ?';
    const values = imageUrls.map(url => [houseId, url]);
    return await conn.query(sql, [values]);
};


// HOMEOWNER
export const fetchHomeowners = async () => {
    const sql = 'SELECT * FROM homeowners'
    const [rows] = await conn.query(sql);
    return rows;
}



export const fetchLastHomeowner = async () => {
    const sql = `SELECT * FROM visitors ORDER BY id DESC LIMIT 1`;
    const [rows] = await conn.execute(sql);
    return rows[0];
};

// SECURITY PERSONNEL
export const fetchSecurityPersonnel = async () => {
    const sql = 'SELECT * FROM visitors';
    const [rows] = await conn.query(sql);
    return rows;
};

export const fetchLastSecurityPersonnel = async () => {
    const sql = `SELECT * FROM visitors ORDER BY id DESC LIMIT 1`;
    const [rows] = await conn.execute(sql);
    return rows[0];
};

// VISITOR
export const fetchVisitors = async () => {
    const sql = 'SELECT * FROM visitors';
    const [rows] = await conn.query(sql);
    return rows;
};

export const fetchLastVisitor = async () => {
    const sql = `SELECT * FROM visitors ORDER BY id DESC LIMIT 1`;
    const [rows] = await conn.execute(sql);
    return rows[0];
};

//HOUSE
// export const fetchHouses = async () => {
//     const sql = 'SELECT * FROM '
// }