"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessions_1 = require("../../db/utils/sessions");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const sessionId = req.cookies['session'];
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: 'no-session'
        });
    }
    const deleteRes = await (0, sessions_1.deleteSession)(sessionId);
    if (deleteRes.success) {
        // Delete client's session cookie since the session was successfully removed from the database
        res.clearCookie('session');
        return res.json({
            success: true,
            message: 'Logged out'
        });
    }
    if (deleteRes.message == 'invalid-session') {
        return res.status(401).json(deleteRes);
    }
    res.status(500).json({
        success: false,
        message: 'unknown-error'
    });
});
exports.default = router;
//# sourceMappingURL=logout.js.map