
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
            let that = this;
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
                    //Update
                    console.debug(data);
                    $.each(data.commands, function (index, cmd) {

                        let fnHandler = that.handler[cmd.name];
                        if (typeof fnHandler === 'function') {
                            console.debug("call " + cmd.name + " (" + cmd.return + ")");
                            //fnHandler(cmd.return);
                            if (cmd.return && cmd.return.result) {
                                fnHandler(cmd.return.result);
                            }
                            else {
                                fnHandler(cmd.return);
                            }
                        } else {
                            console.warn("function " + cmd.name + " not found");
                        }
                        let fnOnComplete = that.handler["onComplete"];
                        if (typeof fnOnComplete === 'function') {
                            console.debug("call onComplete(data," + cmd.name + ")");
                            //fnOnComplete(cmd.return, cmd.name);
                            if (cmd.return && cmd.return.result) {
                                fnOnComplete(cmd.return.result, cmd.name);
                            }
                            else {
                                fnOnComplete(cmd.return, cmd.name);
                            }
                        }
                    });

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    var fnOnError = that.handler["onError"];
                    if (typeof fnOnError === 'function') {
                        console.debug("call onError-" + textStatus);
                        fnOnError(xhr, textStatus, errorThrown);
                    }
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
            this.invoke(cmd, data);
        }

        unsubscribe(cmd: string) {
            console.log("unsubscribe " + cmd);
            for (let i = this.commands.length - 1; i >= 0; i--) {
                if (this.commands[i].name === cmd) {
                    this.commands.splice(i, 1);
                }
            }
        }

        connect() {
            this.status = Status.Connected;
            return "connect";
        }

        disconnect() {
            this.status = Status.Disconnected;
            return "disconnect";
        }

        poll() {
            let that = this;
            if (this.status == Status.None) {
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

            let completeFunction = () => setTimeout(function () { that.poll() }, this.completeTimeout);

            $.ajax({
                url: this.serverpath,
                type: 'POST',
                dataType: "json",
                data: pullData,
                timeout: this.timeout,
                complete: completeFunction,
                success: function (data) {
                    //Update
                    console.debug(data);
                    $.each(data.commands, function (index, cmd) {

                        let fnHandler = that.handler[cmd.name];
                        if (typeof fnHandler === 'function') {
                            console.debug("call " + cmd.name + " (" + cmd.return + ")");
                            //fnHandler(cmd.return);
                            if (cmd.return && cmd.return.result) {
                                fnHandler(cmd.return.result);
                            }
                            else {
                                fnHandler(cmd.return);
                            }
                        } else {
                            console.warn("function " + cmd.name + " not found");
                        }
                        let fnOnComplete = that.handler["onComplete"];
                        if (typeof fnOnComplete === 'function') {
                            console.debug("call onComplete(data," + cmd.name + ")");
                            //fnOnComplete(cmd.return, cmd.name);
                            if (cmd.return && cmd.return.result) {
                                fnOnComplete(cmd.return.result, cmd.name);
                            }
                            else {
                                fnOnComplete(cmd.return, cmd.name);
                            }
                        }
                    });

                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    var fnOnError = that.handler["onError"];
                    if (typeof fnOnError === 'function') {
                        console.debug("call onError-" + textStatus);
                        fnOnError(xhr, textStatus, errorThrown);
                    }
                }
            });

            return 200;
        }

    }

}