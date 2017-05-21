declare namespace BROCKHAUSAG {
    class CommandQL {
        private settings;
        $request: any;
        $index: number;
        constructor(_settings: Entities.ICommandQLConfiguration);
        subscribe(topic: string, data: any, success?: (data: any) => void, error?: (error: any) => void): this;
        subscribeCommand(cmd: string, data: any, success?: (data: any) => void, error?: (error: any) => void): this;
        unsubscribe(topic: string, data?: any, id?: string): this;
        unsubscribeCommand(cmd: string, data?: any, id?: string): this;
        unsubscribeAll(): this;
        unsubscribeAllCommands(): this;
        invoke(cmd: string, data: any, success?: (data: any) => void, error?: (error: any) => void): void;
        begin(): void;
        end(): void;
    }
}
declare namespace BROCKHAUSAG {
    class Helper {
        static GenerateGuid(): string;
        static Find(array: any[], property: string, value: any, remove?: boolean): any;
    }
}
declare namespace BROCKHAUSAG {
    enum ConnectionStatus {
        None = 0,
        Connected = 1,
        Disconnected = 2,
        Poll = 3,
    }
    class HttpHelper {
        makeRequest(): void;
    }
}
declare namespace BROCKHAUSAG {
    enum LoggingType {
        None = 0,
        All = 1,
        Info = 2,
        Warning = 3,
        Error = 4,
        Debug = 5,
    }
    enum MessageType {
        Info = 0,
        Warning = 1,
        Error = 2,
        Debug = 3,
    }
    class Logger {
        static loggingType: LoggingType;
        static Log(message: string, object?: any, messageType?: MessageType): void;
    }
}
declare namespace BROCKHAUSAG {
    class SubscriptionManager {
        static subscriptions: Entities.CommandQLCommand[];
        static topicSubscriptions: Entities.CommandQLTopicSubscription[];
        static makeSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        static makeCommandSubscription(subscription: Entities.CommandQLCommand): void;
        static removeSubscription(topic: string, data?: any, id?: string): void;
        static removeCommandSubscription(command: string, data?: any, id?: string): void;
        static removeAllSubscriptions(): void;
        static removeAllCommandSubscriptions(): void;
    }
}
declare namespace BROCKHAUSAG {
    class TransportManager {
        private static currentTransport;
        private static settings;
        static config(settings: Entities.ICommandQLConfiguration): void;
        static serverHandlesTopicSubscriptions(): boolean;
        static serverAddSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        static serverRemoveSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        static serverRemoveAllSubscriptions(): void;
        static invoke(command: string, data: any, success?: (data: any) => void, error?: (error: any) => void): void;
        static begin(): void;
        static end(): void;
        private static breakPoll;
        private static poll();
        static createPollRequest(data: any): void;
        private static breakTopicUpdates;
        static getTopicUpdates(): void;
        static topicSuccessHandler(data: any): void;
        static topicErrorHandler(error: any): void;
        static topicCompleteHandler(): void;
        static pollSuccessHandler(data: Entities.CommandQLResponse): void;
        static pollErrorHandler(error: any): void;
        static pollCompleteHandler(): void;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class CommandQLCommand {
        name: string;
        parameters: any;
        success?: (data: any) => void;
        error?: (error: any) => void;
        id: string;
        errors?: string[];
        return?: any;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class CommandQLRequest {
        sender: string;
        commands: CommandQLCommand[];
        executeParallel?: boolean;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class CommandQLResponse {
        commands: Entities.CommandQLCommand[];
        errors: string[];
        t: number;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class CommandQLTopicSubscription {
        topic: string;
        parameters: any;
        success?: (data: any) => void;
        error?: (error: any) => void;
        id: string;
    }
}
declare namespace BROCKHAUSAG.Entities {
    interface ICommandQLConfiguration {
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
declare namespace BROCKHAUSAG.Entities {
    class ResponseDataObject {
        data: any;
        id: string;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class SendDataObject {
        data: any;
        id: string;
        success?: (data: any) => void;
        error?: (error: any) => void;
        complete?: () => void;
    }
}
declare namespace BROCKHAUSAG.Entities {
    class WebSocketMessage {
        type: string;
        data?: any;
    }
}
declare namespace BROCKHAUSAG.Transport {
    class HttpTransport implements ITransport {
        private settings;
        name: string;
        constructor(settings: Entities.ICommandQLConfiguration);
        private makeRequest(sendData);
        getStatus(): TransportStatus;
        sendData(sendData: Entities.SendDataObject): void;
    }
}
declare namespace BROCKHAUSAG.Transport {
    enum TransportStatus {
        None = 0,
        Ready = 1,
        InUse = 2,
        Disconnected = 3,
        Error = 4,
        Connecting = 5,
    }
    interface ITransport {
        name: string;
        getStatus(): TransportStatus;
        sendData(sendData: Entities.SendDataObject, poll?: boolean): void;
    }
    interface IServerManagedTransport extends ITransport {
        addSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        removeSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        resetSubscriptions(): void;
    }
}
declare namespace BROCKHAUSAG.Transport {
    class WebSocketTransport implements IServerManagedTransport {
        private settings;
        name: string;
        private url;
        private socket;
        private notSendStack;
        private sendStack;
        constructor(settings: Entities.ICommandQLConfiguration);
        addSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        removeSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        resetSubscriptions(): void;
        getStatus(): TransportStatus;
        sendData(sendData: Entities.SendDataObject, poll?: boolean): void;
    }
}
