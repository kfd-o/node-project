const releaseConnection = async (req) => {
    if (req.conn) {
        await req.conn.release();
    }
}

export default releaseConnection;