/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export interface CustomRoute {
    path: string;
    method: string | string[];
    handler: (req: IncomingMessage, res: ServerResponse) => void;
}
export interface ReceiverRoutes {
    [url: string]: {
        [method: string]: (req: IncomingMessage, res: ServerResponse) => void;
    };
}
export declare function buildReceiverRoutes(customRoutes: CustomRoute[]): ReceiverRoutes;
//# sourceMappingURL=custom-routes.d.ts.map