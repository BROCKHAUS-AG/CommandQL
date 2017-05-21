namespace BROCKHAUSAG.Entities {
    export class CommandQLTopicSubscription {
        public topic: string;
        public parameters: any;
        public success?: (data: any) => void;
        public error?: (error: any) => void;
        public id: string;
    }
}