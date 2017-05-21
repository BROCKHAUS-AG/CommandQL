namespace BROCKHAUSAG.Transport {

    export enum TransportStatus { None, Ready, InUse, Disconnected, Error, Connecting }

    export interface ITransport {
        name: string;
        getStatus(): TransportStatus;
        sendData(sendData: Entities.SendDataObject, poll?: boolean): void;
    }

    export interface IServerManagedTransport extends ITransport {
        addSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        removeSubscription(subscription: Entities.CommandQLTopicSubscription): void;
        resetSubscriptions(): void;
    }
}