// BROCKHAUS AG 2017
// Paul Mizel

module BROCKHAUSAG {

    export enum Status { None, Connected, Disconnected, Poll };
    export enum LoggingType { None, Info, Debug, Error, Warn, Sequence };

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
        public $request: any;
        public $index: number = 0;
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
                if (window.location["origin"]) {
                    this.serverpath = window.location["origin"] + "/api/commandQL/";
                }
                else {
                    this.serverpath = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "/api/commandQL/";
                }
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

        public publish(cmd: string, data: any, success?: Function, error?: Function) {
            var that = this;
            that._log("publish " + cmd, data, LoggingType.Info);
            return that.invoke(cmd, data, success, error);
        }

        public subscribe(cmd: string, data: any, success?: Function, error?: Function) {
            var that = this;
            that._log("subscribe " + cmd, data, LoggingType.Info);
            var command = {
                "name": cmd,
                "parameters": data,
                "success": success,
                "error": error
            };
            if (data.length > 0 && data[0]["counter"] && data[0]["counter"] > 0) {
                command["counter"] = data[0]["counter"];
            }
            if (data.length > 0 && data[0]["each"] && data[0]["each"] > 1) {
                command["each"] = data[0]["each"];
            }
            that.commands.push(command);
            return this;
        }



        public unsubscribe(cmd: string, data?: any) {
            var that = this;
            if (data) {
                that._log("unsubscribe " + cmd, data, LoggingType.Info);
                for (var i = that.commands.length - 1; i >= 0; i--) {
                    if (that.commands[i].name === cmd) {
                        var parameters = this.commands[i].parameters;
                        $.each(data, function (k, v) {
                            console.log(k + " = " + v);
                            if (parameters[k] == v) {
                                that.commands.splice(i, 1);
                                that._log("unsubscribed " + cmd, data, LoggingType.Info);
                            }
                        });
                    }
                }
            } else {
                that._log("unsubscribe " + cmd, null, LoggingType.Info);
                for (let i = that.commands.length - 1; i >= 0; i--) {
                    if (that.commands[i].name === cmd) {
                        that.commands.splice(i, 1);
                        that._log("unsubscribed " + cmd, null, LoggingType.Info);
                    }
                }
            }
            return this;
        }

        public unsubscribeAll() {
            this._log("unsubscribeAll", null, LoggingType.Info);
            for (let i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
            }
            return this;
        }

        public connect() {
            this._log("connect", null, LoggingType.Info);
            this.status = Status.Connected;
            return this;
        }

        public disconnect() {
            this._log("disconnect", null, LoggingType.Info);
            this.status = Status.Disconnected;
            return this;
        }

        public poll(success?: Function, error?: Function, ignoreCompleteFn?: boolean) {
            var that = this;
            if (that.status == Status.None) {
                that._log("don't call poll before connect.(None)", null, LoggingType.Error);
                return 400;
            }
            if (that.status == Status.Disconnected) {
                that._log("don't call poll before connect.(Disconnected)", null, LoggingType.Info);
                return 300;
            }
            if (that.status == Status.Poll) {
                that._log("don't call poll many times.(Poll)", null, LoggingType.Warn);
                return 500;
            }
            that.status = Status.Poll;

            var pollData = {
                "sender": that.sender,
                "commands": that.commands
            };
            var completeFn = null;
            if (!(ignoreCompleteFn && ignoreCompleteFn == true)) {
                completeFn = () => setTimeout(function () { that.poll(success, error); }, that.completeTimeout);
            }
            that._ajax(pollData, success, error, completeFn);
            return 200;
        }

        public invoke(cmd: string, data: any, success?: Function, error?: Function) {
            var that = this;
            if (that.status == Status.None) {
                that._log("don't call invoke before connect.(None)", null, LoggingType.Error);
                return 400;
            }
            if (that.status == Status.Disconnected) {
                that._log("don't call invoke before connect.(Disconnected)", null, LoggingType.Info);
                return 300;
            }
            that._log("invoke " + cmd, data, LoggingType.Info);
            var invokeData = {
                "sender": that.sender,
                "commands": [{
                    "name": cmd,
                    "parameters": data
                }]
            };
            that._ajax(invokeData, success, error, null);
            return 200;
        }

        private _ajax(ajaxData: any, success?: Function, error?: Function, completeFn?: any) {
            var that = this;
            that._log("_ajax", ajaxData, LoggingType.Info);

            var clonedObj: any = {
                index: that.$index++,
                sender: ajaxData.sender,
                commands: []
            };

            for (var i = ajaxData.commands.length - 1; i >= 0; i--) {
                var element = ajaxData.commands[i];
                if (element["counter"] && (--element.counter) == 0) {
                    ajaxData.commands.splice(i, 1);
                    continue;
                }
                if (!element["each"] || (element["each"] && (that.$index % element.each) == 0)) {
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
                }
            }

            if (that.$request != null) {
                that.$request.abort();
                that.$request = null;
            }

            that.$request = $.ajax({
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
            that._log("_success " + (data.t) + "ms", data, LoggingType.Info);
            $.each(data.commands, function (index, cmd) {

                if (cmd.errors && cmd.errors.length > 0) {//check if errors
                    $.each(cmd.errors, function (index, err) {
                        that._log("call " + cmd.name + " returns with error " + err, null, LoggingType.Warn);
                    });
                }
                else { //without errors           
                    if (typeof success === "function") {
                        if (cmd.return && cmd.return.result) {
                            success(cmd.return.result);
                        } else {
                            success(cmd.return);
                        }
                    }
                    else {
                        var fnHandler = null;
                        var findedCommand = that._find(that.commands, "name", cmd.name);
                        if (findedCommand && findedCommand.success) {
                            fnHandler = findedCommand.success;
                        }
                        else {
                            fnHandler = that.handler[cmd.name];
                        }
                        if (typeof fnHandler === 'function') {
                            that._log("call " + cmd.name, cmd.return, LoggingType.Info);
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

                    var fnOnComplete = that.handler["onComplete"];
                    if (typeof fnOnComplete === 'function') {
                        //fnOnComplete(cmd.return, cmd.name);
                        if (cmd.return && cmd.return.result) {
                            that._log("call onComplete(data," + cmd.name + ")", cmd.return.result, LoggingType.Info);
                            fnOnComplete(cmd.return.result, cmd.name);
                        }
                        else {
                            that._log("call onComplete(data," + cmd.name + ")", cmd.return, LoggingType.Info);
                            fnOnComplete(cmd.return, cmd.name);
                        }
                    }
                }
            });
        }

        private _error(that: CommandQL, xhr, textStatus, errorThrown, error: Function) {
            that._log("_error " + textStatus, errorThrown, LoggingType.Info);
            if (typeof error === "function") {
                error(xhr, textStatus, errorThrown);
            }

            var fnOnError = that.handler["onError"];
            if (typeof fnOnError === 'function') {
                that._log("call onError-" + textStatus, errorThrown, LoggingType.Info);
                fnOnError(xhr, textStatus, errorThrown);
            }
        }

        private _log(msg: string, obj?: any, loggingType?: LoggingType) {
            var that = this;
            if (!loggingType) {
                loggingType = that.loggingType;
            }
            if (loggingType == LoggingType.Info && that.loggingType != LoggingType.None) {
                console.info(msg); //, obj || {}
                if (obj && (<any>console).table && that.loggingType == LoggingType.Debug) {
                    (<any>console).table(obj);
                }
            }
            if (loggingType == LoggingType.Debug && that.loggingType != LoggingType.None) {
                console.debug(msg);//, obj || {}
            }
            if (loggingType == LoggingType.Error && that.loggingType != LoggingType.None) {
                console.error(msg); //, obj || {}
            }
            if (loggingType == LoggingType.Warn && that.loggingType != LoggingType.None) {
                console.warn(msg); //, obj || {}
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