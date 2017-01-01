// BROCKHAUS AG 2017
// Paul Mizel

module BAG {
    enum Status { None, Connected, Disconnected };
    enum LoggingType { Info, Debug, Error, Warn };

    export interface IConfigurationQL {
        serverpath?: string;
        handler: any;
        sender: string;
        token?: string;
        qs?: string;
        timeout?: number;
        completeTimeout?: number;
        callWithEmptyReturn?: boolean;
        headers?: any;
        loggingType?: LoggingType;
        tracing?: boolean;
    }
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
        public loggingType: LoggingType = LoggingType.Info;
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
            //headers
            if (settings.headers) {
                this.headers = settings.headers;
            } else {
                this.headers = {
                    'Authorization': "Token " + this.token
                };
            }
            //logging
            if (settings.loggingType) {
                this.loggingType = settings.loggingType;
            }
        }


        public subscribe(cmd: string, data: any, success?: Function, error?: Function) {
            let that = this;
            that._log("subscribe " + cmd, LoggingType.Info);
            that.commands.push({
                "name": cmd,
                "parameters": data,
                "success": success,
                "error": error
            });
        }

        public publish(cmd: string, data: any, success?: Function, error?: Function) {
            let that = this;
            that._log("publish " + cmd);
            that.invoke(cmd, data, success, error);
        }

        public unsubscribe(cmd: string, data?: any) {
            let that = this;
            if (data) {
                that._log("unsubscribe " + cmd + " data: " + JSON.stringify(data));
                for (var i = that.commands.length - 1; i >= 0; i--) {
                    if (that.commands[i].name === cmd) {
                        var parameters = this.commands[i].parameters;
                        $.each(data, function (k, v) {
                            console.log(k + " = " + v);
                            if (parameters[k] == v) {
                                that.commands.splice(i, 1);
                                that._log("unsubscribed " + cmd + " data: " + JSON.stringify(data));
                            }
                        });
                    }
                }
            } else {
                that._log("unsubscribe " + cmd);
                for (let i = that.commands.length - 1; i >= 0; i--) {
                    if (that.commands[i].name === cmd) {
                        that.commands.splice(i, 1);
                        that._log("unsubscribed " + cmd);
                    }
                }
            }
        }

        public unsubscribeAll() {
            this._log("unsubscribeAll");
            for (let i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
            }
        }

        public connect() {
            this._log("connect");
            this.status = Status.Connected;
            return "connect";
        }

        public disconnect() {
            this._log("disconnect");
            this.status = Status.Disconnected;
            return "disconnect";
        }

        public poll(success?: Function, error?: Function) {
            let that = this;
            if (that.status == Status.None) {
                that._log("don't call pull before connect.", LoggingType.Error);
                return 400;
            }
            if (that.status == Status.Disconnected) {
                that._log("don't call pull before connect.", LoggingType.Error);
                return 300;
            }
            let pollData = {
                "sender": that.sender,
                "commands": that.commands
            };
            var completeFn = () => setTimeout(function () { that.poll() }, that.completeTimeout);
            that._ajax(pollData, success, error, completeFn);
            return 200;
        }

        public invoke(cmd: string, data: any, success?: Function, error?: Function) {
            let that = this;
            that._log("invoke " + cmd + " data " + JSON.stringify(data));
            let invokeData = {
                "sender": that.sender,
                "commands": [{
                    "name": cmd,
                    "parameters": data
                }]
            };
            that._ajax(invokeData, success, error, null);
        }

        private _ajax(ajaxData: any, success?: Function, error?: Function, completeFn?: any) {
            let that = this;
            that._log("_ajax");

            let clonedObj: any = {
                sender: ajaxData.sender,
                commands: []
            };
            $.each(ajaxData.commands, function (index, element) {
                if (typeof element.parameters === 'function') {
                    clonedObj.commands.push({
                        "name": element.name,
                        "parameters": (element.parameters()),
                        "success": element.success,
                        "error": element.error
                    });
                } else {
                    clonedObj.commands.push({
                        "name": element.name,
                        "parameters": element.parameters,
                        "success": element.success,
                        "error": element.error
                    });
                }
            });

            $.ajax({
                url: that.serverpath,
                type: 'POST',
                dataType: "json",
                data: clonedObj,
                headers: that.headers,
                timeout: that.timeout,
                complete: completeFn,
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
            that._log("_success " + JSON.stringify(data));
            $.each(data.commands, function (index, cmd) {

                if (typeof success === "function") {
                    if (cmd.return && cmd.return.result) {
                        success(cmd.return.result);
                    } else {
                        success(cmd.return);
                    }
                }
                else {
                    let fnHandler = null;
                    var findedCommand = that._find(that.commands, "name", cmd.name);
                    if (findedCommand && findedCommand.success) {
                        fnHandler = findedCommand.success;
                    }
                    else {
                        fnHandler = that.handler[cmd.name];
                    }
                    if (typeof fnHandler === 'function') {
                        that._log("call " + cmd.name + " (" + JSON.stringify(cmd.return) + ")");
                        //fnHandler(cmd.return);
                        if (cmd.return && cmd.return.result) {
                            fnHandler(cmd.return.result);
                        }
                        else {
                            fnHandler(cmd.return);
                        }
                    } else {
                        that._log("function " + cmd.name + " not found", null, LoggingType.Warn);
                    }
                }

                let fnOnComplete = that.handler["onComplete"];
                if (typeof fnOnComplete === 'function') {
                    that._log("call onComplete(data," + cmd.name + ")");
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
            that._log("_error " + textStatus);
            if (typeof error === "function") {
                error(xhr, textStatus, errorThrown);
            }

            let fnOnError = that.handler["onError"];
            if (typeof fnOnError === 'function') {
                that._log("call onError-" + textStatus);
                fnOnError(xhr, textStatus, errorThrown);
            }
        }

        private _log(msg: string, obj?: any, loggingType?: LoggingType) {
            if (!loggingType) {
                loggingType = this.loggingType;
            }
            if (loggingType == LoggingType.Info) {
                console.info(msg, obj || {});
            }
            if (loggingType == LoggingType.Debug) {
                console.log(msg, obj || {});
            }
            if (loggingType == LoggingType.Error) {
                console.error(msg, obj || {});
            }
            if (loggingType == LoggingType.Warn) {
                console.warn(msg, obj || {});
            }
        }

        private _find(obj: any, name: string, value: any) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i][name] === value)
                    return obj[i]; // Return as soon as the object is found
            }
            return null; // The object was not found
        }

        public newGuid() {
            var result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return result;
        }



    }
}