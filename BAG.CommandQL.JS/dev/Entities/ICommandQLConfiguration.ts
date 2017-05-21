namespace BROCKHAUSAG.Entities {
    export interface ICommandQLConfiguration {
        serverpath: string;
        handler: any;
        sender: string;
        token?: string;
        qs?: string;
        timeout?: number;
        completeTimeout?: number;
        callWithEmptyReturn?: boolean;
        headers?: any;
        loggingType?: LoggingType;
        tracing?: boolean;
        useHttp?: boolean;
    }
}