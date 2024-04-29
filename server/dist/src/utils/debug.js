"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mode = process.env.NODE_ENV;
// Log to the console if in development mode
function debug(message, logMode = 'log') {
    if (!mode || mode != 'development')
        return;
    if (logMode == 'log')
        console.log(message);
    else if (logMode == 'warn')
        console.warn(message);
    else if (logMode == 'error')
        console.error(message);
}
exports.default = debug;
//# sourceMappingURL=debug.js.map