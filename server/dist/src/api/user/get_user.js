"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const users_1 = require("../../db/utils/users");
const router = express_1.default.Router();
router.use(middlewares_1.authenticated);
router.get('/', async (req, res) => {
    const session = req.body.session;
    const getUserRes = await (0, users_1.getUser)(session.userId);
    if (!getUserRes.success) {
        if (getUserRes.message == 'invalid-user-id')
            return res.status(401).json(getUserRes);
        else
            return res.status(500).json(getUserRes);
    }
    res.json(getUserRes);
});
exports.default = router;
//# sourceMappingURL=get_user.js.map