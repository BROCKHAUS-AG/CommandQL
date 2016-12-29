var BAG;
(function (BAG) {
    var Status;
    (function (Status) {
        Status[Status["None"] = 0] = "None";
        Status[Status["Connected"] = 1] = "Connected";
        Status[Status["Disconnected"] = 2] = "Disconnected";
    })(Status || (Status = {}));
    ;
    // TypeScript
    var CommandQL = (function () {
        // Constructor 
        function CommandQL(settings) {
            this.commands = Array();
            this.timeout = 30000;
            this.completeTimeout = 5000;
            this.sender = "cmdQL.sender";
            this.status = Status.None;
            this.token = "";
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
            }
            else {
                this.serverpath = window.location.origin + "/api/commandQL/";
            }
            //handler
            if (settings.handler) {
                this.handler = settings.handler;
            }
            else {
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
            }
            else {
                this.headers = {
                    'Authorization': "Token " + this.token
                };
            }
        }
        CommandQL.prototype.subscribe = function (cmd, data, success, error) {
            console.log("subscribe " + cmd);
            this.commands.push({
                "name": cmd,
                "parameters": data,
                "return": null,
                "success": success,
                "error": error
            });
        };
        CommandQL.prototype.publish = function (cmd, data, success, error) {
            console.log("publish " + cmd);
            this.invoke(cmd, data, success, error);
        };
        CommandQL.prototype.unsubscribe = function (cmd) {
            console.log("unsubscribe " + cmd);
            for (var i = this.commands.length - 1; i >= 0; i--) {
                if (this.commands[i].name === cmd) {
                    this.commands.splice(i, 1);
                }
            }
        };
        CommandQL.prototype.unsubscribeAll = function () {
            console.log("unsubscribeAll");
            for (var i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
            }
        };
        CommandQL.prototype.connect = function () {
            this.status = Status.Connected;
            return "connect";
        };
        CommandQL.prototype.disconnect = function () {
            this.status = Status.Disconnected;
            return "disconnect";
        };
        CommandQL.prototype.poll = function () {
            var _this = this;
            var that = this;
            if (this.status == Status.None) {
                console.log("don't call pull before connect.");
                return 400;
            }
            if (this.status == Status.Disconnected) {
                console.log("don't call pull before connect.");
                return 300;
            }
            var pullData = {
                "sender": this.sender,
                "commands": [this.commands]
            };
            var completeFunction = function () { return setTimeout(function () { that.poll(); }, _this.completeTimeout); };
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
                        var fnHandler = that.handler[cmd.name];
                        if (typeof fnHandler === 'function') {
                            console.debug("call " + cmd.name + " (" + cmd.return + ")");
                            //fnHandler(cmd.return);
                            if (cmd.return && cmd.return.result) {
                                fnHandler(cmd.return.result);
                            }
                            else {
                                fnHandler(cmd.return);
                            }
                        }
                        else {
                            console.warn("function " + cmd.name + " not found");
                        }
                        var fnOnComplete = that.handler["onComplete"];
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
        };
        CommandQL.prototype.invoke = function (cmd, data, success, error) {
            var that = this;
            console.log("invoke " + cmd);
            var invokeData = {
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
        };
        CommandQL.prototype._success = function (that, data, success) {
            //Update
            console.debug(data);
            $.each(data.commands, function (index, cmd) {
                if (typeof success === "function") {
                    if (cmd.return && cmd.return.result) {
                        success(cmd.return.result);
                    }
                    else {
                        success(cmd.return);
                    }
                }
                var fnHandler = that.handler[cmd.name];
                if (typeof fnHandler === 'function') {
                    console.debug("call " + cmd.name + " (" + cmd.return + ")");
                    //fnHandler(cmd.return);
                    if (cmd.return && cmd.return.result) {
                        fnHandler(cmd.return.result);
                    }
                    else {
                        fnHandler(cmd.return);
                    }
                }
                else {
                    console.warn("function " + cmd.name + " not found");
                }
                var fnOnComplete = that.handler["onComplete"];
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
        };
        CommandQL.prototype._error = function (that, xhr, textStatus, errorThrown, error) {
            console.log(textStatus);
            if (typeof error === "function") {
                {
                    error(xhr, textStatus, errorThrown);
                }
                var fnOnError = that.handler["onError"];
                if (typeof fnOnError === 'function') {
                    console.debug("call onError-" + textStatus);
                    fnOnError(xhr, textStatus, errorThrown);
                }
            }
        };
        return CommandQL;
    })();
    BAG.CommandQL = CommandQL;
})(BAG || (BAG = {}));
