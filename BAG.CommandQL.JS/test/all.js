// BROCKHAUS AG 2017
// Paul Mizel
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Status;
    (function (Status) {
        Status[Status["None"] = 0] = "None";
        Status[Status["Connected"] = 1] = "Connected";
        Status[Status["Disconnected"] = 2] = "Disconnected";
        Status[Status["Poll"] = 3] = "Poll";
    })(Status = BROCKHAUSAG.Status || (BROCKHAUSAG.Status = {}));
    ;
    var LoggingType;
    (function (LoggingType) {
        LoggingType[LoggingType["None"] = 0] = "None";
        LoggingType[LoggingType["Info"] = 1] = "Info";
        LoggingType[LoggingType["Debug"] = 2] = "Debug";
        LoggingType[LoggingType["Error"] = 3] = "Error";
        LoggingType[LoggingType["Warn"] = 4] = "Warn";
        LoggingType[LoggingType["Sequence"] = 5] = "Sequence";
    })(LoggingType = BROCKHAUSAG.LoggingType || (BROCKHAUSAG.LoggingType = {}));
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
            this.$index = 0;
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
            return that.invoke(cmd, data, success, error);
        };
        CommandQL.prototype.subscribe = function (cmd, data, success, error) {
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
            return this;
        };
        CommandQL.prototype.unsubscribeAll = function () {
            this._log("unsubscribeAll", null, LoggingType.Info);
            for (var i = this.commands.length - 1; i >= 0; i--) {
                this.commands.splice(i, 1);
            }
            return this;
        };
        CommandQL.prototype.connect = function () {
            this._log("connect", null, LoggingType.Info);
            this.status = Status.Connected;
            return this;
        };
        CommandQL.prototype.disconnect = function () {
            this._log("disconnect", null, LoggingType.Info);
            this.status = Status.Disconnected;
            return this;
        };
        CommandQL.prototype.poll = function (success, error, ignoreCompleteFn) {
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
                completeFn = function () { return setTimeout(function () { that.poll(success, error); }, that.completeTimeout); };
            }
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
            return 200;
        };
        CommandQL.prototype._ajax = function (ajaxData, success, error, completeFn) {
            var that = this;
            that._log("_ajax", ajaxData, LoggingType.Info);
            var clonedObj = {
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
                    }
                    else {
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
        };
        CommandQL.prototype._success = function (that, data, success) {
            //Update
            that._log("_success " + (data.t) + "ms", data, LoggingType.Info);
            $.each(data.commands, function (index, cmd) {
                if (cmd.errors && cmd.errors.length > 0) {
                    $.each(cmd.errors, function (index, err) {
                        that._log("call " + cmd.name + " returns with error " + err, null, LoggingType.Warn);
                    });
                }
                else {
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
            var that = this;
            if (!loggingType) {
                loggingType = that.loggingType;
            }
            if (loggingType == LoggingType.Info && that.loggingType != LoggingType.None) {
                console.info(msg); //, obj || {}
                if (obj && console.table && that.loggingType == LoggingType.Debug) {
                    console.table(obj);
                }
            }
            if (loggingType == LoggingType.Debug && that.loggingType != LoggingType.None) {
                console.debug(msg); //, obj || {}
            }
            if (loggingType == LoggingType.Error && that.loggingType != LoggingType.None) {
                console.error(msg); //, obj || {}
            }
            if (loggingType == LoggingType.Warn && that.loggingType != LoggingType.None) {
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
    }());
    BROCKHAUSAG.CommandQL = CommandQL;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsQ0FBQyxDQUFDLENBQUMsd0NBQXdDO1lBQy9ELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsMkJBQTJCO1FBQzVDLENBQUM7UUFFTSwyQkFBTyxHQUFkO1lBQ0ksSUFBSSxNQUFNLEdBQUcsc0NBQXNDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBSUwsZ0JBQUM7SUFBRCxDQW5XQSxBQW1XQyxJQUFBO0lBbldZLHFCQUFTLFlBbVdyQixDQUFBO0FBQ0wsQ0FBQyxFQXZYUyxXQUFXLEtBQVgsV0FBVyxRQXVYcEIiLCJmaWxlIjoiY29tbWFuZHFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQlJPQ0tIQVVTIEFHIDIwMTdcclxuLy8gUGF1bCBNaXplbFxyXG5cclxubmFtZXNwYWNlIEJST0NLSEFVU0FHIHtcclxuXHJcbiAgICBleHBvcnQgZW51bSBTdGF0dXMgeyBOb25lLCBDb25uZWN0ZWQsIERpc2Nvbm5lY3RlZCwgUG9sbCB9O1xyXG4gICAgZXhwb3J0IGVudW0gTG9nZ2luZ1R5cGUgeyBOb25lLCBJbmZvLCBEZWJ1ZywgRXJyb3IsIFdhcm4sIFNlcXVlbmNlIH07XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ29uZmlndXJhdGlvblFMIHtcclxuICAgICAgICBzZXJ2ZXJwYXRoPzogc3RyaW5nO1xyXG4gICAgICAgIGhhbmRsZXI6IGFueTtcclxuICAgICAgICBzZW5kZXI6IHN0cmluZztcclxuICAgICAgICB0b2tlbj86IHN0cmluZztcclxuICAgICAgICBxcz86IHN0cmluZztcclxuICAgICAgICB0aW1lb3V0PzogbnVtYmVyO1xyXG4gICAgICAgIGNvbXBsZXRlVGltZW91dD86IG51bWJlcjtcclxuICAgICAgICBjYWxsV2l0aEVtcHR5UmV0dXJuPzogYm9vbGVhbjtcclxuICAgICAgICBoZWFkZXJzPzogYW55O1xyXG4gICAgICAgIGxvZ2dpbmdUeXBlPzogTG9nZ2luZ1R5cGU7XHJcbiAgICAgICAgdHJhY2luZz86IGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICAvLyBUeXBlU2NyaXB0XHJcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFFMIHsgIFxyXG4gICAgICAgIC8vIFByb3BlcnR5IChwdWJsaWMgYnkgZGVmYXVsdClcclxuICAgICAgICBwdWJsaWMgc2VydmVycGF0aDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBoYW5kbGVyOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNvbW1hbmRzOiBBcnJheTxhbnk+ID0gQXJyYXkoKTtcclxuICAgICAgICBwdWJsaWMgdGltZW91dDogbnVtYmVyID0gMzAwMDA7XHJcbiAgICAgICAgcHVibGljIGNvbXBsZXRlVGltZW91dDogbnVtYmVyID0gNTAwMDtcclxuICAgICAgICBwdWJsaWMgc2VuZGVyOiBzdHJpbmcgPSBcImNtZFFMLnNlbmRlclwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0dXM6IFN0YXR1cyA9IFN0YXR1cy5Ob25lO1xyXG4gICAgICAgIHB1YmxpYyB0b2tlbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgaGVhZGVyczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBsb2dnaW5nVHlwZTogTG9nZ2luZ1R5cGUgPSBMb2dnaW5nVHlwZS5JbmZvO1xyXG4gICAgICAgIHB1YmxpYyAkcmVxdWVzdDogYW55O1xyXG4gICAgICAgIHB1YmxpYyAkaW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgLy8gQ29uc3RydWN0b3IgXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IElDb25maWd1cmF0aW9uUUwpIHtcclxuICAgICAgICAgICAgLy90aW1lb3V0XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5jb21wbGV0ZVRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVUaW1lb3V0ID0gc2V0dGluZ3MuY29tcGxldGVUaW1lb3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vdGltZW91dFxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0dGluZ3MudGltZW91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3NlcnZlcnBhdGhcclxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnNlcnZlcnBhdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVycGF0aCA9IHNldHRpbmdzLnNlcnZlcnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uW1wib3JpZ2luXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJwYXRoID0gd2luZG93LmxvY2F0aW9uW1wib3JpZ2luXCJdICsgXCIvYXBpL2NvbW1hbmRRTC9cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VydmVycGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArICh3aW5kb3cubG9jYXRpb24ucG9ydCA/ICc6JyArIHdpbmRvdy5sb2NhdGlvbi5wb3J0IDogJycpICsgXCIvYXBpL2NvbW1hbmRRTC9cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2hhbmRsZXJcclxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlciA9IHNldHRpbmdzLmhhbmRsZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXIgPSB3aW5kb3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy90aW1lb3V0XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy50b2tlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2tlbiA9IHNldHRpbmdzLnRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vc2VuZGVyXHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5zZW5kZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZGVyID0gc2V0dGluZ3Muc2VuZGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vaGVhZGVyc1xyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuaGVhZGVycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJzID0gc2V0dGluZ3MuaGVhZGVycztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVycyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IFwiVG9rZW4gXCIgKyB0aGlzLnRva2VuXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vbG9nZ2luZ1xyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9nZ2luZ1R5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2luZ1R5cGUgPSBzZXR0aW5ncy5sb2dnaW5nVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHB1Ymxpc2goY21kOiBzdHJpbmcsIGRhdGE6IGFueSwgc3VjY2Vzcz86IEZ1bmN0aW9uLCBlcnJvcj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgdGhhdC5fbG9nKFwicHVibGlzaCBcIiArIGNtZCwgZGF0YSwgTG9nZ2luZ1R5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGF0Lmludm9rZShjbWQsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdWJzY3JpYmUoY21kOiBzdHJpbmcsIGRhdGE6IGFueSwgc3VjY2Vzcz86IEZ1bmN0aW9uLCBlcnJvcj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgdGhhdC5fbG9nKFwic3Vic2NyaWJlIFwiICsgY21kLCBkYXRhLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgdmFyIGNvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogY21kLFxyXG4gICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogc3VjY2VzcyxcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogZXJyb3JcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCAmJiBkYXRhWzBdW1wiY291bnRlclwiXSAmJiBkYXRhWzBdW1wiY291bnRlclwiXSA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRbXCJjb3VudGVyXCJdID0gZGF0YVswXVtcImNvdW50ZXJcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCAmJiBkYXRhWzBdW1wiZWFjaFwiXSAmJiBkYXRhWzBdW1wiZWFjaFwiXSA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRbXCJlYWNoXCJdID0gZGF0YVswXVtcImVhY2hcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5jb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHVuc3Vic2NyaWJlKGNtZDogc3RyaW5nLCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcInVuc3Vic2NyaWJlIFwiICsgY21kLCBkYXRhLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGF0LmNvbW1hbmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuY29tbWFuZHNbaV0ubmFtZSA9PT0gY21kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gdGhpcy5jb21tYW5kc1tpXS5wYXJhbWV0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGssIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGsgKyBcIiA9IFwiICsgdik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1ldGVyc1trXSA9PSB2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jb21tYW5kcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwidW5zdWJzY3JpYmVkIFwiICsgY21kLCBkYXRhLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwidW5zdWJzY3JpYmUgXCIgKyBjbWQsIG51bGwsIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoYXQuY29tbWFuZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5jb21tYW5kc1tpXS5uYW1lID09PSBjbWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jb21tYW5kcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcInVuc3Vic2NyaWJlZCBcIiArIGNtZCwgbnVsbCwgTG9nZ2luZ1R5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHVuc3Vic2NyaWJlQWxsKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2coXCJ1bnN1YnNjcmliZUFsbFwiLCBudWxsLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuY29tbWFuZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNvbm5lY3QoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvZyhcImNvbm5lY3RcIiwgbnVsbCwgTG9nZ2luZ1R5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkNvbm5lY3RlZDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZGlzY29ubmVjdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiZGlzY29ubmVjdFwiLCBudWxsLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuRGlzY29ubmVjdGVkO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwb2xsKHN1Y2Nlc3M/OiBGdW5jdGlvbiwgZXJyb3I/OiBGdW5jdGlvbiwgaWdub3JlQ29tcGxldGVGbj86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAodGhhdC5zdGF0dXMgPT0gU3RhdHVzLk5vbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcImRvbid0IGNhbGwgcG9sbCBiZWZvcmUgY29ubmVjdC4oTm9uZSlcIiwgbnVsbCwgTG9nZ2luZ1R5cGUuRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDQwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhhdC5zdGF0dXMgPT0gU3RhdHVzLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwiZG9uJ3QgY2FsbCBwb2xsIGJlZm9yZSBjb25uZWN0LihEaXNjb25uZWN0ZWQpXCIsIG51bGwsIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDMwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhhdC5zdGF0dXMgPT0gU3RhdHVzLlBvbGwpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcImRvbid0IGNhbGwgcG9sbCBtYW55IHRpbWVzLihQb2xsKVwiLCBudWxsLCBMb2dnaW5nVHlwZS5XYXJuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA1MDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5zdGF0dXMgPSBTdGF0dXMuUG9sbDtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb2xsRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIFwic2VuZGVyXCI6IHRoYXQuc2VuZGVyLFxyXG4gICAgICAgICAgICAgICAgXCJjb21tYW5kc1wiOiB0aGF0LmNvbW1hbmRzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBjb21wbGV0ZUZuID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCEoaWdub3JlQ29tcGxldGVGbiAmJiBpZ25vcmVDb21wbGV0ZUZuID09IHRydWUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZUZuID0gKCkgPT4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRoYXQucG9sbChzdWNjZXNzLCBlcnJvcik7IH0sIHRoYXQuY29tcGxldGVUaW1lb3V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0Ll9hamF4KHBvbGxEYXRhLCBzdWNjZXNzLCBlcnJvciwgY29tcGxldGVGbik7XHJcbiAgICAgICAgICAgIHJldHVybiAyMDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW52b2tlKGNtZDogc3RyaW5nLCBkYXRhOiBhbnksIHN1Y2Nlc3M/OiBGdW5jdGlvbiwgZXJyb3I/OiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGF0LnN0YXR1cyA9PSBTdGF0dXMuTm9uZSkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwiZG9uJ3QgY2FsbCBpbnZva2UgYmVmb3JlIGNvbm5lY3QuKE5vbmUpXCIsIG51bGwsIExvZ2dpbmdUeXBlLkVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA0MDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoYXQuc3RhdHVzID09IFN0YXR1cy5EaXNjb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcImRvbid0IGNhbGwgaW52b2tlIGJlZm9yZSBjb25uZWN0LihEaXNjb25uZWN0ZWQpXCIsIG51bGwsIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDMwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0Ll9sb2coXCJpbnZva2UgXCIgKyBjbWQsIGRhdGEsIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICB2YXIgaW52b2tlRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIFwic2VuZGVyXCI6IHRoYXQuc2VuZGVyLFxyXG4gICAgICAgICAgICAgICAgXCJjb21tYW5kc1wiOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBjbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IGRhdGFcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoYXQuX2FqYXgoaW52b2tlRGF0YSwgc3VjY2VzcywgZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4gMjAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYWpheChhamF4RGF0YTogYW55LCBzdWNjZXNzPzogRnVuY3Rpb24sIGVycm9yPzogRnVuY3Rpb24sIGNvbXBsZXRlRm4/OiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGF0Ll9sb2coXCJfYWpheFwiLCBhamF4RGF0YSwgTG9nZ2luZ1R5cGUuSW5mbyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2xvbmVkT2JqOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleDogdGhhdC4kaW5kZXgrKyxcclxuICAgICAgICAgICAgICAgIHNlbmRlcjogYWpheERhdGEuc2VuZGVyLFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtdXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYWpheERhdGEuY29tbWFuZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gYWpheERhdGEuY29tbWFuZHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFtcImNvdW50ZXJcIl0gJiYgKC0tZWxlbWVudC5jb3VudGVyKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWpheERhdGEuY29tbWFuZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50W1wiZWFjaFwiXSB8fCAoZWxlbWVudFtcImVhY2hcIl0gJiYgKHRoYXQuJGluZGV4ICUgZWxlbWVudC5lYWNoKSA9PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5wYXJhbWV0ZXJzID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZE9iai5jb21tYW5kcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBlbGVtZW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtZXRlcnNcIjogKGVsZW1lbnQucGFyYW1ldGVycygpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBlbGVtZW50LnN1Y2Nlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IGVsZW1lbnQuZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVkT2JqLmNvbW1hbmRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGVsZW1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiBlbGVtZW50LnBhcmFtZXRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZWxlbWVudC5zdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBlbGVtZW50LmVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoYXQuJHJlcXVlc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC4kcmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgdGhhdC4kcmVxdWVzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoYXQuJHJlcXVlc3QgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGF0LnNlcnZlcnBhdGgsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjbG9uZWRPYmosXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGF0LmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aGF0LnRpbWVvdXQsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGVGbixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fc3VjY2Vzcyh0aGF0LCBkYXRhLCBzdWNjZXNzKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9lcnJvcih0aGF0LCB4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc3VjY2Vzcyh0aGF0OiBDb21tYW5kUUwsIGRhdGEsIHN1Y2Nlc3M6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vVXBkYXRlXHJcbiAgICAgICAgICAgIHRoYXQuX2xvZyhcIl9zdWNjZXNzIFwiICsgKGRhdGEudCkgKyBcIm1zXCIsIGRhdGEsIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5jb21tYW5kcywgZnVuY3Rpb24gKGluZGV4LCBjbWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLmVycm9ycyAmJiBjbWQuZXJyb3JzLmxlbmd0aCA+IDApIHsvL2NoZWNrIGlmIGVycm9yc1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChjbWQuZXJyb3JzLCBmdW5jdGlvbiAoaW5kZXgsIGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9sb2coXCJjYWxsIFwiICsgY21kLm5hbWUgKyBcIiByZXR1cm5zIHdpdGggZXJyb3IgXCIgKyBlcnIsIG51bGwsIExvZ2dpbmdUeXBlLldhcm4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vd2l0aG91dCBlcnJvcnMgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbWQucmV0dXJuICYmIGNtZC5yZXR1cm4ucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGNtZC5yZXR1cm4ucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoY21kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbkhhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluZGVkQ29tbWFuZCA9IHRoYXQuX2ZpbmQodGhhdC5jb21tYW5kcywgXCJuYW1lXCIsIGNtZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmRlZENvbW1hbmQgJiYgZmluZGVkQ29tbWFuZC5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkhhbmRsZXIgPSBmaW5kZWRDb21tYW5kLnN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkhhbmRsZXIgPSB0aGF0LmhhbmRsZXJbY21kLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZm5IYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9sb2coXCJjYWxsIFwiICsgY21kLm5hbWUsIGNtZC5yZXR1cm4sIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mbkhhbmRsZXIoY21kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY21kLnJldHVybiAmJiBjbWQucmV0dXJuLnJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuSGFuZGxlcihjbWQucmV0dXJuLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkhhbmRsZXIoY21kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9sb2coXCJmdW5jdGlvbiBcIiArIGNtZC5uYW1lICsgXCIgbm90IGZvdW5kXCIsIG51bGwsIExvZ2dpbmdUeXBlLldhcm4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZm5PbkNvbXBsZXRlID0gdGhhdC5oYW5kbGVyW1wib25Db21wbGV0ZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuT25Db21wbGV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ZuT25Db21wbGV0ZShjbWQucmV0dXJuLCBjbWQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbWQucmV0dXJuICYmIGNtZC5yZXR1cm4ucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll9sb2coXCJjYWxsIG9uQ29tcGxldGUoZGF0YSxcIiArIGNtZC5uYW1lICsgXCIpXCIsIGNtZC5yZXR1cm4ucmVzdWx0LCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuT25Db21wbGV0ZShjbWQucmV0dXJuLnJlc3VsdCwgY21kLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwiY2FsbCBvbkNvbXBsZXRlKGRhdGEsXCIgKyBjbWQubmFtZSArIFwiKVwiLCBjbWQucmV0dXJuLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuT25Db21wbGV0ZShjbWQucmV0dXJuLCBjbWQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZXJyb3IodGhhdDogQ29tbWFuZFFMLCB4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duLCBlcnJvcjogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhhdC5fbG9nKFwiX2Vycm9yIFwiICsgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24sIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZm5PbkVycm9yID0gdGhhdC5oYW5kbGVyW1wib25FcnJvclwiXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbk9uRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX2xvZyhcImNhbGwgb25FcnJvci1cIiArIHRleHRTdGF0dXMsIGVycm9yVGhyb3duLCBMb2dnaW5nVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgICAgIGZuT25FcnJvcih4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfbG9nKG1zZzogc3RyaW5nLCBvYmo/OiBhbnksIGxvZ2dpbmdUeXBlPzogTG9nZ2luZ1R5cGUpIHtcclxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoIWxvZ2dpbmdUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnaW5nVHlwZSA9IHRoYXQubG9nZ2luZ1R5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxvZ2dpbmdUeXBlID09IExvZ2dpbmdUeXBlLkluZm8gJiYgdGhhdC5sb2dnaW5nVHlwZSAhPSBMb2dnaW5nVHlwZS5Ob25lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8obXNnKTsgLy8sIG9iaiB8fCB7fVxyXG4gICAgICAgICAgICAgICAgaWYgKG9iaiAmJiAoPGFueT5jb25zb2xlKS50YWJsZSAmJiB0aGF0LmxvZ2dpbmdUeXBlID09IExvZ2dpbmdUeXBlLkRlYnVnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+Y29uc29sZSkudGFibGUob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobG9nZ2luZ1R5cGUgPT0gTG9nZ2luZ1R5cGUuRGVidWcgJiYgdGhhdC5sb2dnaW5nVHlwZSAhPSBMb2dnaW5nVHlwZS5Ob25lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKG1zZyk7Ly8sIG9iaiB8fCB7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb2dnaW5nVHlwZSA9PSBMb2dnaW5nVHlwZS5FcnJvciAmJiB0aGF0LmxvZ2dpbmdUeXBlICE9IExvZ2dpbmdUeXBlLk5vbmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTsgLy8sIG9iaiB8fCB7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsb2dnaW5nVHlwZSA9PSBMb2dnaW5nVHlwZS5XYXJuICYmIHRoYXQubG9nZ2luZ1R5cGUgIT0gTG9nZ2luZ1R5cGUuTm9uZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZyk7IC8vLCBvYmogfHwge31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZmluZChvYmo6IGFueSwgbmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmpbaV1bbmFtZV0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpbaV07IC8vIFJldHVybiBhcyBzb29uIGFzIHRoZSBvYmplY3QgaXMgZm91bmRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gVGhlIG9iamVjdCB3YXMgbm90IGZvdW5kXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgbmV3R3VpZCgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwgdiA9IGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgfVxyXG59Il19

"use strict";
beforeEach(function () {
    //Init vars here
});
"use strict";
describe("Main", function () {
    it("test", function () {
        expect(function () {
            throw new Error("test");
        }).toThrow();
        expect("1").toBe("1");
    });
});
