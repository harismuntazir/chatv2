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
        // Allow anonymous connection (for candidates)
        return next();
    }
    try {
        const secret = process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE'; // Ensure this matches Payload secret
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        socket.data.user = decoded;
        next();
    }
    catch (err) {
        // If token is invalid, still allow connection but without user data?
        // Or fail? For now, let's allow it as anonymous to prevent blocking.
        console.warn('Socket auth failed, proceeding as anonymous');
        next();
    }
};
exports.authMiddleware = authMiddleware;
