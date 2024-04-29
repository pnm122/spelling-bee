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
// Fetch the 10 most recent puzzles
// TODO: Pagination
router.get('/', async (req, res) => {
    const allPuzzlesRes = await (0, puzzles_1.getAllPuzzles)();
    if (!allPuzzlesRes.success)
        return res.status(500).json(allPuzzlesRes);
    const allPuzzlesReturn = allPuzzlesRes.data.puzzles.map(p => {
        const { _id, ...puzzle } = p;
        return {
            id: p._id.toString(),
            ...puzzle
        };
    });
    res.json({
        success: true,
        data: {
            puzzles: allPuzzlesReturn
        }
    });
});
exports.default = router;
//# sourceMappingURL=all.js.map