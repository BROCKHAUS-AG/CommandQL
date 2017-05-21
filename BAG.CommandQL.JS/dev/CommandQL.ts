namespace BROCKHAUSAG {

    export class CommandQL {
        private settings: Entities.ICommandQLConfiguration = {
            handler: window,
            sender: "cmdQL.sender",
            timeout: 30000,
            completeTimeout: 5000,
            token: "",
            headers: null,
            loggingType: LoggingType.None,
            serverpath: window.location.origin ?
                window.location.origin + "/commandQL/" :
                window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/commandQL/"
        };

        public $request: any;
        public $index: number = 0;

        constructor(_settings: Entities.ICommandQLConfiguration) {
            if (_settings.completeTimeout) {
                this.settings.completeTimeout = _settings.completeTimeout;
            }
            if (_settings.timeout) {
                this.settings.timeout = _settings.timeout;
            }
            if (_settings.serverpath) {
                this.settings.serverpath = _settings.serverpath;
            }
            if (_settings.handler) {
                this.settings.handler = _settings.handler;
            }
            if (_settings.token) {
                this.settings.token = _settings.token;
            }
            if (_settings.sender) {
                this.settings.sender = _settings.sender;
            }
            if (_settings.headers) {
                this.settings.headers = _settings.headers;
            } else {
                this.settings.headers = {
                    "Authorization": "Token " + this.settings.token
                };
            }
            if (_settings.loggingType) {
                this.settings.loggingType = _settings.loggingType;
            }
            if (_settings.useHttp) {
                this.settings.useHttp = _settings.useHttp;
            }

            if (this.settings.loggingType) {
                Logger.loggingType = this.settings.loggingType;
            }

            TransportManager.config(this.settings);
        }

        /* Subscriptions */
        public subscribe(topic: string, data: any, success?: (data: any) => void, error?: (error: any) => void) {
            let subscription: Entities.CommandQLTopicSubscription = {
                topic: topic,
                parameters: data,
                success: success,
                error: error,
                id: Helper.GenerateGuid()
            };

            SubscriptionManager.makeSubscription(subscription);

            return this;
        }

        public subscribeCommand(cmd: string, data: any, success?: (data: any) => void, error?: (error: any) => void) {
            let subscription: Entities.CommandQLCommand = {
                name: cmd,
                parameters: data,
                success: success,
                error: error,
                id: Helper.GenerateGuid()
            };
            SubscriptionManager.makeCommandSubscription(subscription);

            /*if (data.length > 0 && data[0]["counter"] && data[0]["counter"] > 0) {
                command["counter"] = data[0]["counter"];
            }
            if (data.length > 0 && data[0]["each"] && data[0]["each"] > 1) {
                command["each"] = data[0]["each"];
            }*/
            return this;
        }

        public unsubscribe(topic: string, data?: any, id?: string) {
            SubscriptionManager.removeSubscription(topic, data, id);
            return this;
        }

        public unsubscribeCommand(cmd: string, data?: any, id?: string) {
            SubscriptionManager.removeCommandSubscription(cmd, data, id);
            return this;
        }

        public unsubscribeAll() {
            SubscriptionManager.removeAllSubscriptions();
            return this;
        }

        public unsubscribeAllCommands() {
            SubscriptionManager.removeAllCommandSubscriptions();
            return this;
        }

        /*public publish(cmd: string, data: any, success?: Function, error?: Function) {
            Logger.Log("publish " + cmd, data, MessageType.Info);
            return this.invoke(cmd, data, success, error);
        }*/

        public invoke(cmd: string, data: any, success?: (data: any) => void, error?: (error: any) => void): void {
            Logger.Log("invoke " + cmd, data, MessageType.Info);
            TransportManager.invoke(cmd, data, success, error);
        }

        public begin() {
            TransportManager.begin();
        }

        public end() {
            TransportManager.end();
        }

        /*public poll(success?: Function, error?: Function, ignoreCompleteFn?: boolean) {
            let that = this;
            if (this.status === ConnectionStatus.None) {
                this.logger.Log("don't call poll before connect.(None)", null, MessageType.Error);
                return 400;
            }
            if (this.status === ConnectionStatus.Disconnected) {
                this.logger.Log("don't call poll before connect.(Disconnected)", null, MessageType.Info);
                return 300;
            }
            if (this.status === ConnectionStatus.Poll) {
                this.logger.Log("don't call poll many times.(Poll)", null, MessageType.Warning);
                return 500;
            }
            that.status = ConnectionStatus.Poll;

            let pollData = {
                "sender": that.sender,
                "commands": that.commands
            };
            let completeFn = null;
            if (!(ignoreCompleteFn && ignoreCompleteFn === true)) {
                completeFn = () => setTimeout(function () { that.poll(success, error); }, that.completeTimeout);
            }
            that._ajax(pollData, success, error, completeFn);
            return 200;
        }*/

        /*private _ajax(ajaxData: any, success?: Function, error?: Function, completeFn?: any) {
            let that = this;
            this.logger.Log("_ajax", ajaxData, MessageType.Info);

            let clonedObj: any = {
                index: that.$index++,
                sender: ajaxData.sender,
                commands: []
            };

            for (let i = ajaxData.commands.length - 1; i >= 0; i--) {
                let element = ajaxData.commands[i];
                if (element["counter"] && (--element.counter) === 0) {
                    ajaxData.commands.splice(i, 1);
                    continue;
                }
                if (!element["each"] || (element["each"] && (that.$index % element.each) === 0)) {
                    if (typeof element.parameters === "function") {
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
                type: "POST",
                dataType: "json",
                data: JSON.stringify(clonedObj),
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
        }*/

        /*private _success(that: CommandQL, data, success: Function) {
            //Update
            this.logger.Log("_success " + (data.t) + "ms", data, MessageType.Info);
            $.each(data.commands, function (index, cmd) {

                if (cmd.errors && cmd.errors.length > 0) {//check if errors
                    $.each(cmd.errors, function (indextwo, err) {
                        that.logger.Log("call " + cmd.name + " returns with error " + err, null, MessageType.Warning);
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
                        if (typeof fnHandler === "function") {
                            that.logger.Log("call " + cmd.name, cmd.return, MessageType.Info);
                            //fnHandler(cmd.return);
                            if (cmd.return && cmd.return.result) {
                                fnHandler(cmd.return.result);
                            }
                            else {
                                fnHandler(cmd.return);
                            }
                        } else {
                            that.logger.Log("function " + cmd.name + " not found", null, MessageType.Warning);
                        }
                    }

                    let fnOnComplete = that.handler["onComplete"];
                    if (typeof fnOnComplete === "function") {
                        //fnOnComplete(cmd.return, cmd.name);
                        if (cmd.return && cmd.return.result) {
                            that.logger.Log("call onComplete(data," + cmd.name + ")", cmd.return.result, MessageType.Info);
                            fnOnComplete(cmd.return.result, cmd.name);
                        }
                        else {
                            that.logger.Log("call onComplete(data," + cmd.name + ")", cmd.return, MessageType.Info);
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
        }*/
    }
}