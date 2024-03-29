"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = require("@slack/logger");
const querystring_1 = __importDefault(require("querystring"));
const crypto_1 = __importDefault(require("crypto"));
const tsscmp_1 = __importDefault(require("tsscmp"));
const errors_1 = require("../errors");
/*
 * Receiver implementation for AWS API Gateway + Lambda apps
 *
 * Note that this receiver does not support Slack OAuth flow.
 * For OAuth flow endpoints, deploy another Lambda function built with ExpressReceiver.
 */
class AwsLambdaReceiver {
    constructor({ signingSecret, logger = undefined, logLevel = logger_1.LogLevel.INFO, customPropertiesExtractor = (_) => ({}), }) {
        // Initialize instance variables, substituting defaults for each value
        this.signingSecret = signingSecret;
        this.logger = logger !== null && logger !== void 0 ? logger : (() => {
            const defaultLogger = new logger_1.ConsoleLogger();
            defaultLogger.setLevel(logLevel);
            return defaultLogger;
        })();
        this.customPropertiesExtractor = customPropertiesExtractor;
    }
    init(app) {
        this.app = app;
    }
    start(..._args) {
        return new Promise((resolve, reject) => {
            try {
                const handler = this.toHandler();
                resolve(handler);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    // eslint-disable-next-line class-methods-use-this
    stop(..._args) {
        return new Promise((resolve, _reject) => {
            resolve();
        });
    }
    toHandler() {
        return async (awsEvent, _awsContext, _awsCallback) => {
            var _a;
            this.logger.debug(`AWS event: ${JSON.stringify(awsEvent, null, 2)}`);
            const rawBody = this.getRawBody(awsEvent);
            const body = this.parseRequestBody(rawBody, this.getHeaderValue(awsEvent.headers, 'Content-Type'), this.logger);
            // ssl_check (for Slash Commands)
            if (typeof body !== 'undefined' &&
                body != null &&
                typeof body.ssl_check !== 'undefined' &&
                body.ssl_check != null) {
                return Promise.resolve({ statusCode: 200, body: '' });
            }
            // request signature verification
            const signature = this.getHeaderValue(awsEvent.headers, 'X-Slack-Signature');
            const ts = Number(this.getHeaderValue(awsEvent.headers, 'X-Slack-Request-Timestamp'));
            if (!this.isValidRequestSignature(this.signingSecret, rawBody, signature, ts)) {
                return Promise.resolve({ statusCode: 401, body: '' });
            }
            // url_verification (Events API)
            if (typeof body !== 'undefined' &&
                body != null &&
                typeof body.type !== 'undefined' &&
                body.type != null &&
                body.type === 'url_verification') {
                return Promise.resolve({
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ challenge: body.challenge }),
                });
            }
            // Setup ack timeout warning
            let isAcknowledged = false;
            const noAckTimeoutId = setTimeout(() => {
                if (!isAcknowledged) {
                    this.logger.error('An incoming event was not acknowledged within 3 seconds. ' +
                        'Ensure that the ack() argument is called in a listener.');
                }
            }, 3001);
            // Structure the ReceiverEvent
            let storedResponse;
            const event = {
                body,
                ack: async (response) => {
                    if (isAcknowledged) {
                        throw new errors_1.ReceiverMultipleAckError();
                    }
                    isAcknowledged = true;
                    clearTimeout(noAckTimeoutId);
                    if (typeof response === 'undefined' || response == null) {
                        storedResponse = '';
                    }
                    else {
                        storedResponse = response;
                    }
                },
                retryNum: this.getHeaderValue(awsEvent.headers, 'X-Slack-Retry-Num'),
                retryReason: this.getHeaderValue(awsEvent.headers, 'X-Slack-Retry-Reason'),
                customProperties: this.customPropertiesExtractor(awsEvent),
            };
            // Send the event to the app for processing
            try {
                await ((_a = this.app) === null || _a === void 0 ? void 0 : _a.processEvent(event));
                if (storedResponse !== undefined) {
                    if (typeof storedResponse === 'string') {
                        return { statusCode: 200, body: storedResponse };
                    }
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(storedResponse),
                    };
                }
            }
            catch (err) {
                this.logger.error('An unhandled error occurred while Bolt processed an event');
                this.logger.debug(`Error details: ${err}, storedResponse: ${storedResponse}`);
                return { statusCode: 500, body: 'Internal server error' };
            }
            return { statusCode: 404, body: '' };
        };
    }
    // eslint-disable-next-line class-methods-use-this
    getRawBody(awsEvent) {
        if (typeof awsEvent.body === 'undefined' || awsEvent.body == null) {
            return '';
        }
        if (awsEvent.isBase64Encoded) {
            return Buffer.from(awsEvent.body, 'base64').toString('ascii');
        }
        return awsEvent.body;
    }
    // eslint-disable-next-line class-methods-use-this
    parseRequestBody(stringBody, contentType, logger) {
        if (contentType === 'application/x-www-form-urlencoded') {
            const parsedBody = querystring_1.default.parse(stringBody);
            if (typeof parsedBody.payload === 'string') {
                return JSON.parse(parsedBody.payload);
            }
            return parsedBody;
        }
        if (contentType === 'application/json') {
            return JSON.parse(stringBody);
        }
        logger.warn(`Unexpected content-type detected: ${contentType}`);
        try {
            // Parse this body anyway
            return JSON.parse(stringBody);
        }
        catch (e) {
            logger.error(`Failed to parse body as JSON data for content-type: ${contentType}`);
            throw e;
        }
    }
    // eslint-disable-next-line class-methods-use-this
    isValidRequestSignature(signingSecret, body, signature, requestTimestamp) {
        if (!signature || !requestTimestamp) {
            return false;
        }
        // Divide current date to match Slack ts format
        // Subtract 5 minutes from current time
        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
        if (requestTimestamp < fiveMinutesAgo) {
            return false;
        }
        const hmac = crypto_1.default.createHmac('sha256', signingSecret);
        const [version, hash] = signature.split('=');
        hmac.update(`${version}:${requestTimestamp}:${body}`);
        if (!(0, tsscmp_1.default)(hash, hmac.digest('hex'))) {
            return false;
        }
        return true;
    }
    // eslint-disable-next-line class-methods-use-this
    getHeaderValue(headers, key) {
        const caseInsensitiveKey = Object.keys(headers).find((it) => key.toLowerCase() === it.toLowerCase());
        return caseInsensitiveKey !== undefined ? headers[caseInsensitiveKey] : undefined;
    }
}
exports.default = AwsLambdaReceiver;
//# sourceMappingURL=AwsLambdaReceiver.js.map