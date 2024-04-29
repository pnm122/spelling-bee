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
router.get('/', async (req, res) => {
    const body = req.body;
    const queryPuzzleId = req.query.puzzleId;
    if (typeof queryPuzzleId != "string") {
        return res.status(400).json({
            success: false,
            message: 'no-puzzle'
        });
    }
    const dbRes = await (0, scores_1.getOrCreateScore)({
        userId: body.session.userId,
        puzzleId: queryPuzzleId
    });
    if (!dbRes.success) {
        if (dbRes.message == 'no-puzzle')
            return res.status(404).json(dbRes);
        else
            return res.status(500).json(dbRes);
    }
    const { created } = dbRes.data;
    // Add 1 to the user's puzzles played if the puzzle score was created (it didn't exist yet)
    if (created) {
        (0, users_1.incrementPuzzlesPlayed)({ userId: body.session.userId });
    }
    const { _id, puzzleId, userId, ...dbScore } = dbRes.data.score;
    res.json({
        success: true,
        data: {
            score: {
                ...dbScore,
                puzzleId: puzzleId.toString(),
                userId: userId.toString(),
                id: _id.toString()
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=get_current_user.js.map