
module BAG {
    enum Status { None, Connected, Disconnected };
    // TypeScript
    export class CommandQL {  
        // Property (public by default)
        public serverpath: string;
        public handler: any;
        public commands: Array<any> = Array();
        public timeout: number = 30000;
        public completeTimeout: number = 5000;
        public sender: string = "cmdQL.sender";
        public status: Status = Status.None;
        public token: string = "";
        public headers: any;
        // Constructor 
        constructor(settings: IConfigurationQL) {

            
            //timeout
            if (settings.completeTimeout) {
                this.completeTimeout = settings.completeTimeout;
            }
            //timeout
            if (settings.timeout) {
                this.timeout = settings.timeout;
            }
            //serverpath
            if (settings.serverpath) {
                this.serverpath = settings.serverpath;
            } else {
                this.serverpath = window.location.origin + "/api/commandQL/";
            }
            //handler
            if (settings.handler) {
                this.handler = settings.handler;
            } else {
                this.handler = window;
            }
            //timeout
            if (settings.token) {
                this.token = settings.token;
            }
            //sender
            if (settings.sender) {
                this.sender = settings.sender;
            }
            if (settings.headers) {
                this.headers = settings.headers;
            } else {
                this.headers = {
                    'Authorization': "Token " + this.token
                };
            }
        }



        subscribe(cmd: string, data: any, success?: Function, error?: Function) {
            console.log("subscribe " + cmd);
            this.commands.push({
                "name": cmd,
                "parameters": data,
                "return": null,
                "success": success,
                "error": error
            });
        }

        publish(cmd: string, data: any, success?: Function, error?: Function) {
            console.log("publish " + cmd);
            this.invoke(cmd, data, success, error);
        }

        unsubscribe(cmd: string) {
            console.log("unsubscribe " + cmd);
            for (let i = this.commands.length - 1; i >= 0; i--) {
                if (this.commands[i].name === cmd) {
                    this.commands.splice(i, 1);
                }
            }
        }

        unsubscribeAll() {
            console.log("unsubscribeAll");
            for (let i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
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
                headers: this.headers,
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

        invoke(cmd: string, data: any, success?: Function, error?: Function) {
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
                headers: this.headers,
                timeout: this.timeout,
                success: function (data) {
                    that._success(that, data, success);
                },
                error: function (xhr, textStatus, errorThrown) {
                    that._error(that, xhr, textStatus, errorThrown, error);
                }
            });
        }

        private _success(that: CommandQL, data, success: Function) {
            //Update
            console.debug(data);
            $.each(data.commands, function (index, cmd) {

                if (typeof success === "function") {
                    if (cmd.return && cmd.return.result) {
                        success(cmd.return.result);
                    } else {
                        success(cmd.return);
                    }
                }

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
        }

        private _error(that: CommandQL, xhr, textStatus, errorThrown, error: Function) {
            console.log(textStatus);
            if (typeof error === "function") {
            { error(xhr, textStatus, errorThrown); }

            var fnOnError = that.handler["onError"];
            if (typeof fnOnError === 'function') {
                console.debug("call onError-" + textStatus);
                fnOnError(xhr, textStatus, errorThrown);
            }
        }
    }

    interface IConfigurationQL {
        serverpath?: string;
        handler: any;
        sender: string;
        token?: string;
        qs?: string;
        timeout?: number;
        completeTimeout?: number;
        callWithEmptyReturn?: boolean;
        headers?: any;
    }
}