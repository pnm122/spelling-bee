"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puzzles_1 = require("../../db/utils/puzzles");
const generatePuzzle_1 = __importDefault(require("../../utils/generatePuzzle"));
const getTodaysDate_1 = __importDefault(require("../../shared/utils/getTodaysDate"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const getPuzzleRes = await (0, puzzles_1.getPuzzleByDate)((0, getTodaysDate_1.default)());
    if (getPuzzleRes.success) {
        const { _id, ...puzzle } = getPuzzleRes.data.puzzle;
        return res.json({
            success: true,
            data: {
                puzzle: {
                    id: _id.toString(),
                    ...puzzle
                }
            }
        });
    }
    const newPuzzleData = await (0, generatePuzzle_1.default)();
    const insertRes = await (0, puzzles_1.insertPuzzle)(newPuzzleData);
    if (!insertRes.success) {
        return res.status(500).json({ success: false, message: 'failed-to-create-puzzle' });
    }
    const { _id, ...puzzle } = insertRes.data.puzzle;
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
//# sourceMappingURL=daily.js.map