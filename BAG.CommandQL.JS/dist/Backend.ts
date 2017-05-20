module BROCKHAUSAG {
    export interface ILiveChatBase {
        id: string;
        status: number;
        created: Date;
        updated: Date;
    }
    export interface ILiveChatUser extends ILiveChatBase {
        userName: string;
    }
    export interface ILiveChatChannel extends ILiveChatBase{
        userId: string,
        userName: string;
        applicationUserId: string;
        applicationUserName: string;
        liveChatRequestId: string;
        consultantName: string;
        messages: Array<ILiveChatMessage>;
    }
    export interface ILiveChatMessage extends ILiveChatBase{
        userName: string;
        message: string;
        senderId: string;
        isFromConsultant: boolean;
    }
    export class BackendApp {
        public cmdQL: CommandQL;
        public mandant: string;
        public mandantId: string;
        public group: string;
        public groupId: string;

        public liveChatUser: ILiveChatUser;
        
        public liveChatChannels: Array<ILiveChatChannel>;
        public liveChatMessages: any;

        public state: number;

        constructor(settings: IConfigurationQL) {
            this.cmdQL = new CommandQL(settings);

            this.cmdQL.connect();
        }

        run() {
            $("select[name=mandant]").change(function () {
                this.mandant = $("select[name=mandant]").val();
            });
            $("select[name=mandant]").change();
            $("")
        }

        changeState() {
            
        }


    }
}