namespace BROCKHAUSAG.Entities {

    export class SendDataObject {
        public data: any;
        public id: string;
        public success?: (data: any) => void;
        public error?: (error: any) => void;
        public complete?: () => void;
    }
}