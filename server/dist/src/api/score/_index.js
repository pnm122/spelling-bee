"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_word_1 = __importDefault(require("./add_word"));
const get_current_user_1 = __importDefault(require("./get_current_user"));
const activate_word_previews_1 = __importDefault(require("./activate_word_previews"));
const set_hint_1 = __importDefault(require("./set_hint"));
const router = express_1.default.Router();
router.use('/add_word', add_word_1.default);
router.use('/get_current_user', get_current_user_1.default);
router.use('/activate_word_previews', activate_word_previews_1.default);
router.use('/set_hint', set_hint_1.default);
exports.default = router;
//# sourceMappingURL=_index.js.map