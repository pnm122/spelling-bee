"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../../db/utils/users");
const sessions_1 = require("../../db/utils/sessions");
const validation_1 = require("../../shared/utils/validation");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'user-info-not-provided'
        });
    }
    if (!(0, validation_1.isValidUsername)(username.trim())) {
        return res.status(400).json({
            success: false,
            message: 'invalid-username'
        });
    }
    if (!(0, validation_1.isValidPassword)(password.trim())) {
        return res.status(400).json({
            success: false,
            message: 'invalid-password'
        });
    }
    const createUserRes = await (0, users_1.createUser)({ username, password });
    if (!createUserRes.success) {
        if (createUserRes.message == 'user-exists')
            return res.status(400).json(createUserRes);
        return res.status(500).json(createUserRes);
    }
    const sessionRes = await (0, sessions_1.createSession)(createUserRes.data.user.id);
    if (!sessionRes.success)
        return res.status(500).json(sessionRes);
    res.cookie('session', sessionRes.data.sessionId, { maxAge: parseInt(process.env.SESSION_EXPIRE_TIME) * 1000 });
    return res.json({
        success: true,
        data: {
            user: createUserRes.data.user
        }
    });
});
exports.default = router;
//# sourceMappingURL=signup.js.map