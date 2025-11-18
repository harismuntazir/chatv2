"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const secret = process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE'; // Ensure this matches Payload secret
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        next(new Error('Authentication error'));
    }
};
exports.authMiddleware = authMiddleware;
