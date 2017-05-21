namespace BROCKHAUSAG {

    export class SubscriptionManager {
        public static subscriptions: Entities.CommandQLCommand[] = [];
        public static topicSubscriptions: Entities.CommandQLTopicSubscription[] = [];

        public static makeSubscription(subscription: Entities.CommandQLTopicSubscription): void {
            Logger.Log("subscribe topic " + subscription.topic, subscription.parameters, MessageType.Info);

            if (TransportManager.serverHandlesTopicSubscriptions()) {
                TransportManager.serverAddSubscription(subscription);
            }

            this.topicSubscriptions.push(subscription);
        }

        public static makeCommandSubscription(subscription: Entities.CommandQLCommand): void {
            Logger.Log("subscribe command " + subscription.name, subscription.parameters, MessageType.Info);
            this.subscriptions.push(subscription);
        }

        public static removeSubscription(topic: string, data?: any, id?: string): void {
            Logger.Log("unsubscribe topic " + topic, id, MessageType.Info);

            let subscriptionObject: Entities.CommandQLTopicSubscription | undefined;

            for (let i = 0; i < this.topicSubscriptions.length; i--) {
                if (this.topicSubscriptions[i].topic === topic && (!id || this.topicSubscriptions[i].id === id) && (!data || data === this.topicSubscriptions[i].parameters)) {
                    subscriptionObject = this.topicSubscriptions[i];
                    this.topicSubscriptions.splice(i, 1);
                    Logger.Log("unsubscribed topic " + topic, id, MessageType.Info);
                }
            }

            if (TransportManager.serverHandlesTopicSubscriptions() && subscriptionObject) {
                TransportManager.serverRemoveSubscription(subscriptionObject);
            }
        }

        public static removeCommandSubscription(command: string, data?: any, id?: string): void {
            Logger.Log("unsubscribe command " + command, id, MessageType.Info);

            let subscriptionObject: Entities.CommandQLCommand | undefined;

            for (let i = 0; i < this.subscriptions.length; i--) {
                if (this.subscriptions[i].name === command && (!id || this.subscriptions[i].id === id) && (!data || data === this.subscriptions[i].parameters)) {
                    subscriptionObject = this.subscriptions[i];
                    this.subscriptions.splice(i, 1);
                    Logger.Log("unsubscribed command " + command, id, MessageType.Info);
                }
            }
        }

        public static removeAllSubscriptions(): void {
            Logger.Log("unsubscribeAll", null, MessageType.Info);

            this.topicSubscriptions = [];

            if (TransportManager.serverHandlesTopicSubscriptions()) {
                TransportManager.serverRemoveAllSubscriptions();
            }
        }

        public static removeAllCommandSubscriptions(): void {
            Logger.Log("unsubscribeAll commands", null, MessageType.Info);

            this.subscriptions = [];
        }
    }
}