"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (socket, next) => {
    let token = socket.handshake.auth.token;
    // If no token in auth object, try to parse from cookies (for httpOnly cookies)
    if (!token && socket.handshake.headers.cookie) {
        console.log('Auth: Parsing cookies from headers');
        const cookies = socket.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        token = cookies['payload-token'];
        console.log('Auth: Found token in cookies:', token ? 'Yes' : 'No');
    }
    else {
        console.log('Auth: No token in auth object and no cookies found');
    }
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
