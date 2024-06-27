import express from 'express'
import visitorRoutes from './src/routes/visitorRoutes.js'
import authenticationRoutes from './src/routes/authenticationRoutes.js'
import errorHandlerPageNotFoundMiddleware from './src/middleware/errorHandlerPageNotFoundMiddleware.js';
import errorHandlerMiddleware from './src/middleware/errorHandlerMiddleware.js';


const server = express();
const PORT = process.env.S_PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use('/protected', visitorRoutes);
server.use('/api', authenticationRoutes);

server.use(errorHandlerPageNotFoundMiddleware);
server.use(errorHandlerMiddleware);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

