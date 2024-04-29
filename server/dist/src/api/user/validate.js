"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const router = express_1.default.Router();
router.use(middlewares_1.authenticated);
router.get('/', async (req, res) => {
    // session obtained from authenticated middleware
    const session = req.body.session;
    res.json({
        success: true,
        data: {
            userId: session.userId
        }
    });
});
exports.default = router;
//# sourceMappingURL=validate.js.map