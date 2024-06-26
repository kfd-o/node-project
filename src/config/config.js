import mysql from 'mysql2/promise'

const conn = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: parseInt(process.env.P_PORT),
    waitForConnections: Boolean(process.env.WAIT_FOR_CONNECTIONS),
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT),
    queueLimit: parseInt(process.env.QUEUE_LIMIT)
})

export default conn;