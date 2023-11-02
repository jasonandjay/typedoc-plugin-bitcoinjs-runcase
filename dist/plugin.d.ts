import { Application } from "typedoc";
export declare class Plugin {
    initialize(typedoc: Readonly<Application>): void;
    private subscribeToApplicationEvents;
    private onBeginResolve;
}
