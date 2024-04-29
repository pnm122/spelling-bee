"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const debug_1 = __importDefault(require("../utils/debug"));
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI ?? '');
let db;
// Get connection to MongoDB database
async function getDb() {
    if (!db) {
        (0, debug_1.default)('Connecting to db...');
        try {
            const conn = await client.connect();
            db = conn.db('spelling-bee');
            (0, debug_1.default)('Successfully connected to db.');
        }
        catch (e) {
            (0, debug_1.default)('Connection to db failed.', 'error');
            console.error(e);
        }
    }
    return db;
}
exports.default = getDb;
//# sourceMappingURL=conn.js.map