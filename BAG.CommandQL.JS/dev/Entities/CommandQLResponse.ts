namespace BROCKHAUSAG.Entities {
    export class CommandQLResponse {
        public commands: Entities.CommandQLCommand[];
        public errors: string[];
        public t: number;
    }
}