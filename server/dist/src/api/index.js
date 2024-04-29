"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _index_1 = __importDefault(require("./user/_index"));
const _index_2 = __importDefault(require("./puzzle/_index"));
const _index_3 = __importDefault(require("./score/_index"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    res.json({
        success: true,
        message: 'API - 👋🌎🌍🌏',
    });
});
router.use('/user', _index_1.default);
router.use('/puzzle', _index_2.default);
router.use('/score', _index_3.default);
exports.default = router;
//# sourceMappingURL=index.js.map