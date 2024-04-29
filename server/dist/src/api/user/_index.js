"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const logout_1 = __importDefault(require("./logout"));
const validate_1 = __importDefault(require("./validate"));
const get_user_1 = __importDefault(require("./get_user"));
const router = express_1.default.Router();
router.use('/signup', signup_1.default);
router.use('/login', login_1.default);
router.use('/logout', logout_1.default);
router.use('/validate', validate_1.default);
router.use('/get_user', get_user_1.default);
exports.default = router;
//# sourceMappingURL=_index.js.map