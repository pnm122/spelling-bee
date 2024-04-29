"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = exports.errorHandler = exports.notFound = void 0;
const sessions_1 = require("./db/utils/sessions");
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
    });
}
exports.errorHandler = errorHandler;
/**
* Check if the user is authenticated. Updates the user's session from the request cookie if it exists,
* otherwise responds to the client with a 401 not authenticated
*/
async function authenticated(req, res, next) {
    const sessionId = req.cookies['session'];
    if (!sessionId) {
        return res.status(401).json({
            success: false,
            message: 'no-session'
        });
    }
    const updateRes = await (0, sessions_1.updateSession)(sessionId);
    if (!updateRes.success) {
        if (updateRes.message == 'invalid-session') {
            return res.status(401).json(updateRes);
        }
        return res.status(500).json(updateRes);
    }
    // Refresh the expiration time for the session cookie
    // * 1000 because maxAge is in ms, but SESSION_EXPIRE_TIME is in seconds
    res.cookie('session', sessionId, { maxAge: parseInt(process.env.SESSION_EXPIRE_TIME) * 1000 });
    // Store session information for later use
    req.body.session = updateRes.data.session;
    next();
}
exports.authenticated = authenticated;
//# sourceMappingURL=middlewares.js.map