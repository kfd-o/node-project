import express from 'express'
import visitorRoutes from './src/routes/visitorRoutes.js'
import errorHandlerPageNotFound from './src/utils/errorHandlerPageNotFound.js';
import errorHandler from './src/utils/errorHandler.js';

const server = express();
const PORT = process.env.S_PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/api/visitors', visitorRoutes);

server.use(errorHandlerPageNotFound);
server.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

