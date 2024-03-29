"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPModuleFunctions = void 0;
/* eslint-disable import/prefer-default-export */
const querystring_1 = require("querystring");
const raw_body_1 = __importDefault(require("raw-body"));
const errors_1 = require("../errors");
const verify_request_1 = require("./verify-request");
const verifyErrorPrefix = 'Failed to verify authenticity';
class HTTPModuleFunctions {
    // ------------------------------------------
    // Request header extraction
    // ------------------------------------------
    static extractRetryNumFromHTTPRequest(req) {
        let retryNum;
        const retryNumHeaderValue = req.headers['x-slack-retry-num'];
        if (retryNumHeaderValue === undefined) {
            retryNum = undefined;
        }
        else if (typeof retryNumHeaderValue === 'string') {
            retryNum = parseInt(retryNumHeaderValue, 10);
        }
        else if (Array.isArray(retryNumHeaderValue) && retryNumHeaderValue.length > 0) {
            retryNum = parseInt(retryNumHeaderValue[0], 10);
        }
        return retryNum;
    }
    static extractRetryReasonFromHTTPRequest(req) {
        let retryReason;
        const retryReasonHeaderValue = req.headers['x-slack-retry-reason'];
        if (retryReasonHeaderValue === undefined) {
            retryReason = undefined;
        }
        else if (typeof retryReasonHeaderValue === 'string') {
            retryReason = retryReasonHeaderValue;
        }
        else if (Array.isArray(retryReasonHeaderValue) && retryReasonHeaderValue.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            retryReason = retryReasonHeaderValue[0];
        }
        return retryReason;
    }
    // ------------------------------------------
    // HTTP request parsing and verification
    // ------------------------------------------
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static parseHTTPRequestBody(req) {
        const bodyAsString = req.rawBody.toString();
        const contentType = req.headers['content-type'];
        if (contentType === 'application/x-www-form-urlencoded') {
            const parsedQs = (0, querystring_1.parse)(bodyAsString);
            const { payload } = parsedQs;
            if (typeof payload === 'string') {
                return JSON.parse(payload);
            }
            return parsedQs;
        }
        return JSON.parse(bodyAsString);
    }
    static async parseAndVerifyHTTPRequest(options, req, _res) {
        const { signingSecret } = options;
        // Consume the readable stream (or use the previously consumed readable stream)
        const bufferedReq = await HTTPModuleFunctions.bufferIncomingMessage(req);
        if (options.enabled !== undefined && !options.enabled) {
            // As the validation is disabled, immediately return the bufferred reuest
            return bufferedReq;
        }
        const textBody = bufferedReq.rawBody.toString();
        const contentType = req.headers['content-type'];
        if (contentType === 'application/x-www-form-urlencoded') {
            // `ssl_check=1` requests do not require x-slack-signature verification
            const parsedQs = (0, querystring_1.parse)(textBody);
            if (parsedQs && parsedQs.ssl_check) {
                return bufferedReq;
            }
        }
        // Find the relevant request headers
        const signature = HTTPModuleFunctions.getHeader(req, 'x-slack-signature');
        const requestTimestampSec = Number(HTTPModuleFunctions.getHeader(req, 'x-slack-request-timestamp'));
        (0, verify_request_1.verifySlackRequest)({
            signingSecret,
            body: textBody,
            headers: {
                'x-slack-signature': signature,
                'x-slack-request-timestamp': requestTimestampSec,
            },
            logger: options.logger,
        });
        // Checks have passed! Return the value that has a side effect (the buffered request)
        return bufferedReq;
    }
    static isBufferedIncomingMessage(req) {
        return Buffer.isBuffer(req.rawBody);
    }
    static getHeader(req, header) {
        const value = req.headers[header];
        if (value === undefined || Array.isArray(value)) {
            throw new Error(`${verifyErrorPrefix}: header ${header} did not have the expected type (received ${typeof value}, expected string)`);
        }
        return value;
    }
    static async bufferIncomingMessage(req) {
        if (HTTPModuleFunctions.isBufferedIncomingMessage(req)) {
            return req;
        }
        const bufferedRequest = req;
        bufferedRequest.rawBody = await (0, raw_body_1.default)(req);
        return bufferedRequest;
    }
    // ------------------------------------------
    // HTTP response builder methods
    // ------------------------------------------
    static buildNoBodyResponse(res, status) {
        res.writeHead(status);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static buildUrlVerificationResponse(res, body) {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ challenge: body.challenge }));
    }
    static buildSSLCheckResponse(res) {
        res.writeHead(200);
        res.end();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static buildContentResponse(res, body) {
        if (!body) {
            res.writeHead(200);
            res.end();
        }
        else if (typeof body === 'string') {
            res.writeHead(200);
            res.end(body);
        }
        else {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(body));
        }
    }
    // ------------------------------------------
    // Error handlers for event processing
    // ------------------------------------------
    // The default dispathErrorHandler implementation:
    // Developers can customize this behavior by passing dispatchErrorHandler to the constructor
    // Note that it was not possible to make this function async due to the limitation of http module
    static defaultDispatchErrorHandler(args) {
        const { error, logger, request, response } = args;
        if ('code' in error) {
            if (error.code === errors_1.ErrorCode.HTTPReceiverDeferredRequestError) {
                logger.info(`Unhandled HTTP request (${request.method}) made to ${request.url}`);
                response.writeHead(404);
                response.end();
                return;
            }
        }
        logger.error(`An unexpected error occurred during a request (${request.method}) made to ${request.url}`);
        logger.debug(`Error details: ${error}`);
        response.writeHead(500);
        response.end();
    }
    static async defaultAsyncDispatchErrorHandler(args) {
        return HTTPModuleFunctions.defaultDispatchErrorHandler(args);
    }
    // The default processEventErrorHandler implementation:
    // Developers can customize this behavior by passing processEventErrorHandler to the constructor
    static async defaultProcessEventErrorHandler(args) {
        const { error, response, logger, storedResponse } = args;
        if ('code' in error) {
            // CodedError has code: string
            const errorCode = error.code;
            if (errorCode === errors_1.ErrorCode.AuthorizationError) {
                // authorize function threw an exception, which means there is no valid installation data
                response.writeHead(401);
                response.end();
                return true;
            }
        }
        logger.error('An unhandled error occurred while Bolt processed an event');
        logger.debug(`Error details: ${error}, storedResponse: ${storedResponse}`);
        response.writeHead(500);
        response.end();
        return false;
    }
    // The default unhandledRequestHandler implementation:
    // Developers can customize this behavior by passing unhandledRequestHandler to the constructor
    // Note that this method cannot be an async function to align with the implementation using setTimeout
    static defaultUnhandledRequestHandler(args) {
        const { logger } = args;
        logger.error('An incoming event was not acknowledged within 3 seconds. ' +
            'Ensure that the ack() argument is called in a listener.');
    }
}
exports.HTTPModuleFunctions = HTTPModuleFunctions;
//# sourceMappingURL=HTTPModuleFunctions.js.map