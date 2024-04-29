"use strict";
// Utility functions for the Scores collection
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHint = exports.activateWordPreviews = exports.addWord = exports.getOrCreateScore = void 0;
const mongodb_1 = require("mongodb");
const conn_1 = __importDefault(require("../conn"));
const puzzles_1 = require("./puzzles");
/**
* Get a user's score on a given puzzle, creating one if it doesn't already exist. If the puzzle does not exist, return a no-puzzle error.
* @param {Object} params
* @param {string} params.userId - User's 24-character identifier
* @param {string} params.puzzleId - 24-character puzzle identifier
* @return {Promise<GetOrCreateScoreResponse>} Contains user score in data.score if successful, otherwise returns the appropriate error
*/
async function getOrCreateScore({ userId, puzzleId }) {
    try {
        // Object IDs must be 24 characters long
        if (!(userId.length == 24 && puzzleId.length == 24)) {
            return {
                success: false,
                message: 'no-puzzle'
            };
        }
        const db = await (0, conn_1.default)();
        const findRes = await db.collection('Scores').findOne({
            userId: new mongodb_1.ObjectId(userId),
            puzzleId: new mongodb_1.ObjectId(puzzleId)
        });
        if (findRes)
            return {
                success: true,
                data: {
                    score: findRes,
                    created: false
                }
            };
        const getPuzzleRes = await (0, puzzles_1.getPuzzleById)(puzzleId);
        if (!getPuzzleRes.success) {
            return getPuzzleRes;
        }
        const newScore = {
            puzzleId: new mongodb_1.ObjectId(puzzleId),
            userId: new mongodb_1.ObjectId(userId),
            wordsFound: [],
            wordPreviewsOn: false,
            points: 0
        };
        const createRes = await db.collection('Scores').insertOne(newScore);
        return {
            success: true,
            data: {
                score: {
                    ...newScore,
                    _id: createRes.insertedId
                },
                created: true
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
exports.getOrCreateScore = getOrCreateScore;
/**
* Update a user's hint or wordPreviewsOn on a given puzzle. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {UpdateScoreData} params.data - Data to update. Can be either or both of the following properties: hint, wordPreviewsOn
* @return {Promise<UpdateScoreUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
async function updateScore({ scoreId, data }) {
    try {
        if (scoreId.length != 24) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        const db = await (0, conn_1.default)();
        const res = await db.collection('Scores').updateOne({
            _id: new mongodb_1.ObjectId(scoreId),
        }, {
            $set: data
        });
        if (res.matchedCount == 0) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        return {
            success: true
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
/**
* Add a word to a user's score on a puzzle
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {UserWordFound} params.word - Word to add in { word: string, points: number } form
* @return {Promise<UpdateScoreUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
async function addWord({ scoreId, word }) {
    try {
        if (scoreId.length != 24) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        const db = await (0, conn_1.default)();
        const res = await db.collection('Scores').findOneAndUpdate({
            _id: new mongodb_1.ObjectId(scoreId),
        }, {
            // Push the word to the start of the wordsFound array
            $push: {
                wordsFound: {
                    $each: [{
                            word: word.word,
                            points: word.points
                        }],
                    $position: 0
                }
            },
            // Increment points by the points of the word
            $inc: {
                points: word.points
            }
        }, {
            // Return the updated document
            returnDocument: 'after'
        });
        if (!res) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        return {
            success: true,
            data: {
                score: res
            }
        };
    }
    catch (e) {
        // console.log(e)
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.addWord = addWord;
/**
* Mark wordPreviewsOn as true for a given score. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @return {Promise<ActivateWordPreviewsUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
async function activateWordPreviews({ scoreId }) {
    const res = await updateScore({
        scoreId,
        data: {
            wordPreviewsOn: true
        }
    });
    return res;
}
exports.activateWordPreviews = activateWordPreviews;
/**
* Update a user's hint on a given puzzle. If no hint is provided, the hint is removed from the database. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {Hint | undefined} params.hint - Hint object to set; if not provided, the hint is removed from the database
* @return {Promise<SetHintUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
async function setHint({ scoreId, hint }) {
    try {
        if (scoreId.length != 24) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        const db = await (0, conn_1.default)();
        const res = await db.collection('Scores').updateOne({
            _id: new mongodb_1.ObjectId(scoreId),
        }, hint
            ? { $set: { hint } }
            // Remove the hint if a hint isn't provided
            : { $unset: { hint: 1 } });
        if (res.matchedCount == 0) {
            return {
                success: false,
                message: 'no-score'
            };
        }
        return {
            success: true
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.setHint = setHint;
//# sourceMappingURL=scores.js.map