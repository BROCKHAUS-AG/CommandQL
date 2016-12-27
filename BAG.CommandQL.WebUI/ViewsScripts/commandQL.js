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
        function CommandQL(handler, serverpath) {
            this.commands = Array();
            this.timeout = 30000;
            this.completeTimeout = 5000;
            this.sender = "frontend";
            this.status = Status.None;
            this.serverpath = serverpath;
            this.handler = handler;
            if (!this.serverpath) {
                this.serverpath = window.location.origin + "/api/commandQL/";
            }
            if (!this.handler) {
                this.handler = window;
            }
        }
        CommandQL.prototype.invoke = function (cmd, data) {
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
        };
        CommandQL.prototype.subscribe = function (cmd, data) {
            console.log("subscribe " + cmd);
            this.commands.push({
                "name": cmd,
                "parameters": data,
                "return": null
            });
        };
        CommandQL.prototype.publish = function (cmd, data) {
            console.log("publish " + cmd);
            //todo:
        };
        CommandQL.prototype.unsubscribe = function (cmd) {
            return "unsubscribe " + cmd;
        };
        CommandQL.prototype.connect = function () {
            this.status = Status.Connected;
            return "connect";
        };
        CommandQL.prototype.disconnect = function () {
            this.status = Status.Disconnected;
            return "disconnect";
        };
        CommandQL.prototype.pull = function () {
            var _this = this;
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
            var completeFunction = function () { return setTimeout(function () { this.pull(); }, _this.completeTimeout); };
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
        };
        return CommandQL;
    })();
    BAG.CommandQL = CommandQL;
})(BAG || (BAG = {}));
//# sourceMappingURL=commandQL.js.map