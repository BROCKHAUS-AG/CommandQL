namespace BROCKHAUSAG.Entities {
    export class CommandQLRequest {
        public sender: string;
        public commands: CommandQLCommand[];
        public executeParallel?: boolean;
    }
}