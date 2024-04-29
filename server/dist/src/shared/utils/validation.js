"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = exports.isValidUsername = exports.ALLOWED_SPECIAL_CHARACTERS = exports.MAX_PASSWORD_LENGTH = exports.MIN_PASSWORD_LENGTH = exports.MAX_USERNAME_LENGTH = exports.MIN_USERNAME_LENGTH = void 0;
exports.MIN_USERNAME_LENGTH = 4;
exports.MAX_USERNAME_LENGTH = 16;
exports.MIN_PASSWORD_LENGTH = 8;
exports.MAX_PASSWORD_LENGTH = 24;
exports.ALLOWED_SPECIAL_CHARACTERS = '!@#$%^&*+';
function isValidUsername(u) {
    const regex = new RegExp(`^[a-zA-Z0-9]{${exports.MIN_USERNAME_LENGTH},${exports.MAX_USERNAME_LENGTH}}$`);
    return u.match(regex) != null;
}
exports.isValidUsername = isValidUsername;
function isValidPassword(p) {
    const regex = new RegExp(`^[a-zA-Z0-9${exports.ALLOWED_SPECIAL_CHARACTERS}]{${exports.MIN_PASSWORD_LENGTH},${exports.MAX_PASSWORD_LENGTH}}$`);
    return p.match(regex) != null;
}
exports.isValidPassword = isValidPassword;
//# sourceMappingURL=validation.js.map