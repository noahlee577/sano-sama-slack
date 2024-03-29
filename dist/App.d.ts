/// <reference types="node" />
/// <reference types="node" />
import { Agent } from 'http';
import { SecureContextOptions } from 'tls';
import { WebClient, WebClientOptions } from '@slack/web-api';
import { Logger, LogLevel } from '@slack/logger';
import SocketModeReceiver from './receivers/SocketModeReceiver';
import HTTPReceiver, { HTTPReceiverOptions } from './receivers/HTTPReceiver';
import { ConversationStore } from './conversation-store';
import { WorkflowStep } from './WorkflowStep';
import { Middleware, AnyMiddlewareArgs, SlackActionMiddlewareArgs, SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs, SlackOptionsMiddlewareArgs, SlackShortcutMiddlewareArgs, SlackViewMiddlewareArgs, SlackAction, SlackShortcut, Context, OptionsSource, BlockAction, SlackViewAction, Receiver, ReceiverEvent } from './types';
import { CodedError } from './errors';
/** App initialization options */
export interface AppOptions {
    signingSecret?: HTTPReceiverOptions['signingSecret'];
    endpoints?: HTTPReceiverOptions['endpoints'];
    port?: HTTPReceiverOptions['port'];
    customRoutes?: HTTPReceiverOptions['customRoutes'];
    processBeforeResponse?: HTTPReceiverOptions['processBeforeResponse'];
    signatureVerification?: HTTPReceiverOptions['signatureVerification'];
    clientId?: HTTPReceiverOptions['clientId'];
    clientSecret?: HTTPReceiverOptions['clientSecret'];
    stateSecret?: HTTPReceiverOptions['stateSecret'];
    redirectUri?: HTTPReceiverOptions['redirectUri'];
    installationStore?: HTTPReceiverOptions['installationStore'];
    scopes?: HTTPReceiverOptions['scopes'];
    installerOptions?: HTTPReceiverOptions['installerOptions'];
    agent?: Agent;
    clientTls?: Pick<SecureContextOptions, 'pfx' | 'key' | 'passphrase' | 'cert' | 'ca'>;
    convoStore?: ConversationStore | false;
    token?: AuthorizeResult['botToken'];
    appToken?: string;
    botId?: AuthorizeResult['botId'];
    botUserId?: AuthorizeResult['botUserId'];
    authorize?: Authorize<boolean>;
    receiver?: Receiver;
    logger?: Logger;
    logLevel?: LogLevel;
    ignoreSelf?: boolean;
    clientOptions?: Pick<WebClientOptions, 'slackApiUrl'>;
    socketMode?: boolean;
    developerMode?: boolean;
    tokenVerificationEnabled?: boolean;
    deferInitialization?: boolean;
    extendedErrorHandler?: boolean;
}
export { LogLevel, Logger } from '@slack/logger';
/** Authorization function - seeds the middleware processing and listeners with an authorization context */
export interface Authorize<IsEnterpriseInstall extends boolean = false> {
    (source: AuthorizeSourceData<IsEnterpriseInstall>, body?: AnyMiddlewareArgs['body']): Promise<AuthorizeResult>;
}
/** Authorization function inputs - authenticated data about an event for the authorization function */
export interface AuthorizeSourceData<IsEnterpriseInstall extends boolean = false> {
    teamId: IsEnterpriseInstall extends true ? string | undefined : string;
    enterpriseId: IsEnterpriseInstall extends true ? string : string | undefined;
    userId?: string;
    conversationId?: string;
    isEnterpriseInstall: IsEnterpriseInstall;
}
/** Authorization function outputs - data that will be available as part of event processing */
export interface AuthorizeResult {
    botToken?: string;
    userToken?: string;
    botId?: string;
    botUserId?: string;
    teamId?: string;
    enterpriseId?: string;
    [key: string]: any;
}
export interface ActionConstraints<A extends SlackAction = SlackAction> {
    type?: A['type'];
    block_id?: A extends BlockAction ? string | RegExp : never;
    action_id?: A extends BlockAction ? string | RegExp : never;
    callback_id?: Extract<A, {
        callback_id?: string;
    }> extends any ? string | RegExp : never;
}
export interface ShortcutConstraints<S extends SlackShortcut = SlackShortcut> {
    type?: S['type'];
    callback_id?: string | RegExp;
}
export interface ViewConstraints {
    callback_id?: string | RegExp;
    type?: 'view_closed' | 'view_submission';
}
interface AllErrorHandlerArgs {
    error: Error;
    logger: Logger;
    body: AnyMiddlewareArgs['body'];
    context: Context;
}
export interface ExtendedErrorHandlerArgs extends AllErrorHandlerArgs {
    error: CodedError;
}
export interface ErrorHandler {
    (error: CodedError): Promise<void>;
}
export interface ExtendedErrorHandler {
    (args: ExtendedErrorHandlerArgs): Promise<void>;
}
export interface AnyErrorHandler extends ErrorHandler, ExtendedErrorHandler {
}
declare type MessageEventMiddleware = Middleware<SlackEventMiddlewareArgs<'message'>>;
/**
 * A Slack App
 */
export default class App {
    /** Slack Web API client */
    client: WebClient;
    private clientOptions;
    private clients;
    /** Receiver - ingests events from the Slack platform */
    private receiver;
    /** Logger */
    private logger;
    /** Log Level */
    private logLevel;
    /** Authorize */
    private authorize;
    /** Global middleware chain */
    private middleware;
    /** Listener middleware chains */
    private listeners;
    private errorHandler;
    private axios;
    private installerOptions;
    private socketMode;
    private developerMode;
    private extendedErrorHandler;
    private hasCustomErrorHandler;
    private argToken?;
    private argAuthorize?;
    private argAuthorization?;
    private tokenVerificationEnabled;
    private initialized;
    constructor({ signingSecret, endpoints, port, customRoutes, agent, clientTls, receiver, convoStore, token, appToken, botId, botUserId, authorize, logger, logLevel, ignoreSelf, clientOptions, processBeforeResponse, signatureVerification, clientId, clientSecret, stateSecret, redirectUri, installationStore, scopes, installerOptions, socketMode, developerMode, tokenVerificationEnabled, extendedErrorHandler, deferInitialization, }?: AppOptions);
    init(): Promise<void>;
    /**
     * Register a new middleware, processed in the order registered.
     *
     * @param m global middleware function
     */
    use(m: Middleware<AnyMiddlewareArgs>): this;
    /**
     * Register WorkflowStep middleware
     *
     * @param workflowStep global workflow step middleware function
     */
    step(workflowStep: WorkflowStep): this;
    /**
     * Convenience method to call start on the receiver
     *
     * TODO: should replace HTTPReceiver in type definition with a generic that is constrained to Receiver
     *
     * @param args receiver-specific start arguments
     */
    start(...args: Parameters<HTTPReceiver['start'] | SocketModeReceiver['start']>): ReturnType<HTTPReceiver['start']>;
    stop(...args: any[]): Promise<unknown>;
    event<EventType extends string = string>(eventName: EventType, ...listeners: Middleware<SlackEventMiddlewareArgs<EventType>>[]): void;
    event<EventType extends RegExp = RegExp>(eventName: EventType, ...listeners: Middleware<SlackEventMiddlewareArgs<string>>[]): void;
    /**
     *
     * @param listeners Middlewares that process and react to a message event
     */
    message(...listeners: MessageEventMiddleware[]): void;
    /**
     *
     * @param pattern Used for filtering out messages that don't match.
     * Strings match via {@link String.prototype.includes}.
     * @param listeners Middlewares that process and react to the message events that matched the provided patterns.
     */
    message(pattern: string | RegExp, ...listeners: MessageEventMiddleware[]): void;
    /**
     *
     * @param filter Middleware that can filter out messages. Generally this is done by returning before
     * calling {@link AllMiddlewareArgs.next} if there is no match. See {@link directMention} for an example.
     * @param pattern Used for filtering out messages that don't match the pattern. Strings match
     * via {@link String.prototype.includes}.
     * @param listeners Middlewares that process and react to the message events that matched the provided pattern.
     */
    message(filter: MessageEventMiddleware, pattern: string | RegExp, ...listeners: MessageEventMiddleware[]): void;
    /**
     *
     * @param filter Middleware that can filter out messages. Generally this is done by returning before calling
     * {@link AllMiddlewareArgs.next} if there is no match. See {@link directMention} for an example.
     * @param listeners Middlewares that process and react to the message events that matched the provided patterns.
     */
    message(filter: MessageEventMiddleware, ...listeners: MessageEventMiddleware[]): void;
    /**
     * This allows for further control of the filtering and response logic. Patterns and middlewares are processed in
     * the order provided. If any patterns do not match, or a middleware does not call {@link AllMiddlewareArgs.next},
     * all remaining patterns and middlewares will be skipped.
     * @param patternsOrMiddleware A mix of patterns and/or middlewares.
     */
    message(...patternsOrMiddleware: (string | RegExp | MessageEventMiddleware)[]): void;
    shortcut<Shortcut extends SlackShortcut = SlackShortcut>(callbackId: string | RegExp, ...listeners: Middleware<SlackShortcutMiddlewareArgs<Shortcut>>[]): void;
    shortcut<Shortcut extends SlackShortcut = SlackShortcut, Constraints extends ShortcutConstraints<Shortcut> = ShortcutConstraints<Shortcut>>(constraints: Constraints, ...listeners: Middleware<SlackShortcutMiddlewareArgs<Extract<Shortcut, {
        type: Constraints['type'];
    }>>>[]): void;
    action<Action extends SlackAction = SlackAction>(actionId: string | RegExp, ...listeners: Middleware<SlackActionMiddlewareArgs<Action>>[]): void;
    action<Action extends SlackAction = SlackAction, Constraints extends ActionConstraints<Action> = ActionConstraints<Action>>(constraints: Constraints, ...listeners: Middleware<SlackActionMiddlewareArgs<Extract<Action, {
        type: Constraints['type'];
    }>>>[]): void;
    command(commandName: string | RegExp, ...listeners: Middleware<SlackCommandMiddlewareArgs>[]): void;
    options<Source extends OptionsSource = 'block_suggestion'>(actionId: string | RegExp, ...listeners: Middleware<SlackOptionsMiddlewareArgs<Source>>[]): void;
    options<Source extends OptionsSource = OptionsSource>(constraints: ActionConstraints, ...listeners: Middleware<SlackOptionsMiddlewareArgs<Source>>[]): void;
    view<ViewActionType extends SlackViewAction = SlackViewAction>(callbackId: string | RegExp, ...listeners: Middleware<SlackViewMiddlewareArgs<ViewActionType>>[]): void;
    view<ViewActionType extends SlackViewAction = SlackViewAction>(constraints: ViewConstraints, ...listeners: Middleware<SlackViewMiddlewareArgs<ViewActionType>>[]): void;
    error(errorHandler: ErrorHandler): void;
    error(errorHandler: ExtendedErrorHandler): void;
    /**
     * Handles events from the receiver
     */
    processEvent(event: ReceiverEvent): Promise<void>;
    /**
     * Global error handler. The final destination for all errors (hopefully).
     */
    private handleError;
    private initReceiver;
    private initAuthorizeIfNoTokenIsGiven;
    private initAuthorizeInConstructor;
}
//# sourceMappingURL=App.d.ts.map