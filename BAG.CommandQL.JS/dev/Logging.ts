namespace BROCKHAUSAG {

    export enum LoggingType { None, All, Info, Warning, Error, Debug }

    export enum MessageType { Info, Warning, Error, Debug }

    export class Logger {

        public static loggingType: LoggingType = LoggingType.None;

        public static Log(message: string, object?: any, messageType?: MessageType) {
            if (this.loggingType === LoggingType.None) {
                return;
            }

            switch (messageType) {
                case MessageType.Info:
                    console.info(message);

                    if (object && console.table && this.loggingType === LoggingType.Debug) {
                        console.table(object);
                    }

                    break;
                case MessageType.Warning:
                    if (this.loggingType !== LoggingType.Info) {
                        console.warn(message);
                    }

                    break;
                case MessageType.Error:
                    if (this.loggingType !== LoggingType.Info && this.loggingType !== LoggingType.Warning) {
                        console.error(message);
                    }

                    break;
                case MessageType.Debug:
                    if (this.loggingType === LoggingType.Debug) {
                        console.debug(message);
                    }

                    break;
                default:
                    break;
            }
        }

    }

}