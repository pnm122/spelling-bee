"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const scores_1 = require("../../db/utils/scores");
const users_1 = require("../../db/utils/users");
const router = express_1.default.Router();
router.use(middlewares_1.authenticated);
router.post('/', async (req, res) => {
    const body = req.body;
    const updateScoreRes = await (0, scores_1.addWord)({
        scoreId: body.scoreId,
        word: body.word
    });
    if (!updateScoreRes.success) {
        if (updateScoreRes.message == 'no-score')
            return res.status(400).json(updateScoreRes);
        else
            return res.status(500).json(updateScoreRes);
    }
    const updateStatsRes = await (0, users_1.addWordToUser)({
        userId: body.session.userId,
        word: body.word,
        score: updateScoreRes.data.score
    });
    if (!updateStatsRes.success) {
        if (updateStatsRes.message == 'invalid-user-id')
            return res.status(400).json(updateStatsRes);
        if (updateStatsRes.message == 'no-puzzle')
            return res.status(400).json(updateStatsRes);
        else
            return res.status(500).json(updateStatsRes);
    }
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=add_word.js.map