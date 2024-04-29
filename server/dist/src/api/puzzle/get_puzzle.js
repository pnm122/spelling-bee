"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puzzles_1 = require("../../db/utils/puzzles");
const middlewares_1 = require("../../middlewares");
const router = express_1.default.Router();
router.use(middlewares_1.authenticated);
router.get('/', async (req, res) => {
    const puzzleRes = await (0, puzzles_1.getPuzzleById)(req.query.id);
    if (!puzzleRes.success) {
        if (puzzleRes.message == 'no-puzzle')
            return res.status(404).json(puzzleRes);
        else
            return res.status(500).json(puzzleRes);
    }
    const { _id, ...puzzle } = puzzleRes.data.puzzle;
    res.json({
        success: true,
        data: {
            puzzle: {
                id: _id.toString(),
                ...puzzle
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=get_puzzle.js.map