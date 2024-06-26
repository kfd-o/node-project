import express from 'express'
import userRoutes from './src/routes/userRoutes.js'
import errorHandlerPageNotFound from './src/utils/errorHandlerPageNotFound.js';
import errorHandler from './src/utils/errorHandler.js';

const server = express();
const PORT = process.env.S_PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/api/users', userRoutes);

server.use(errorHandlerPageNotFound);
server.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

