namespace BROCKHAUSAG {

    export class TransportManager {
        private static currentTransport: Transport.ITransport;
        private static settings: Entities.ICommandQLConfiguration;

        public static config(settings: Entities.ICommandQLConfiguration): void {
            this.settings = settings;

            if ("WebSocket" in window && settings.useHttp !== true) {
                this.currentTransport = new Transport.WebSocketTransport(this.settings);
            } else {
                this.currentTransport = new Transport.HttpTransport(this.settings);
            }
        }

        public static serverHandlesTopicSubscriptions(): boolean {
            return this.currentTransport.name === "socket";
        }

        public static serverAddSubscription(subscription: Entities.CommandQLTopicSubscription): void {
            (this.currentTransport as Transport.IServerManagedTransport).addSubscription(subscription);
        }

        public static serverRemoveSubscription(subscription: Entities.CommandQLTopicSubscription): void {
            (this.currentTransport as Transport.IServerManagedTransport).removeSubscription(subscription);
        }

        public static serverRemoveAllSubscriptions(): void {
            (this.currentTransport as Transport.IServerManagedTransport).resetSubscriptions();
        }

        public static invoke(command: string, data: any, success?: (data: any) => void, error?: (error: any) => void): void {
            let invokeData: Entities.CommandQLRequest = {
                sender: this.settings.sender,
                commands: [{
                    name: command,
                    parameters: data,
                    id: Helper.GenerateGuid()
                }]
            };

            this.currentTransport.sendData({
                data: invokeData,
                success: success,
                error: error,
                id: Helper.GenerateGuid()
            });
        }

        public static begin(): void {
            this.poll();

            if (!this.serverHandlesTopicSubscriptions()) {
                this.getTopicUpdates();
            }
        }

        public static end(): void {
            this.breakPoll = true;
            this.breakTopicUpdates = true;
        }

        private static breakPoll: boolean = false;

        private static poll(): void {
            if (this.breakPoll === true) {
                this.breakPoll = false;
                return;
            }

            let commands: Entities.CommandQLCommand[] = [];

            for (let subscription of SubscriptionManager.subscriptions) {
                if (typeof subscription.parameters === "function") {
                    let pollObj: Entities.CommandQLCommand = {
                        error: subscription.error,
                        success: subscription.success,
                        id: subscription.id,
                        name: subscription.name,
                        parameters: subscription.parameters()
                    };

                    commands.push(pollObj);
                } else {
                    commands.push(subscription);
                }
            }

            let pollData: Entities.CommandQLRequest = {
                commands: commands,
                sender: this.settings.sender
            };

            this.createPollRequest(pollData);
        }

        public static createPollRequest(data: any): void {
            this.currentTransport.sendData({
                data: data,
                complete: this.pollCompleteHandler,
                success: this.pollSuccessHandler,
                error: this.pollErrorHandler,
                id: Helper.GenerateGuid()
            });
        }

        private static breakTopicUpdates: boolean = false;

        public static getTopicUpdates(): void {
            if (this.breakTopicUpdates === true) {
                this.breakTopicUpdates = false;
                return;
            }

            if (SubscriptionManager.topicSubscriptions.length > 0) {
                this.currentTransport.sendData({
                    data: {
                        topics: SubscriptionManager.topicSubscriptions,
                        sender: this.settings.sender
                    },
                    complete: this.topicCompleteHandler,
                    error: this.topicErrorHandler,
                    success: this.topicSuccessHandler,
                    id: Helper.GenerateGuid()
                });
            }
        }

        public static topicSuccessHandler(data: any): void {
            return;
        }

        public static topicErrorHandler(error: any): void {
            return;
        }

        public static topicCompleteHandler(): void {
            setTimeout(function(){
                TransportManager.getTopicUpdates();
            }, TransportManager.settings.completeTimeout);
        }

        public static pollSuccessHandler(data: Entities.CommandQLResponse): void {
            Logger.Log("_success " + (data.t) + "ms", data, MessageType.Info);

            for (let command of data.commands) {
                if (command.errors && command.errors.length > 0) {
                    for (let error of command.errors) {
                        Logger.Log("call " + command.name + " returns with error " + error, null, MessageType.Warning);
                    }
                } else {
                    let fnHandler = null;
                    let foundSubscription = Helper.Find(SubscriptionManager.subscriptions, "id", command.id);

                    if (foundSubscription && foundSubscription.success) {
                        fnHandler = foundSubscription.success;
                    } else {
                        fnHandler = TransportManager.settings.handler[command.name];
                    }

                    if (typeof fnHandler === "function") {
                        Logger.Log("call " + command.name, command.return, MessageType.Info);

                        if (command.return && command.return.result) {
                            fnHandler(command.return.result);
                        } else {
                            fnHandler(command.return);
                        }
                    } else {
                        Logger.Log("function " + command.name + " not found", null, MessageType.Warning);
                    }
                }
            }
        }

        public static pollErrorHandler(error: any): void {
            Logger.Log("_error ", error, MessageType.Error);
        }

        public static pollCompleteHandler(): void {
            setTimeout(function(){
                TransportManager.poll();
            }, TransportManager.settings.completeTimeout);
        }
    }
}