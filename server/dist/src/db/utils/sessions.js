"use strict";
// Utility functions for the Sessions collection
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.deleteSession = exports.updateSession = exports.createSession = void 0;
const conn_1 = __importDefault(require("../conn"));
const uuid_1 = require("uuid");
const debug_1 = __importDefault(require("../../utils/debug"));
/**
* Create a session in the Sessions collection
* @param {string} userId - ID of the user to associate with the session
* @return {Promise<SuccessResponse<{ sessionId: string }> | ErrorResponse<CreateSessionErrors>>} session ID if successful, ErrorResponse if not
*/
async function createSession(userId) {
    try {
        const db = await (0, conn_1.default)();
        const sessionDetails = {
            sessionId: (0, uuid_1.v4)(),
            userId,
            lastUpdate: new Date(Date.now())
        };
        const res = await db.collection('Sessions').insertOne(sessionDetails);
        return {
            success: true,
            data: { sessionId: sessionDetails.sessionId }
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'failed-to-create-session'
        };
    }
}
exports.createSession = createSession;
/**
* Updates a given session with the current time, causing it to expire later. Fails if the session doesn't exist or if the session has expired
* @param {string} sessionId - ID of the session to update
* @return {Promise<SuccessResponse<UpdateSessionData> | ErrorResponse<UpdateSessionErrors>>} Details whether the function was successful or not
*/
async function updateSession(sessionId) {
    try {
        const db = await (0, conn_1.default)();
        const updateTime = new Date(Date.now());
        const res = await db.collection('Sessions')
            .findOneAndUpdate({
            sessionId: sessionId
        }, {
            // @ts-ignore I know what I'm doing, the types for inserting sessions are different than the sessions received from the DB
            $set: {
                lastUpdate: updateTime
            }
        });
        if (!res) {
            return {
                success: false,
                message: 'invalid-session'
            };
        }
        // BELOW DOESNT WORK because the session has already been updated if it exists
        // For now, I'm just going to rely on MongoDB automatically deleting my sessions at roughly the right time
        // Getting the exact expiration time isn't really a big deal for this app anyways
        // session has expired if the session doesn't exist anymore or if it does exist but its expiration date has passed (just hasn't been deleted by MongoDB yet)
        // const expirationDate = new Date(res.lastUpdate).getTime() + (parseInt(process.env.SESSION_EXPIRE_TIME!) * 1000)
        // const sessionExpired = Date.now() > expirationDate
        // if(sessionExpired) debug(`EXPIRED SESSION\nSession expiration date: ${new Date(expirationDate).toString()}\n`)
        return {
            success: true,
            data: { session: res }
        };
    }
    catch (e) {
        (0, debug_1.default)(e);
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.updateSession = updateSession;
/**
* Delete a given session if it exists. Fails if the session doesn't exist
* @param {string} sessionId - ID of the session to delete
* @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
*/
async function deleteSession(sessionId) {
    try {
        const db = await (0, conn_1.default)();
        const res = await db.collection('Sessions').deleteOne({
            sessionId: sessionId
        });
        if (res.acknowledged && res.deletedCount) {
            (0, debug_1.default)(`Session ${sessionId} successfully removed from database.`);
            return {
                success: true
            };
        }
        return {
            success: false,
            message: 'invalid-session'
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.deleteSession = deleteSession;
/**
* Get a given session if it exists. Fails if the session doesn't exist
* @param {string} sessionId - ID of the session to get
* @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not; SuccessResponse data contains session information
*/
async function getSession(sessionId) {
    try {
        const db = await (0, conn_1.default)();
        const res = await db.collection('Sessions').findOne({
            sessionId: sessionId
        });
        if (res) {
            return {
                success: true,
                data: { session: res }
            };
        }
        return {
            success: false,
            message: 'invalid-session'
        };
    }
    catch (e) {
        return {
            success: false,
            message: 'unknown-error'
        };
    }
}
exports.getSession = getSession;
//# sourceMappingURL=sessions.js.map