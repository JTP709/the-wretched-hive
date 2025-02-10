"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const handleErrors = (res, err) => {
    console.error(err);
    res.status(500).json({ message: (err === null || err === void 0 ? void 0 : err.message) || 'Internal server error' });
};
exports.handleErrors = handleErrors;
