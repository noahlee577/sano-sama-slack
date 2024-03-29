"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.isValidSlackRequest = exports.verifySlackRequest = void 0;
// Deprecated: this function will be removed in the near future. Use HTTPModuleFunctions instead.
const logger_1 = require("@slack/logger");
const crypto_1 = require("crypto");
const tsscmp_1 = __importDefault(require("tsscmp"));
const HTTPModuleFunctions_1 = require("./HTTPModuleFunctions");
// ------------------------------
// HTTP module independent methods
// ------------------------------
const verifyErrorPrefix = 'Failed to verify authenticity';
/**
 * Verifies the signature of an incoming request from Slack.
 * If the requst is invalid, this method throws an exception with the erorr details.
 */
function verifySlackRequest(options) {
    var _a;
    const requestTimestampSec = options.headers['x-slack-request-timestamp'];
    const signature = options.headers['x-slack-signature'];
    if (Number.isNaN(requestTimestampSec)) {
        throw new Error(`${verifyErrorPrefix}: header x-slack-request-timestamp did not have the expected type (${requestTimestampSec})`);
    }
    // Calculate time-dependent values
    const nowMs = (_a = options.nowMilliseconds) !== null && _a !== void 0 ? _a : Date.now();
    const fiveMinutesAgoSec = Math.floor(nowMs / 1000) - 60 * 5;
    // Enforce verification rules
    // Rule 1: Check staleness
    if (requestTimestampSec < fiveMinutesAgoSec) {
        throw new Error(`${verifyErrorPrefix}: stale`);
    }
    // Rule 2: Check signature
    // Separate parts of signature
    const [signatureVersion, signatureHash] = signature.split('=');
    // Only handle known versions
    if (signatureVersion !== 'v0') {
        throw new Error(`${verifyErrorPrefix}: unknown signature version`);
    }
    // Compute our own signature hash
    const hmac = (0, crypto_1.createHmac)('sha256', options.signingSecret);
    hmac.update(`${signatureVersion}:${requestTimestampSec}:${options.body}`);
    const ourSignatureHash = hmac.digest('hex');
    if (!signatureHash || !(0, tsscmp_1.default)(signatureHash, ourSignatureHash)) {
        throw new Error(`${verifyErrorPrefix}: signature mismatch`);
    }
}
exports.verifySlackRequest = verifySlackRequest;
/**
 * Verifies the signature of an incoming request from Slack.
 * If the requst is invalid, this method returns false.
 */
function isValidSlackRequest(options) {
    try {
        verifySlackRequest(options);
        return true;
    }
    catch (e) {
        if (options.logger) {
            options.logger.debug(`Signature verification error: ${e}`);
        }
    }
    return false;
}
exports.isValidSlackRequest = isValidSlackRequest;
// ------------------------------
// legacy methods (depreacted)
// ------------------------------
const consoleLogger = new logger_1.ConsoleLogger();
// Deprecated: this function will be removed in the near future. Use HTTPModuleFunctions instead.
async function verify(options, req, res) {
    consoleLogger.warn('This method is deprecated. Use HTTPModuleFunctions.parseAndVerifyHTTPRequest(options, req, res) instead.');
    return HTTPModuleFunctions_1.HTTPModuleFunctions.parseAndVerifyHTTPRequest(options, req, res);
}
exports.verify = verify;
//# sourceMappingURL=verify-request.js.map