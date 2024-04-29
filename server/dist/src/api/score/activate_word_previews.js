"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const scores_1 = require("../../db/utils/scores");
const router = express_1.default.Router();
router.use(middlewares_1.authenticated);
router.post('/', async (req, res) => {
    const scoreId = req.body.scoreId;
    if (!scoreId)
        return res.status(400).json({
            success: false,
            message: 'no-score'
        });
    const activateRes = await (0, scores_1.activateWordPreviews)({ scoreId });
    if (!activateRes.success) {
        if (activateRes.message == 'no-score')
            return res.status(400).json(activateRes);
        else
            return res.status(500).json(activateRes);
    }
    return res.json(activateRes);
});
exports.default = router;
//# sourceMappingURL=activate_word_previews.js.map