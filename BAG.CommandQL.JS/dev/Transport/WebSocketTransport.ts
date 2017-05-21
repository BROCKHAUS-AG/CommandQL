namespace BROCKHAUSAG.Transport {

    export class WebSocketTransport implements IServerManagedTransport {
        public name: string = "socket";

        private url: string;

        private socket: WebSocket;
        private notSendStack: Entities.SendDataObject[] = [];
        private sendStack: Entities.SendDataObject[] = [];

        constructor(private settings: Entities.ICommandQLConfiguration) {
            let that = this;

            this.url = this.settings.serverpath.indexOf("https") !== -1 ? "wss" + this.settings.serverpath.replace("https", "") : "ws" + this.settings.serverpath.replace("http", "");
            this.socket = new WebSocket(this.url);

            this.socket.onclose = function() {
                setTimeout(function(){
                    let onopenHandler = that.socket.onopen;
                    let oncloseHandler = that.socket.onclose;
                    let onmessageHandler = that.socket.onmessage;

                    that.socket = new WebSocket(that.url);
                    that.socket.onopen = onopenHandler;
                    that.socket.onclose = oncloseHandler;
                    that.socket.onmessage = onmessageHandler;
                }, 1000);
            };

            this.socket.onopen = function() {
                if (SubscriptionManager.subscriptions.length > 0) {
                    let data: Entities.WebSocketMessage = {
                        type: "subscribeMany",
                        data: SubscriptionManager.topicSubscriptions
                    };

                    that.socket.send(JSON.stringify(data));
                }

                if (that.notSendStack.length > 0) {
                    for (let i = 0; i < that.notSendStack.length; i++) {
                        let obj: any = that.notSendStack[i];
                        that.notSendStack.splice(i, 1);
                        that.sendData(obj);
                    }
                }
            };

            this.socket.onmessage = function(ev: MessageEvent) {
                let data: Entities.WebSocketMessage = JSON.parse(ev.data);

                if (data.type === "executeResult") {
                    let result: Entities.ResponseDataObject = data.data;

                    let sendObject: Entities.SendDataObject = Helper.Find(that.sendStack, "id", result.id, true);

                    if (sendObject) {
                        if (sendObject.success) {
                            sendObject.success(result.data);
                        }

                        if (sendObject.complete) {
                            sendObject.complete();
                        }
                    }
                } else if (data.type === "subscribeResult") {
                    return;
                }
            };
        }

        public addSubscription(subscription: Entities.CommandQLTopicSubscription): void {
            if (this.socket.readyState === 1) {
                let data: Entities.WebSocketMessage = {
                    type: "subscribe",
                    data: subscription
                };

                this.socket.send(JSON.stringify(data));
            }
        }

        public removeSubscription(subscription: Entities.CommandQLTopicSubscription): void {
            if (this.socket.readyState === 1) {
                let data: Entities.WebSocketMessage = {
                    type: "unsubscribe",
                    data: subscription
                };

                this.socket.send(JSON.stringify(data));
            }
        }

        public resetSubscriptions(): void {
            if (this.socket.readyState === 1) {
                let data: Entities.WebSocketMessage = {
                    type: "reset"
                };

                this.socket.send(JSON.stringify(data));
            }
        }

        public getStatus(): TransportStatus {
            if (this.socket.readyState === 1) {
                return TransportStatus.Ready;
            } else {
                return TransportStatus.Connecting;
            }
        }

        public sendData(sendData: Entities.SendDataObject, poll?: boolean): void {

            if (this.socket.readyState === 1) {
                this.sendStack.push(sendData);

                let data: Entities.WebSocketMessage = {
                    type: "execute",
                    data: sendData
                };

                this.socket.send(JSON.stringify(data));
            } else {
                if (poll !== true) {
                    this.notSendStack.push(sendData);
                } else {
                    if (sendData.error) {
                        sendData.error("No socket connection is open");
                    }
                }
            }
        }
    }
}