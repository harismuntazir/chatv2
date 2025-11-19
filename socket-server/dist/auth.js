"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (socket, next) => {
    var _a;
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
        console.log('Auth: All cookies:', Object.keys(cookies));
        token = cookies['payload-token'];
        console.log('Auth: Using token:', token ? token.substring(0, 10) + '...' : 'None');
    }
    else {
        console.log('Auth: No token in auth object and no cookies found');
    }
    if (!token) {
        // Allow anonymous connection (for candidates)
        return next();
    }
    try {
        const secret = process.env.PAYLOAD_SECRET || 'f8f23c7dcdc63a4ed725136f';
        console.log('Auth: Using secret:', secret.substring(0, 5) + '...');
        // Try decode first to see if it's a valid JWT
        const decodedUnverified = jsonwebtoken_1.default.decode(token, { complete: true });
        console.log('Auth: Token Header:', decodedUnverified === null || decodedUnverified === void 0 ? void 0 : decodedUnverified.header);
        console.log('Auth: Token Payload ID:', (_a = decodedUnverified === null || decodedUnverified === void 0 ? void 0 : decodedUnverified.payload) === null || _a === void 0 ? void 0 : _a.id);
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        socket.data.user = decoded;
        console.log('Auth: Verified user', decoded.id);
        next();
    }
    catch (err) {
        console.error('Socket auth failed:', err.message);
        console.log('Auth: Proceeding as anonymous due to auth failure');
        next();
    }
};
exports.authMiddleware = authMiddleware;
