
module BAG {
    enum Status { None, Connected, Disconnected };
    // TypeScript
    export class CommandQL {  
        // Property (public by default)
        serverpath: string;
        handler: any;
        commands: Array<any> = Array();
        public timeout: number = 30000;
        public completeTimeout: number = 5000;
        public sender: string = "frontend";
        public status: Status = Status.None;
        
        // Constructor 
        constructor(handler: any, serverpath: string) {
            this.serverpath = serverpath;
            this.handler = handler;
            if (!this.serverpath) {
                this.serverpath = window.location.origin + "/api/commandQL/";
            }
            if (!this.handler) {
                this.handler = window;
            }
        }

        invoke(cmd: string, data: any) {
            var that = this;
            console.log("invoke " + cmd);
            let invokeData = {
                "sender": this.sender,
                "commands": [{
                    "name": cmd,
                    "parameters": data,
                    "return": null
                }]
            };
            $.ajax({
                url: this.serverpath,
                type: 'POST',
                dataType: "json",
                data: invokeData,
                //complete: setTimeout(function () { call() }, this.completeTimeout),
                timeout: this.timeout,
                success: function (data) {
                    //Update your dashboard gauge
                    console.debug(data);
                    $.each(data.commands, function (index, cmd) {

                        var fn = that.handler[cmd.name];
                        if (typeof fn === 'function') {
                            console.debug("call " + cmd.name + " (" + cmd.return + ")");
                            fn(cmd.return);
                        }

                    });

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }

        subscribe(cmd: string, data: any) {
            console.log("subscribe " + cmd);
            this.commands.push({
                "name": cmd,
                "parameters": data,
                "return": null
            });
        }

        publish(cmd: string, data: any) {
            console.log("publish " + cmd);
            //todo:
        }

        unsubscribe(cmd: string) {
            return "unsubscribe " + cmd;
        }

        connect() {
            this.status = Status.Connected;
            return "connect";
        }

        disconnect() {
            this.status = Status.Disconnected;
            return "disconnect";
        }

        pull() {
            if (this.status == Status.None){
                console.log("don't call pull before connect.");
                return 400;
            }
            if (this.status == Status.Disconnected) {
                console.log("don't call pull before connect.");
                return 300;
            }
            let pullData = {
                "sender": this.sender,
                "commands": [this.commands]
            };

            var completeFunction = () => setTimeout(function () { this.pull() }, this.completeTimeout);

            $.ajax({
                url: this.serverpath,
                type: 'POST',
                dataType: "json",
                data: pullData,
                timeout: this.timeout,
                complete: completeFunction,
                success: function (data) {
                    //Update your dashboard gauge
                    console.debug(data);
                    $.each(data.commands, function (index, cmd) {

                        var fn = this.handler[cmd.name];
                        if (typeof fn === 'function') {
                            console.debug("call " + cmd.name + " (" + cmd.return + ")");
                            fn(cmd.return);
                        }

                    });

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }

    }

}