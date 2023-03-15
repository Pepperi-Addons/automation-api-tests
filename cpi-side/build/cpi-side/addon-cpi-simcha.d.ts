import '@pepperi-addons/cpi-node';
declare global {
    var userEventsSet: Set<string>;
}
export declare function load(configuration: any): Promise<void>;
export declare const router: import("express-serve-static-core").Router;
