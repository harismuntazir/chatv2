"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./auth");
const messageHandler_1 = require("./handlers/messageHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // TODO: Restrict in production
        methods: ['GET', 'POST'],
    },
});
console.log('Socket.IO server starting with in-memory adapter');
(async () => {
    io.use(auth_1.authMiddleware);
    io.on('connection', (socket) => {
        var _a;
        console.log(`User connected: ${(_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id}`);
        socket.on('joinChat', ({ conversationId }) => {
            var _a;
            // TODO: Verify user access to conversation
            socket.join(`chat:${conversationId}`);
            console.log(`User ${(_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.id} joined chat:${conversationId}`);
        });
        socket.on('message', (payload) => (0, messageHandler_1.messageHandler)(io, socket, payload));
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    const PORT = process.env.SOCKET_PORT || 38120;
    httpServer.listen(PORT, () => {
        console.log(`Socket server running on port ${PORT}`);
    });
})();
