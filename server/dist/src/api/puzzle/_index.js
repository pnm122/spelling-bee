"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_puzzle_1 = __importDefault(require("./get_puzzle"));
const daily_1 = __importDefault(require("./daily"));
const all_1 = __importDefault(require("./all"));
const router = express_1.default.Router();
router.use('/daily', daily_1.default);
router.use('/all', all_1.default);
router.use('/get', get_puzzle_1.default);
exports.default = router;
//# sourceMappingURL=_index.js.map