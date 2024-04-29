"use strict";
// Utility functions for the Puzzles collection
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPuzzle = exports.getAllPuzzles = exports.getPuzzleByDate = exports.getPuzzleById = void 0;
const mongodb_1 = require("mongodb");
const conn_1 = __importDefault(require("../conn"));
async function getPuzzleById(puzzleId, projection) {
    try {
        if (puzzleId.length != 24) {
            return {
                success: false,
                message: 'no-puzzle'
            };
        }
        const db = await (0, conn_1.default)();
        const findRes = await db.collection('Puzzles').findOne({
            _id: new mongodb_1.ObjectId(puzzleId)
        }, projection ? {
            projection
        } : undefined);
        if (findRes)
            return {
                success: true,
                data: { puzzle: findRes }
            };
        return {
            success: false,
            message: 'no-puzzle'
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.getPuzzleById = getPuzzleById;
async function getPuzzleByDate(date) {
    try {
        const db = await (0, conn_1.default)();
        const findRes = await db.collection('Puzzles').findOne({ date });
        if (findRes)
            return {
                success: true,
                data: { puzzle: findRes }
            };
        return {
            success: false,
            message: 'no-puzzle'
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.getPuzzleByDate = getPuzzleByDate;
// Fetch the 10 most recent puzzles
// TODO: Pagination
async function getAllPuzzles() {
    try {
        const db = await (0, conn_1.default)();
        const findRes = await db.collection('Puzzles').find({}, {
            projection: {
                date: 1,
                centerLetter: 1,
                outsideLetters: 1
            },
            sort: {
                date: -1
            }
        }).limit(10).toArray();
        return {
            success: true,
            data: { puzzles: findRes }
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.getAllPuzzles = getAllPuzzles;
async function insertPuzzle(puzzle) {
    try {
        if (!puzzle ||
            !puzzle.centerLetter ||
            !puzzle.date ||
            !puzzle.maxPoints ||
            !puzzle.outsideLetters ||
            !puzzle.wordList) {
            return {
                success: false,
                message: 'invalid-puzzle'
            };
        }
        const db = await (0, conn_1.default)();
        const insertRes = await db.collection('Puzzles').insertOne(puzzle);
        return {
            success: true,
            data: {
                puzzle: {
                    _id: insertRes.insertedId,
                    ...puzzle
                }
            }
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.insertPuzzle = insertPuzzle;
//# sourceMappingURL=puzzles.js.map