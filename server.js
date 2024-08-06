import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authenticationRoutes from "./src/routes/authenticationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import houseRoutes from "./src/routes/houseRoutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import errorHandlerPageNotFoundMiddleware from "./src/middleware/errorHandlerPageNotFoundMiddleware.js";
import errorHandlerMiddleware from "./src/middleware/errorHandlerMiddleware.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.S_PORT || 8080;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", authenticationRoutes);
app.use("/api", userRoutes);
app.use("/api", houseRoutes);
app.use("/api", requestRoutes);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use(errorHandlerPageNotFoundMiddleware);
app.use(errorHandlerMiddleware);

// Socket.io setup
io.on("connection", () => {
  console.log("Client connected");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
