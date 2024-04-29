"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const scores_1 = require("../../db/utils/scores");
const router = express_1.default.Router();
// Set the user's hint if a hint object is provided, otherwise remove the hint from the database
router.use(middlewares_1.authenticated);
router.post('/', async (req, res) => {
    const body = req.body;
    const { scoreId, hint } = body;
    if (!scoreId)
        return res.status(400).json({
            success: false,
            message: 'no-score'
        });
    if (hint && (!hint.lettersGiven || !hint.word))
        return res.status(400).json({
            success: false,
            message: 'invalid-hint'
        });
    const updateRes = await (0, scores_1.setHint)({
        scoreId,
        hint
    });
    if (!updateRes.success) {
        if (updateRes.message == 'no-score')
            return res.status(400).json(updateRes);
        else
            return res.status(500).json(updateRes);
    }
    return res.json(updateRes);
});
exports.default = router;
//# sourceMappingURL=set_hint.js.map