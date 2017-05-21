namespace BROCKHAUSAG.Entities {
    export class CommandQLCommand {
        public name: string;
        public parameters: any;
        public success?: (data: any) => void;
        public error?: (error: any) => void;
        public id: string;
        public errors?: string[];
        public return?: any;
    }
}