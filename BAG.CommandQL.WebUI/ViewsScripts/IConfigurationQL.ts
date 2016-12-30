interface IConfigurationQL {
    serverpath?: string;
    handler: any;
    sender: string;
    token?: string;
    qs?: string;
    timeout?: number;
    completeTimeout?: number;
    callWithEmptyReturn?: boolean;
    headers?: any;
}