// BROCKHAUS AG 2017
// Paul Mizel
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Status;
    (function (Status) {
        Status[Status["None"] = 0] = "None";
        Status[Status["Connected"] = 1] = "Connected";
        Status[Status["Disconnected"] = 2] = "Disconnected";
    })(Status || (Status = {}));
    ;
    var LoggingType;
    (function (LoggingType) {
        LoggingType[LoggingType["Info"] = 0] = "Info";
        LoggingType[LoggingType["Debug"] = 1] = "Debug";
        LoggingType[LoggingType["Error"] = 2] = "Error";
        LoggingType[LoggingType["Warn"] = 3] = "Warn";
    })(LoggingType || (LoggingType = {}));
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
            this.loggingType = LoggingType.Info;
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
            //headers
            if (settings.headers) {
                this.headers = settings.headers;
            }
            else {
                this.headers = {
                    'Authorization': "Token " + this.token
                };
            }
            //logging
            if (settings.loggingType) {
                this.loggingType = settings.loggingType;
            }
        }
        CommandQL.prototype.publish = function (cmd, data, success, error) {
            var that = this;
            that._log("publish " + cmd, data, LoggingType.Info);
            that.invoke(cmd, data, success, error);
        };
        CommandQL.prototype.subscribe = function (cmd, data, success, error) {
            var that = this;
            that._log("subscribe " + cmd, data, LoggingType.Info);
            that.commands.push({
                "name": cmd,
                "parameters": data,
                "success": success,
                "error": error
            });
        };
        CommandQL.prototype.unsubscribe = function (cmd, data) {
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
            }
            else {
                that._log("unsubscribe " + cmd, null, LoggingType.Info);
                for (var i_1 = that.commands.length - 1; i_1 >= 0; i_1--) {
                    if (that.commands[i_1].name === cmd) {
                        that.commands.splice(i_1, 1);
                        that._log("unsubscribed " + cmd, null, LoggingType.Info);
                    }
                }
            }
        };
        CommandQL.prototype.unsubscribeAll = function () {
            this._log("unsubscribeAll", null, LoggingType.Info);
            for (var i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
            }
        };
        CommandQL.prototype.connect = function () {
            this._log("connect", null, LoggingType.Info);
            this.status = Status.Connected;
            return "connect";
        };
        CommandQL.prototype.disconnect = function () {
            this._log("disconnect", null, LoggingType.Info);
            this.status = Status.Disconnected;
            return "disconnect";
        };
        CommandQL.prototype.poll = function (success, error) {
            var that = this;
            if (that.status == Status.None) {
                that._log("don't call pull before connect.(None)", null, LoggingType.Error);
                return 400;
            }
            if (that.status == Status.Disconnected) {
                that._log("don't call pull before connect.(Disconnected)", null, LoggingType.Info);
                return 300;
            }
            var pollData = {
                "sender": that.sender,
                "commands": that.commands
            };
            var completeFn = function () { return setTimeout(function () { that.poll(); }, that.completeTimeout); };
            that._ajax(pollData, success, error, completeFn);
            return 200;
        };
        CommandQL.prototype.invoke = function (cmd, data, success, error) {
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
        };
        CommandQL.prototype._ajax = function (ajaxData, success, error, completeFn) {
            var that = this;
            that._log("_ajax", ajaxData, LoggingType.Info);
            var clonedObj = {
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
                }
                else {
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
        };
        CommandQL.prototype._success = function (that, data, success) {
            //Update
            that._log("_success " + (data.t) + "ms", data, LoggingType.Info);
            $.each(data.commands, function (index, cmd) {
                if (typeof success === "function") {
                    if (cmd.return && cmd.return.result) {
                        success(cmd.return.result);
                    }
                    else {
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
                    }
                    else {
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
            });
        };
        CommandQL.prototype._error = function (that, xhr, textStatus, errorThrown, error) {
            that._log("_error " + textStatus, errorThrown, LoggingType.Info);
            if (typeof error === "function") {
                error(xhr, textStatus, errorThrown);
            }
            var fnOnError = that.handler["onError"];
            if (typeof fnOnError === 'function') {
                that._log("call onError-" + textStatus, errorThrown, LoggingType.Info);
                fnOnError(xhr, textStatus, errorThrown);
            }
        };
        CommandQL.prototype._log = function (msg, obj, loggingType) {
            if (!loggingType) {
                loggingType = this.loggingType;
            }
            if (loggingType == LoggingType.Info) {
                console.info(msg); //, obj || {}
                if (obj && console.table) {
                    console.table(obj);
                }
            }
            if (loggingType == LoggingType.Debug) {
                console.log(msg); //, obj || {}
            }
            if (loggingType == LoggingType.Error) {
                console.error(msg); //, obj || {}
            }
            if (loggingType == LoggingType.Warn) {
                console.warn(msg); //, obj || {}
            }
        };
        CommandQL.prototype._find = function (obj, name, value) {
            for (var i = 0, len = obj.length; i < len; i++) {
                if (obj[i][name] === value)
                    return obj[i]; // Return as soon as the object is found
            }
            return null; // The object was not found
        };
        CommandQL.prototype.newGuid = function () {
            var result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return result;
        };
        return CommandQL;
    })();
    BROCKHAUSAG.CommandQL = CommandQL;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
//# sourceMappingURL=CommandQL.js.map