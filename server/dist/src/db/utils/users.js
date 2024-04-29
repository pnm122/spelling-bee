"use strict";
// Utility functions for the Users collection
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementPuzzlesPlayed = exports.addWordToUser = exports.validateUserCredentials = exports.getUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const conn_1 = __importDefault(require("../conn"));
const mongodb_1 = require("mongodb");
const points_1 = require("../../shared/utils/points");
const puzzles_1 = require("./puzzles");
/**
* Create a user in the Users collection, hashing and salting the given password
* @param {Object} params
* @param {string} params.username - User's username
* @param {string} params.password - Raw password string
* @return {Promise<SuccessResponse<{insertedId: string}> | ErrorResponse<CreateUserErrors>>} Details whether the function was successful or not. Fails if username already exists
*/
async function createUser({ username, password }) {
    // Create encrypted password for database
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    try {
        const db = await (0, conn_1.default)();
        const u = await db.collection('Users').findOne({
            username: username
        });
        if (u != null) {
            return {
                success: false,
                message: 'user-exists'
            };
        }
        const newUserWithoutId = {
            username: username,
            password: hashedPassword,
            stats: {
                points: 0,
                words_found: 0,
                pangrams: 0,
                puzzles_played: 0,
                puzzles_solved: 0,
                longest_word: ''
            }
        };
        const insertedUser = await db.collection('Users')
            .insertOne(newUserWithoutId);
        // MongoDB automatically adds _id field apparently
        let newUserWithId = newUserWithoutId;
        const { password, _id, ...userResponse } = newUserWithId;
        return {
            success: true,
            message: "User successfully added to database",
            data: {
                user: {
                    ...userResponse,
                    id: insertedUser.insertedId.toString()
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
exports.createUser = createUser;
/**
* Get a user from the Users collection, given their ID. Returns all fields except their password
* @param {string} userId
* @return {Promise<SuccessResponse<GetUserUtilityData> | ErrorResponse<GetUserUtilityErrors>>} Details whether the function was successful or not. Fails if userId isn't found
*/
async function getUser(userId) {
    try {
        const db = await (0, conn_1.default)();
        const u = await db.collection('Users').findOne({
            _id: new mongodb_1.ObjectId(userId)
        });
        if (u == null) {
            return {
                success: false,
                message: 'invalid-user-id'
            };
        }
        // Omit password from return
        const { password, _id, ...user } = u;
        return {
            success: true,
            data: {
                user: {
                    ...user,
                    id: _id.toString()
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
exports.getUser = getUser;
/**
* Check if the given username + password combo exists in the Users collection
* @param {Object} params
* @param {string} params.username - User's username
* @param {string} params.password - Raw password string
* @return {Promise<SuccessResponse<ValidateUtilityData> | ErrorResponse<ValidateUserCredentialsErrors>>} Details whether the function was successful or not; SuccessResponse data contains user ID
*/
async function validateUserCredentials({ username, password }) {
    try {
        const db = await (0, conn_1.default)();
        const user = await db.collection('Users').findOne({
            username: username
        });
        if (!user) {
            return {
                success: false,
                message: 'user-info-incorrect'
            };
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (match) {
            const { _id, password, ...userRes } = user;
            return {
                success: true,
                data: {
                    user: {
                        ...userRes,
                        id: _id.toString()
                    }
                }
            };
        }
        else {
            return {
                success: false,
                message: 'user-info-incorrect'
            };
        }
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.validateUserCredentials = validateUserCredentials;
/**
* Update a user's stats based on a word they find
* @param {Object} params
* @param {string} params.userId - User's 24-character identifier
* @param {string} params.word - Word to add stats for
* @return {Promise<AddWordToUserResponse>} Details whether the function was successful or not
*/
async function addWordToUser({ userId, word, score }) {
    if (userId.length != 24) {
        return {
            success: false,
            message: 'invalid-user-id'
        };
    }
    try {
        const db = await (0, conn_1.default)();
        const longestWord = await db.collection('Users').findOne({
            _id: new mongodb_1.ObjectId(userId)
        }, {
            projection: {
                stats: {
                    longest_word: 1
                }
            }
        });
        if (!longestWord) {
            return {
                success: false,
                message: 'invalid-user-id'
            };
        }
        const puzzle = await (0, puzzles_1.getPuzzleById)(score.puzzleId.toString(), { wordList: 1 });
        if (!puzzle.success) {
            return puzzle;
        }
        const { wordList } = puzzle.data.puzzle;
        const { wordsFound } = score;
        // console.log(wordList, wordsFound, wordList.length, wordsFound.length)
        let newLongestWord = longestWord.stats.longest_word;
        if (word.word.length > newLongestWord.length)
            newLongestWord = word.word;
        const res = await db.collection('Users').updateOne({
            _id: new mongodb_1.ObjectId(userId)
        }, {
            $inc: {
                "stats.words_found": 1,
                "stats.points": word.points,
                "stats.pangrams": (0, points_1.isPangram)(word.word) ? 1 : 0,
                "stats.puzzles_solved": wordList.length == wordsFound.length ? 1 : 0
            },
            $set: {
                "stats.longest_word": newLongestWord
            }
        });
        return { success: true };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.addWordToUser = addWordToUser;
/**
* Increment a user's puzzles played stat
* @param {Object} params
* @param {string} params.userId - User's 24-character identifier
* @return {Promise<IncrementPuzzlesPlayedResponse>} Details whether the function was successful or not
*/
async function incrementPuzzlesPlayed({ userId }) {
    if (userId.length != 24) {
        return {
            success: false,
            message: 'invalid-user-id'
        };
    }
    try {
        const db = await (0, conn_1.default)();
        const res = await db.collection('Users').updateOne({
            _id: new mongodb_1.ObjectId(userId)
        }, {
            $inc: {
                "stats.puzzles_played": 1
            }
        });
        if (res.matchedCount == 0) {
            return {
                success: false,
                message: 'invalid-user-id'
            };
        }
        return { success: true };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.incrementPuzzlesPlayed = incrementPuzzlesPlayed;
//# sourceMappingURL=users.js.map