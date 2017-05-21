"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var CommandQL = (function () {
        function CommandQL(_settings) {
            this.settings = {
                handler: window,
                sender: "cmdQL.sender",
                timeout: 30000,
                completeTimeout: 5000,
                token: "",
                headers: null,
                loggingType: BROCKHAUSAG.LoggingType.None,
                serverpath: window.location.origin ?
                    window.location.origin + "/commandQL/" :
                    window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + "/commandQL/"
            };
            this.$index = 0;
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
            }
            else {
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
                BROCKHAUSAG.Logger.loggingType = this.settings.loggingType;
            }
            BROCKHAUSAG.TransportManager.config(this.settings);
        }
        /* Subscriptions */
        CommandQL.prototype.subscribe = function (topic, data, success, error) {
            var subscription = {
                topic: topic,
                parameters: data,
                success: success,
                error: error,
                id: BROCKHAUSAG.Helper.GenerateGuid()
            };
            BROCKHAUSAG.SubscriptionManager.makeSubscription(subscription);
            return this;
        };
        CommandQL.prototype.subscribeCommand = function (cmd, data, success, error) {
            var subscription = {
                name: cmd,
                parameters: data,
                success: success,
                error: error,
                id: BROCKHAUSAG.Helper.GenerateGuid()
            };
            BROCKHAUSAG.SubscriptionManager.makeCommandSubscription(subscription);
            /*if (data.length > 0 && data[0]["counter"] && data[0]["counter"] > 0) {
                command["counter"] = data[0]["counter"];
            }
            if (data.length > 0 && data[0]["each"] && data[0]["each"] > 1) {
                command["each"] = data[0]["each"];
            }*/
            return this;
        };
        CommandQL.prototype.unsubscribe = function (topic, data, id) {
            BROCKHAUSAG.SubscriptionManager.removeSubscription(topic, data, id);
            return this;
        };
        CommandQL.prototype.unsubscribeCommand = function (cmd, data, id) {
            BROCKHAUSAG.SubscriptionManager.removeCommandSubscription(cmd, data, id);
            return this;
        };
        CommandQL.prototype.unsubscribeAll = function () {
            BROCKHAUSAG.SubscriptionManager.removeAllSubscriptions();
            return this;
        };
        CommandQL.prototype.unsubscribeAllCommands = function () {
            BROCKHAUSAG.SubscriptionManager.removeAllCommandSubscriptions();
            return this;
        };
        /*public publish(cmd: string, data: any, success?: Function, error?: Function) {
            Logger.Log("publish " + cmd, data, MessageType.Info);
            return this.invoke(cmd, data, success, error);
        }*/
        CommandQL.prototype.invoke = function (cmd, data, success, error) {
            BROCKHAUSAG.Logger.Log("invoke " + cmd, data, BROCKHAUSAG.MessageType.Info);
            BROCKHAUSAG.TransportManager.invoke(cmd, data, success, error);
        };
        CommandQL.prototype.begin = function () {
            BROCKHAUSAG.TransportManager.begin();
        };
        CommandQL.prototype.end = function () {
            BROCKHAUSAG.TransportManager.end();
        };
        return CommandQL;
    }());
    BROCKHAUSAG.CommandQL = CommandQL;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.GenerateGuid = function () {
            var result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0;
                var v = c === "x" ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            return result;
        };
        Helper.Find = function (array, property, value, remove) {
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                if (obj[property] === value) {
                    if (remove === true) {
                        array.splice(i, 1);
                    }
                    return obj;
                }
            }
            return null;
        };
        return Helper;
    }());
    BROCKHAUSAG.Helper = Helper;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["None"] = 0] = "None";
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Disconnected"] = 2] = "Disconnected";
        ConnectionStatus[ConnectionStatus["Poll"] = 3] = "Poll";
    })(ConnectionStatus = BROCKHAUSAG.ConnectionStatus || (BROCKHAUSAG.ConnectionStatus = {}));
    var HttpHelper = (function () {
        function HttpHelper() {
        }
        HttpHelper.prototype.makeRequest = function () {
            return;
        };
        return HttpHelper;
    }());
    BROCKHAUSAG.HttpHelper = HttpHelper;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var LoggingType;
    (function (LoggingType) {
        LoggingType[LoggingType["None"] = 0] = "None";
        LoggingType[LoggingType["All"] = 1] = "All";
        LoggingType[LoggingType["Info"] = 2] = "Info";
        LoggingType[LoggingType["Warning"] = 3] = "Warning";
        LoggingType[LoggingType["Error"] = 4] = "Error";
        LoggingType[LoggingType["Debug"] = 5] = "Debug";
    })(LoggingType = BROCKHAUSAG.LoggingType || (BROCKHAUSAG.LoggingType = {}));
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["Info"] = 0] = "Info";
        MessageType[MessageType["Warning"] = 1] = "Warning";
        MessageType[MessageType["Error"] = 2] = "Error";
        MessageType[MessageType["Debug"] = 3] = "Debug";
    })(MessageType = BROCKHAUSAG.MessageType || (BROCKHAUSAG.MessageType = {}));
    var Logger = (function () {
        function Logger() {
        }
        Logger.Log = function (message, object, messageType) {
            if (this.loggingType === LoggingType.None) {
                return;
            }
            switch (messageType) {
                case MessageType.Info:
                    console.info(message);
                    if (object && console.table && this.loggingType === LoggingType.Debug) {
                        console.table(object);
                    }
                    break;
                case MessageType.Warning:
                    if (this.loggingType !== LoggingType.Info) {
                        console.warn(message);
                    }
                    break;
                case MessageType.Error:
                    if (this.loggingType !== LoggingType.Info && this.loggingType !== LoggingType.Warning) {
                        console.error(message);
                    }
                    break;
                case MessageType.Debug:
                    if (this.loggingType === LoggingType.Debug) {
                        console.debug(message);
                    }
                    break;
                default:
                    break;
            }
        };
        return Logger;
    }());
    Logger.loggingType = LoggingType.None;
    BROCKHAUSAG.Logger = Logger;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var SubscriptionManager = (function () {
        function SubscriptionManager() {
        }
        SubscriptionManager.makeSubscription = function (subscription) {
            BROCKHAUSAG.Logger.Log("subscribe topic " + subscription.topic, subscription.parameters, BROCKHAUSAG.MessageType.Info);
            if (BROCKHAUSAG.TransportManager.serverHandlesTopicSubscriptions()) {
                BROCKHAUSAG.TransportManager.serverAddSubscription(subscription);
            }
            this.topicSubscriptions.push(subscription);
        };
        SubscriptionManager.makeCommandSubscription = function (subscription) {
            BROCKHAUSAG.Logger.Log("subscribe command " + subscription.name, subscription.parameters, BROCKHAUSAG.MessageType.Info);
            this.subscriptions.push(subscription);
        };
        SubscriptionManager.removeSubscription = function (topic, data, id) {
            BROCKHAUSAG.Logger.Log("unsubscribe topic " + topic, id, BROCKHAUSAG.MessageType.Info);
            var subscriptionObject;
            for (var i = 0; i < this.topicSubscriptions.length; i--) {
                if (this.topicSubscriptions[i].topic === topic && (!id || this.topicSubscriptions[i].id === id) && (!data || data === this.topicSubscriptions[i].parameters)) {
                    subscriptionObject = this.topicSubscriptions[i];
                    this.topicSubscriptions.splice(i, 1);
                    BROCKHAUSAG.Logger.Log("unsubscribed topic " + topic, id, BROCKHAUSAG.MessageType.Info);
                }
            }
            if (BROCKHAUSAG.TransportManager.serverHandlesTopicSubscriptions() && subscriptionObject) {
                BROCKHAUSAG.TransportManager.serverRemoveSubscription(subscriptionObject);
            }
        };
        SubscriptionManager.removeCommandSubscription = function (command, data, id) {
            BROCKHAUSAG.Logger.Log("unsubscribe command " + command, id, BROCKHAUSAG.MessageType.Info);
            var subscriptionObject;
            for (var i = 0; i < this.subscriptions.length; i--) {
                if (this.subscriptions[i].name === command && (!id || this.subscriptions[i].id === id) && (!data || data === this.subscriptions[i].parameters)) {
                    subscriptionObject = this.subscriptions[i];
                    this.subscriptions.splice(i, 1);
                    BROCKHAUSAG.Logger.Log("unsubscribed command " + command, id, BROCKHAUSAG.MessageType.Info);
                }
            }
        };
        SubscriptionManager.removeAllSubscriptions = function () {
            BROCKHAUSAG.Logger.Log("unsubscribeAll", null, BROCKHAUSAG.MessageType.Info);
            this.topicSubscriptions = [];
            if (BROCKHAUSAG.TransportManager.serverHandlesTopicSubscriptions()) {
                BROCKHAUSAG.TransportManager.serverRemoveAllSubscriptions();
            }
        };
        SubscriptionManager.removeAllCommandSubscriptions = function () {
            BROCKHAUSAG.Logger.Log("unsubscribeAll commands", null, BROCKHAUSAG.MessageType.Info);
            this.subscriptions = [];
        };
        return SubscriptionManager;
    }());
    SubscriptionManager.subscriptions = [];
    SubscriptionManager.topicSubscriptions = [];
    BROCKHAUSAG.SubscriptionManager = SubscriptionManager;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var TransportManager = (function () {
        function TransportManager() {
        }
        TransportManager.config = function (settings) {
            this.settings = settings;
            if ("WebSocket" in window && settings.useHttp !== true) {
                this.currentTransport = new BROCKHAUSAG.Transport.WebSocketTransport(this.settings);
            }
            else {
                this.currentTransport = new BROCKHAUSAG.Transport.HttpTransport(this.settings);
            }
        };
        TransportManager.serverHandlesTopicSubscriptions = function () {
            return this.currentTransport.name === "socket";
        };
        TransportManager.serverAddSubscription = function (subscription) {
            this.currentTransport.addSubscription(subscription);
        };
        TransportManager.serverRemoveSubscription = function (subscription) {
            this.currentTransport.removeSubscription(subscription);
        };
        TransportManager.serverRemoveAllSubscriptions = function () {
            this.currentTransport.resetSubscriptions();
        };
        TransportManager.invoke = function (command, data, success, error) {
            var invokeData = {
                sender: this.settings.sender,
                commands: [{
                        name: command,
                        parameters: data,
                        id: BROCKHAUSAG.Helper.GenerateGuid()
                    }]
            };
            this.currentTransport.sendData({
                data: invokeData,
                success: success,
                error: error,
                id: BROCKHAUSAG.Helper.GenerateGuid()
            });
        };
        TransportManager.begin = function () {
            this.poll();
            if (!this.serverHandlesTopicSubscriptions()) {
                this.getTopicUpdates();
            }
        };
        TransportManager.end = function () {
            this.breakPoll = true;
            this.breakTopicUpdates = true;
        };
        TransportManager.poll = function () {
            if (this.breakPoll === true) {
                this.breakPoll = false;
                return;
            }
            var commands = [];
            for (var _i = 0, _a = BROCKHAUSAG.SubscriptionManager.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                if (typeof subscription.parameters === "function") {
                    var pollObj = {
                        error: subscription.error,
                        success: subscription.success,
                        id: subscription.id,
                        name: subscription.name,
                        parameters: subscription.parameters()
                    };
                    commands.push(pollObj);
                }
                else {
                    commands.push(subscription);
                }
            }
            var pollData = {
                commands: commands,
                sender: this.settings.sender
            };
            this.createPollRequest(pollData);
        };
        TransportManager.createPollRequest = function (data) {
            this.currentTransport.sendData({
                data: data,
                complete: this.pollCompleteHandler,
                success: this.pollSuccessHandler,
                error: this.pollErrorHandler,
                id: BROCKHAUSAG.Helper.GenerateGuid()
            });
        };
        TransportManager.getTopicUpdates = function () {
            if (this.breakTopicUpdates === true) {
                this.breakTopicUpdates = false;
                return;
            }
            if (BROCKHAUSAG.SubscriptionManager.topicSubscriptions.length > 0) {
                this.currentTransport.sendData({
                    data: {
                        topics: BROCKHAUSAG.SubscriptionManager.topicSubscriptions,
                        sender: this.settings.sender
                    },
                    complete: this.topicCompleteHandler,
                    error: this.topicErrorHandler,
                    success: this.topicSuccessHandler,
                    id: BROCKHAUSAG.Helper.GenerateGuid()
                });
            }
        };
        TransportManager.topicSuccessHandler = function (data) {
            return;
        };
        TransportManager.topicErrorHandler = function (error) {
            return;
        };
        TransportManager.topicCompleteHandler = function () {
            setTimeout(function () {
                TransportManager.getTopicUpdates();
            }, TransportManager.settings.completeTimeout);
        };
        TransportManager.pollSuccessHandler = function (data) {
            BROCKHAUSAG.Logger.Log("_success " + (data.t) + "ms", data, BROCKHAUSAG.MessageType.Info);
            for (var _i = 0, _a = data.commands; _i < _a.length; _i++) {
                var command = _a[_i];
                if (command.errors && command.errors.length > 0) {
                    for (var _b = 0, _c = command.errors; _b < _c.length; _b++) {
                        var error = _c[_b];
                        BROCKHAUSAG.Logger.Log("call " + command.name + " returns with error " + error, null, BROCKHAUSAG.MessageType.Warning);
                    }
                }
                else {
                    var fnHandler = null;
                    var foundSubscription = BROCKHAUSAG.Helper.Find(BROCKHAUSAG.SubscriptionManager.subscriptions, "id", command.id);
                    if (foundSubscription && foundSubscription.success) {
                        fnHandler = foundSubscription.success;
                    }
                    else {
                        fnHandler = TransportManager.settings.handler[command.name];
                    }
                    if (typeof fnHandler === "function") {
                        BROCKHAUSAG.Logger.Log("call " + command.name, command.return, BROCKHAUSAG.MessageType.Info);
                        if (command.return && command.return.result) {
                            fnHandler(command.return.result);
                        }
                        else {
                            fnHandler(command.return);
                        }
                    }
                    else {
                        BROCKHAUSAG.Logger.Log("function " + command.name + " not found", null, BROCKHAUSAG.MessageType.Warning);
                    }
                }
            }
        };
        TransportManager.pollErrorHandler = function (error) {
            BROCKHAUSAG.Logger.Log("_error ", error, BROCKHAUSAG.MessageType.Error);
        };
        TransportManager.pollCompleteHandler = function () {
            setTimeout(function () {
                TransportManager.poll();
            }, TransportManager.settings.completeTimeout);
        };
        return TransportManager;
    }());
    TransportManager.breakPoll = false;
    TransportManager.breakTopicUpdates = false;
    BROCKHAUSAG.TransportManager = TransportManager;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var CommandQLCommand = (function () {
            function CommandQLCommand() {
            }
            return CommandQLCommand;
        }());
        Entities.CommandQLCommand = CommandQLCommand;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var CommandQLRequest = (function () {
            function CommandQLRequest() {
            }
            return CommandQLRequest;
        }());
        Entities.CommandQLRequest = CommandQLRequest;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var CommandQLResponse = (function () {
            function CommandQLResponse() {
            }
            return CommandQLResponse;
        }());
        Entities.CommandQLResponse = CommandQLResponse;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var CommandQLTopicSubscription = (function () {
            function CommandQLTopicSubscription() {
            }
            return CommandQLTopicSubscription;
        }());
        Entities.CommandQLTopicSubscription = CommandQLTopicSubscription;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var ResponseDataObject = (function () {
            function ResponseDataObject() {
            }
            return ResponseDataObject;
        }());
        Entities.ResponseDataObject = ResponseDataObject;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var SendDataObject = (function () {
            function SendDataObject() {
            }
            return SendDataObject;
        }());
        Entities.SendDataObject = SendDataObject;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Entities;
    (function (Entities) {
        var WebSocketMessage = (function () {
            function WebSocketMessage() {
            }
            return WebSocketMessage;
        }());
        Entities.WebSocketMessage = WebSocketMessage;
    })(Entities = BROCKHAUSAG.Entities || (BROCKHAUSAG.Entities = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Transport;
    (function (Transport) {
        var HttpTransport = (function () {
            function HttpTransport(settings) {
                this.settings = settings;
                this.name = "http";
            }
            HttpTransport.prototype.makeRequest = function (sendData) {
                var http = new XMLHttpRequest();
                http.open("POST", this.settings.serverpath, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                if (this.settings.timeout) {
                    http.timeout = this.settings.timeout;
                }
                if (this.settings.headers) {
                    for (var key in Object.keys(this.settings.headers)) {
                        http.setRequestHeader(key, this.settings.headers[key]);
                    }
                }
                http.onreadystatechange = function () {
                    if (http.readyState === 4) {
                        if (http.status === 200) {
                            if (sendData.success) {
                                var response = void 0;
                                try {
                                    response = JSON.parse(http.responseText);
                                }
                                catch (ex) {
                                    response = http.responseText;
                                }
                                sendData.success(response);
                            }
                        }
                        else {
                            if (sendData.error) {
                                sendData.error("Http error: " + http.status);
                            }
                        }
                        if (sendData.complete) {
                            sendData.complete();
                        }
                    }
                };
                http.send(JSON.stringify(sendData.data));
            };
            HttpTransport.prototype.getStatus = function () {
                return Transport.TransportStatus.Ready;
            };
            HttpTransport.prototype.sendData = function (sendData) {
                this.makeRequest(sendData);
                return;
            };
            return HttpTransport;
        }());
        Transport.HttpTransport = HttpTransport;
    })(Transport = BROCKHAUSAG.Transport || (BROCKHAUSAG.Transport = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Transport;
    (function (Transport) {
        var TransportStatus;
        (function (TransportStatus) {
            TransportStatus[TransportStatus["None"] = 0] = "None";
            TransportStatus[TransportStatus["Ready"] = 1] = "Ready";
            TransportStatus[TransportStatus["InUse"] = 2] = "InUse";
            TransportStatus[TransportStatus["Disconnected"] = 3] = "Disconnected";
            TransportStatus[TransportStatus["Error"] = 4] = "Error";
            TransportStatus[TransportStatus["Connecting"] = 5] = "Connecting";
        })(TransportStatus = Transport.TransportStatus || (Transport.TransportStatus = {}));
    })(Transport = BROCKHAUSAG.Transport || (BROCKHAUSAG.Transport = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
"use strict";
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var Transport;
    (function (Transport) {
        var WebSocketTransport = (function () {
            function WebSocketTransport(settings) {
                this.settings = settings;
                this.name = "socket";
                this.notSendStack = [];
                this.sendStack = [];
                var that = this;
                this.url = this.settings.serverpath.indexOf("https") !== -1 ? "wss" + this.settings.serverpath.replace("https", "") : "ws" + this.settings.serverpath.replace("http", "");
                this.socket = new WebSocket(this.url);
                this.socket.onclose = function () {
                    setTimeout(function () {
                        var onopenHandler = that.socket.onopen;
                        var oncloseHandler = that.socket.onclose;
                        var onmessageHandler = that.socket.onmessage;
                        that.socket = new WebSocket(that.url);
                        that.socket.onopen = onopenHandler;
                        that.socket.onclose = oncloseHandler;
                        that.socket.onmessage = onmessageHandler;
                    }, 1000);
                };
                this.socket.onopen = function () {
                    if (BROCKHAUSAG.SubscriptionManager.subscriptions.length > 0) {
                        var data = {
                            type: "subscribeMany",
                            data: BROCKHAUSAG.SubscriptionManager.topicSubscriptions
                        };
                        that.socket.send(JSON.stringify(data));
                    }
                    if (that.notSendStack.length > 0) {
                        for (var i = 0; i < that.notSendStack.length; i++) {
                            var obj = that.notSendStack[i];
                            that.notSendStack.splice(i, 1);
                            that.sendData(obj);
                        }
                    }
                };
                this.socket.onmessage = function (ev) {
                    var data = JSON.parse(ev.data);
                    if (data.type === "executeResult") {
                        var result = data.data;
                        var sendObject = BROCKHAUSAG.Helper.Find(that.sendStack, "id", result.id, true);
                        if (sendObject) {
                            if (sendObject.success) {
                                sendObject.success(result.data);
                            }
                            if (sendObject.complete) {
                                sendObject.complete();
                            }
                        }
                    }
                    else if (data.type === "subscribeResult") {
                        return;
                    }
                };
            }
            WebSocketTransport.prototype.addSubscription = function (subscription) {
                if (this.socket.readyState === 1) {
                    var data = {
                        type: "subscribe",
                        data: subscription
                    };
                    this.socket.send(JSON.stringify(data));
                }
            };
            WebSocketTransport.prototype.removeSubscription = function (subscription) {
                if (this.socket.readyState === 1) {
                    var data = {
                        type: "unsubscribe",
                        data: subscription
                    };
                    this.socket.send(JSON.stringify(data));
                }
            };
            WebSocketTransport.prototype.resetSubscriptions = function () {
                if (this.socket.readyState === 1) {
                    var data = {
                        type: "reset"
                    };
                    this.socket.send(JSON.stringify(data));
                }
            };
            WebSocketTransport.prototype.getStatus = function () {
                if (this.socket.readyState === 1) {
                    return Transport.TransportStatus.Ready;
                }
                else {
                    return Transport.TransportStatus.Connecting;
                }
            };
            WebSocketTransport.prototype.sendData = function (sendData, poll) {
                if (this.socket.readyState === 1) {
                    this.sendStack.push(sendData);
                    var data = {
                        type: "execute",
                        data: sendData
                    };
                    this.socket.send(JSON.stringify(data));
                }
                else {
                    if (poll !== true) {
                        this.notSendStack.push(sendData);
                    }
                    else {
                        if (sendData.error) {
                            sendData.error("No socket connection is open");
                        }
                    }
                }
            };
            return WebSocketTransport;
        }());
        Transport.WebSocketTransport = WebSocketTransport;
    })(Transport = BROCKHAUSAG.Transport || (BROCKHAUSAG.Transport = {}));
})(BROCKHAUSAG || (BROCKHAUSAG = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRldi9Db21tYW5kUUwudHMiLCJkZXYvSGVscGVyLnRzIiwiZGV2L0h0dHAudHMiLCJkZXYvTG9nZ2luZy50cyIsImRldi9TdWJzY3JpcHRpb25NYW5hZ2VyLnRzIiwiZGV2L1RyYW5zcG9ydE1hbmFnZXIudHMiLCJkZXYvRW50aXRpZXMvQ29tbWFuZFFMQ29tbWFuZC50cyIsImRldi9FbnRpdGllcy9Db21tYW5kUUxSZXF1ZXN0LnRzIiwiZGV2L0VudGl0aWVzL0NvbW1hbmRRTFJlc3BvbnNlLnRzIiwiZGV2L0VudGl0aWVzL0NvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uLnRzIiwiZGV2L0VudGl0aWVzL1Jlc3BvbnNlRGF0YU9iamVjdC50cyIsImRldi9FbnRpdGllcy9TZW5kRGF0YU9iamVjdC50cyIsImRldi9FbnRpdGllcy9XZWJTb2NrZXRNZXNzYWdlLnRzIiwiZGV2L1RyYW5zcG9ydC9IdHRwVHJhbnNwb3J0LnRzIiwiZGV2L1RyYW5zcG9ydC9JVHJhbnNwb3J0LnRzIiwiZGV2L1RyYW5zcG9ydC9XZWJTb2NrZXRUcmFuc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsV0FBVyxDQThScEI7QUE5UkQsV0FBVSxXQUFXO0lBRWpCO1FBaUJJLG1CQUFZLFNBQTJDO1lBaEIvQyxhQUFRLEdBQXFDO2dCQUNqRCxPQUFPLEVBQUUsTUFBTTtnQkFDZixNQUFNLEVBQUUsY0FBYztnQkFDdEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLEtBQUssRUFBRSxFQUFFO2dCQUNULE9BQU8sRUFBRSxJQUFJO2dCQUNiLFdBQVcsRUFBRSxZQUFBLFdBQVcsQ0FBQyxJQUFJO2dCQUM3QixVQUFVLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNO29CQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxhQUFhO29CQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdB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QUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFOUIsSUFBSSxJQUFJLEdBQThCO3dCQUNsQyxJQUFJLEVBQUUsU0FBUzt3QkFDZixJQUFJLEVBQUUsUUFBUTtxQkFDakIsQ0FBQztvQkFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNqQixRQUFRLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQ25ELENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUNMLHlCQUFDO1FBQUQsQ0FuSUEsQUFtSUMsSUFBQTtRQW5JWSw0QkFBa0IscUJBbUk5QixDQUFBO0lBQ0wsQ0FBQyxFQXRJcUIsU0FBUyxHQUFULHFCQUFTLEtBQVQscUJBQVMsUUFzSTlCO0FBQUQsQ0FBQyxFQXRJUyxXQUFXLEtBQVgsV0FBVyxRQXNJcEIiLCJmaWxlIjoiY29tbWFuZHFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIEJST0NLSEFVU0FHIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFFMIHtcclxuICAgICAgICBwcml2YXRlIHNldHRpbmdzOiBFbnRpdGllcy5JQ29tbWFuZFFMQ29uZmlndXJhdGlvbiA9IHtcclxuICAgICAgICAgICAgaGFuZGxlcjogd2luZG93LFxyXG4gICAgICAgICAgICBzZW5kZXI6IFwiY21kUUwuc2VuZGVyXCIsXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IDMwMDAwLFxyXG4gICAgICAgICAgICBjb21wbGV0ZVRpbWVvdXQ6IDUwMDAsXHJcbiAgICAgICAgICAgIHRva2VuOiBcIlwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBudWxsLFxyXG4gICAgICAgICAgICBsb2dnaW5nVHlwZTogTG9nZ2luZ1R5cGUuTm9uZSxcclxuICAgICAgICAgICAgc2VydmVycGF0aDogd2luZG93LmxvY2F0aW9uLm9yaWdpbiA/XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvY29tbWFuZFFML1wiIDpcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArICh3aW5kb3cubG9jYXRpb24ucG9ydCA/IFwiOlwiICsgd2luZG93LmxvY2F0aW9uLnBvcnQgOiBcIlwiKSArIFwiL2NvbW1hbmRRTC9cIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHB1YmxpYyAkcmVxdWVzdDogYW55O1xyXG4gICAgICAgIHB1YmxpYyAkaW5kZXg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKF9zZXR0aW5nczogRW50aXRpZXMuSUNvbW1hbmRRTENvbmZpZ3VyYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKF9zZXR0aW5ncy5jb21wbGV0ZVRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuY29tcGxldGVUaW1lb3V0ID0gX3NldHRpbmdzLmNvbXBsZXRlVGltZW91dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX3NldHRpbmdzLnRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGltZW91dCA9IF9zZXR0aW5ncy50aW1lb3V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfc2V0dGluZ3Muc2VydmVycGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5zZXJ2ZXJwYXRoID0gX3NldHRpbmdzLnNlcnZlcnBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9zZXR0aW5ncy5oYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmhhbmRsZXIgPSBfc2V0dGluZ3MuaGFuZGxlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX3NldHRpbmdzLnRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnRva2VuID0gX3NldHRpbmdzLnRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfc2V0dGluZ3Muc2VuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnNlbmRlciA9IF9zZXR0aW5ncy5zZW5kZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9zZXR0aW5ncy5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmhlYWRlcnMgPSBfc2V0dGluZ3MuaGVhZGVycztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuaGVhZGVycyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJUb2tlbiBcIiArIHRoaXMuc2V0dGluZ3MudG9rZW5cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF9zZXR0aW5ncy5sb2dnaW5nVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5sb2dnaW5nVHlwZSA9IF9zZXR0aW5ncy5sb2dnaW5nVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoX3NldHRpbmdzLnVzZUh0dHApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudXNlSHR0cCA9IF9zZXR0aW5ncy51c2VIdHRwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5sb2dnaW5nVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZ2dpbmdUeXBlID0gdGhpcy5zZXR0aW5ncy5sb2dnaW5nVHlwZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVHJhbnNwb3J0TWFuYWdlci5jb25maWcodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBTdWJzY3JpcHRpb25zICovXHJcbiAgICAgICAgcHVibGljIHN1YnNjcmliZSh0b3BpYzogc3RyaW5nLCBkYXRhOiBhbnksIHN1Y2Nlc3M/OiAoZGF0YTogYW55KSA9PiB2b2lkLCBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIGxldCBzdWJzY3JpcHRpb246IEVudGl0aWVzLkNvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgdG9waWM6IHRvcGljLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogZGF0YSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXHJcbiAgICAgICAgICAgICAgICBpZDogSGVscGVyLkdlbmVyYXRlR3VpZCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBTdWJzY3JpcHRpb25NYW5hZ2VyLm1ha2VTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN1YnNjcmliZUNvbW1hbmQoY21kOiBzdHJpbmcsIGRhdGE6IGFueSwgc3VjY2Vzcz86IChkYXRhOiBhbnkpID0+IHZvaWQsIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbjogRW50aXRpZXMuQ29tbWFuZFFMQ29tbWFuZCA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNtZCxcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBzdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICAgICAgICAgICAgaWQ6IEhlbHBlci5HZW5lcmF0ZUd1aWQoKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdWJzY3JpcHRpb25NYW5hZ2VyLm1ha2VDb21tYW5kU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgICAgICAvKmlmIChkYXRhLmxlbmd0aCA+IDAgJiYgZGF0YVswXVtcImNvdW50ZXJcIl0gJiYgZGF0YVswXVtcImNvdW50ZXJcIl0gPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kW1wiY291bnRlclwiXSA9IGRhdGFbMF1bXCJjb3VudGVyXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDAgJiYgZGF0YVswXVtcImVhY2hcIl0gJiYgZGF0YVswXVtcImVhY2hcIl0gPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tYW5kW1wiZWFjaFwiXSA9IGRhdGFbMF1bXCJlYWNoXCJdO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdW5zdWJzY3JpYmUodG9waWM6IHN0cmluZywgZGF0YT86IGFueSwgaWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgU3Vic2NyaXB0aW9uTWFuYWdlci5yZW1vdmVTdWJzY3JpcHRpb24odG9waWMsIGRhdGEsIGlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdW5zdWJzY3JpYmVDb21tYW5kKGNtZDogc3RyaW5nLCBkYXRhPzogYW55LCBpZD86IHN0cmluZykge1xyXG4gICAgICAgICAgICBTdWJzY3JpcHRpb25NYW5hZ2VyLnJlbW92ZUNvbW1hbmRTdWJzY3JpcHRpb24oY21kLCBkYXRhLCBpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHVuc3Vic2NyaWJlQWxsKCkge1xyXG4gICAgICAgICAgICBTdWJzY3JpcHRpb25NYW5hZ2VyLnJlbW92ZUFsbFN1YnNjcmlwdGlvbnMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdW5zdWJzY3JpYmVBbGxDb21tYW5kcygpIHtcclxuICAgICAgICAgICAgU3Vic2NyaXB0aW9uTWFuYWdlci5yZW1vdmVBbGxDb21tYW5kU3Vic2NyaXB0aW9ucygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qcHVibGljIHB1Ymxpc2goY21kOiBzdHJpbmcsIGRhdGE6IGFueSwgc3VjY2Vzcz86IEZ1bmN0aW9uLCBlcnJvcj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIExvZ2dlci5Mb2coXCJwdWJsaXNoIFwiICsgY21kLCBkYXRhLCBNZXNzYWdlVHlwZS5JbmZvKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKGNtZCwgZGF0YSwgc3VjY2VzcywgZXJyb3IpO1xyXG4gICAgICAgIH0qL1xyXG5cclxuICAgICAgICBwdWJsaWMgaW52b2tlKGNtZDogc3RyaW5nLCBkYXRhOiBhbnksIHN1Y2Nlc3M/OiAoZGF0YTogYW55KSA9PiB2b2lkLCBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIExvZ2dlci5Mb2coXCJpbnZva2UgXCIgKyBjbWQsIGRhdGEsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICBUcmFuc3BvcnRNYW5hZ2VyLmludm9rZShjbWQsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBiZWdpbigpIHtcclxuICAgICAgICAgICAgVHJhbnNwb3J0TWFuYWdlci5iZWdpbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGVuZCgpIHtcclxuICAgICAgICAgICAgVHJhbnNwb3J0TWFuYWdlci5lbmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qcHVibGljIHBvbGwoc3VjY2Vzcz86IEZ1bmN0aW9uLCBlcnJvcj86IEZ1bmN0aW9uLCBpZ25vcmVDb21wbGV0ZUZuPzogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gQ29ubmVjdGlvblN0YXR1cy5Ob25lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5Mb2coXCJkb24ndCBjYWxsIHBvbGwgYmVmb3JlIGNvbm5lY3QuKE5vbmUpXCIsIG51bGwsIE1lc3NhZ2VUeXBlLkVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA0MDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBDb25uZWN0aW9uU3RhdHVzLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuTG9nKFwiZG9uJ3QgY2FsbCBwb2xsIGJlZm9yZSBjb25uZWN0LihEaXNjb25uZWN0ZWQpXCIsIG51bGwsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDMwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IENvbm5lY3Rpb25TdGF0dXMuUG9sbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuTG9nKFwiZG9uJ3QgY2FsbCBwb2xsIG1hbnkgdGltZXMuKFBvbGwpXCIsIG51bGwsIE1lc3NhZ2VUeXBlLldhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDUwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0LnN0YXR1cyA9IENvbm5lY3Rpb25TdGF0dXMuUG9sbDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwb2xsRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIFwic2VuZGVyXCI6IHRoYXQuc2VuZGVyLFxyXG4gICAgICAgICAgICAgICAgXCJjb21tYW5kc1wiOiB0aGF0LmNvbW1hbmRzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBjb21wbGV0ZUZuID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCEoaWdub3JlQ29tcGxldGVGbiAmJiBpZ25vcmVDb21wbGV0ZUZuID09PSB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVGbiA9ICgpID0+IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGF0LnBvbGwoc3VjY2VzcywgZXJyb3IpOyB9LCB0aGF0LmNvbXBsZXRlVGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhhdC5fYWpheChwb2xsRGF0YSwgc3VjY2VzcywgZXJyb3IsIGNvbXBsZXRlRm4pO1xyXG4gICAgICAgICAgICByZXR1cm4gMjAwO1xyXG4gICAgICAgIH0qL1xyXG5cclxuICAgICAgICAvKnByaXZhdGUgX2FqYXgoYWpheERhdGE6IGFueSwgc3VjY2Vzcz86IEZ1bmN0aW9uLCBlcnJvcj86IEZ1bmN0aW9uLCBjb21wbGV0ZUZuPzogYW55KSB7XHJcbiAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5sb2dnZXIuTG9nKFwiX2FqYXhcIiwgYWpheERhdGEsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGNsb25lZE9iajogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgaW5kZXg6IHRoYXQuJGluZGV4KyssXHJcbiAgICAgICAgICAgICAgICBzZW5kZXI6IGFqYXhEYXRhLnNlbmRlcixcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGFqYXhEYXRhLmNvbW1hbmRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGFqYXhEYXRhLmNvbW1hbmRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRbXCJjb3VudGVyXCJdICYmICgtLWVsZW1lbnQuY291bnRlcikgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhamF4RGF0YS5jb21tYW5kcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnRbXCJlYWNoXCJdIHx8IChlbGVtZW50W1wiZWFjaFwiXSAmJiAodGhhdC4kaW5kZXggJSBlbGVtZW50LmVhY2gpID09PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5wYXJhbWV0ZXJzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVkT2JqLmNvbW1hbmRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IGVsZW1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1ldGVyc1wiOiAoZWxlbWVudC5wYXJhbWV0ZXJzKCkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGVsZW1lbnQuc3VjY2VzcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogZWxlbWVudC5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWRPYmouY29tbWFuZHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogZWxlbWVudC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXJzXCI6IGVsZW1lbnQucGFyYW1ldGVycyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBlbGVtZW50LnN1Y2Nlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IGVsZW1lbnQuZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhhdC4kcmVxdWVzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXF1ZXN0LmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhhdC4kcmVxdWVzdCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHRoYXQuc2VydmVycGF0aCxcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoY2xvbmVkT2JqKSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoYXQuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHRoYXQudGltZW91dCxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBjb21wbGV0ZUZuLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9zdWNjZXNzKHRoYXQsIGRhdGEsIHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX2Vycm9yKHRoYXQsIHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24sIGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIC8qcHJpdmF0ZSBfc3VjY2Vzcyh0aGF0OiBDb21tYW5kUUwsIGRhdGEsIHN1Y2Nlc3M6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vVXBkYXRlXHJcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyLkxvZyhcIl9zdWNjZXNzIFwiICsgKGRhdGEudCkgKyBcIm1zXCIsIGRhdGEsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5jb21tYW5kcywgZnVuY3Rpb24gKGluZGV4LCBjbWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY21kLmVycm9ycyAmJiBjbWQuZXJyb3JzLmxlbmd0aCA+IDApIHsvL2NoZWNrIGlmIGVycm9yc1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChjbWQuZXJyb3JzLCBmdW5jdGlvbiAoaW5kZXh0d28sIGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmxvZ2dlci5Mb2coXCJjYWxsIFwiICsgY21kLm5hbWUgKyBcIiByZXR1cm5zIHdpdGggZXJyb3IgXCIgKyBlcnIsIG51bGwsIE1lc3NhZ2VUeXBlLldhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vd2l0aG91dCBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY21kLnJldHVybiAmJiBjbWQucmV0dXJuLnJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhjbWQucmV0dXJuLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKGNtZC5yZXR1cm4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm5IYW5kbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmRlZENvbW1hbmQgPSB0aGF0Ll9maW5kKHRoYXQuY29tbWFuZHMsIFwibmFtZVwiLCBjbWQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaW5kZWRDb21tYW5kICYmIGZpbmRlZENvbW1hbmQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5IYW5kbGVyID0gZmluZGVkQ29tbWFuZC5zdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5IYW5kbGVyID0gdGhhdC5oYW5kbGVyW2NtZC5uYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuSGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmxvZ2dlci5Mb2coXCJjYWxsIFwiICsgY21kLm5hbWUsIGNtZC5yZXR1cm4sIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9mbkhhbmRsZXIoY21kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY21kLnJldHVybiAmJiBjbWQucmV0dXJuLnJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuSGFuZGxlcihjbWQucmV0dXJuLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkhhbmRsZXIoY21kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmxvZ2dlci5Mb2coXCJmdW5jdGlvbiBcIiArIGNtZC5uYW1lICsgXCIgbm90IGZvdW5kXCIsIG51bGwsIE1lc3NhZ2VUeXBlLldhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5PbkNvbXBsZXRlID0gdGhhdC5oYW5kbGVyW1wib25Db21wbGV0ZVwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuT25Db21wbGV0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZm5PbkNvbXBsZXRlKGNtZC5yZXR1cm4sIGNtZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNtZC5yZXR1cm4gJiYgY21kLnJldHVybi5yZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubG9nZ2VyLkxvZyhcImNhbGwgb25Db21wbGV0ZShkYXRhLFwiICsgY21kLm5hbWUgKyBcIilcIiwgY21kLnJldHVybi5yZXN1bHQsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5PbkNvbXBsZXRlKGNtZC5yZXR1cm4ucmVzdWx0LCBjbWQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmxvZ2dlci5Mb2coXCJjYWxsIG9uQ29tcGxldGUoZGF0YSxcIiArIGNtZC5uYW1lICsgXCIpXCIsIGNtZC5yZXR1cm4sIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm5PbkNvbXBsZXRlKGNtZC5yZXR1cm4sIGNtZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9lcnJvcih0aGF0OiBDb21tYW5kUUwsIHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24sIGVycm9yOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB0aGF0Ll9sb2coXCJfZXJyb3IgXCIgKyB0ZXh0U3RhdHVzLCBlcnJvclRocm93biwgTG9nZ2luZ1R5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IoeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBmbk9uRXJyb3IgPSB0aGF0LmhhbmRsZXJbXCJvbkVycm9yXCJdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuT25FcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fbG9nKFwiY2FsbCBvbkVycm9yLVwiICsgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24sIExvZ2dpbmdUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgZm5PbkVycm9yKHhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSovXHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgQlJPQ0tIQVVTQUcge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBIZWxwZXIge1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdlbmVyYXRlR3VpZCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgdiA9IGMgPT09IFwieFwiID8gciA6IChyICYgMHgzIHwgMHg4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBGaW5kKGFycmF5OiBhbnlbXSwgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSwgcmVtb3ZlPzogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0gYXJyYXlbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9ialtwcm9wZXJ0eV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHIHtcclxuICAgIGV4cG9ydCBlbnVtIENvbm5lY3Rpb25TdGF0dXMgeyBOb25lLCBDb25uZWN0ZWQsIERpc2Nvbm5lY3RlZCwgUG9sbCB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEh0dHBIZWxwZXIge1xyXG5cclxuICAgICAgICBwdWJsaWMgbWFrZVJlcXVlc3QoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgQlJPQ0tIQVVTQUcge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIExvZ2dpbmdUeXBlIHsgTm9uZSwgQWxsLCBJbmZvLCBXYXJuaW5nLCBFcnJvciwgRGVidWcgfVxyXG5cclxuICAgIGV4cG9ydCBlbnVtIE1lc3NhZ2VUeXBlIHsgSW5mbywgV2FybmluZywgRXJyb3IsIERlYnVnIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTG9nZ2VyIHtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBsb2dnaW5nVHlwZTogTG9nZ2luZ1R5cGUgPSBMb2dnaW5nVHlwZS5Ob25lO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExvZyhtZXNzYWdlOiBzdHJpbmcsIG9iamVjdD86IGFueSwgbWVzc2FnZVR5cGU/OiBNZXNzYWdlVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5sb2dnaW5nVHlwZSA9PT0gTG9nZ2luZ1R5cGUuTm9uZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2VUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkluZm86XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKG1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqZWN0ICYmIGNvbnNvbGUudGFibGUgJiYgdGhpcy5sb2dnaW5nVHlwZSA9PT0gTG9nZ2luZ1R5cGUuRGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS50YWJsZShvYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLldhcm5pbmc6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubG9nZ2luZ1R5cGUgIT09IExvZ2dpbmdUeXBlLkluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkVycm9yOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvZ2dpbmdUeXBlICE9PSBMb2dnaW5nVHlwZS5JbmZvICYmIHRoaXMubG9nZ2luZ1R5cGUgIT09IExvZ2dpbmdUeXBlLldhcm5pbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5EZWJ1ZzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2dnaW5nVHlwZSA9PT0gTG9nZ2luZ1R5cGUuRGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uTWFuYWdlciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdWJzY3JpcHRpb25zOiBFbnRpdGllcy5Db21tYW5kUUxDb21tYW5kW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRvcGljU3Vic2NyaXB0aW9uczogRW50aXRpZXMuQ29tbWFuZFFMVG9waWNTdWJzY3JpcHRpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIG1ha2VTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uOiBFbnRpdGllcy5Db21tYW5kUUxUb3BpY1N1YnNjcmlwdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICBMb2dnZXIuTG9nKFwic3Vic2NyaWJlIHRvcGljIFwiICsgc3Vic2NyaXB0aW9uLnRvcGljLCBzdWJzY3JpcHRpb24ucGFyYW1ldGVycywgTWVzc2FnZVR5cGUuSW5mbyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoVHJhbnNwb3J0TWFuYWdlci5zZXJ2ZXJIYW5kbGVzVG9waWNTdWJzY3JpcHRpb25zKCkpIHtcclxuICAgICAgICAgICAgICAgIFRyYW5zcG9ydE1hbmFnZXIuc2VydmVyQWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9waWNTdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbWFrZUNvbW1hbmRTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uOiBFbnRpdGllcy5Db21tYW5kUUxDb21tYW5kKTogdm9pZCB7XHJcbiAgICAgICAgICAgIExvZ2dlci5Mb2coXCJzdWJzY3JpYmUgY29tbWFuZCBcIiArIHN1YnNjcmlwdGlvbi5uYW1lLCBzdWJzY3JpcHRpb24ucGFyYW1ldGVycywgTWVzc2FnZVR5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZVN1YnNjcmlwdGlvbih0b3BpYzogc3RyaW5nLCBkYXRhPzogYW55LCBpZD86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBMb2dnZXIuTG9nKFwidW5zdWJzY3JpYmUgdG9waWMgXCIgKyB0b3BpYywgaWQsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbk9iamVjdDogRW50aXRpZXMuQ29tbWFuZFFMVG9waWNTdWJzY3JpcHRpb24gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG9waWNTdWJzY3JpcHRpb25zLmxlbmd0aDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50b3BpY1N1YnNjcmlwdGlvbnNbaV0udG9waWMgPT09IHRvcGljICYmICghaWQgfHwgdGhpcy50b3BpY1N1YnNjcmlwdGlvbnNbaV0uaWQgPT09IGlkKSAmJiAoIWRhdGEgfHwgZGF0YSA9PT0gdGhpcy50b3BpY1N1YnNjcmlwdGlvbnNbaV0ucGFyYW1ldGVycykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25PYmplY3QgPSB0aGlzLnRvcGljU3Vic2NyaXB0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcGljU3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLkxvZyhcInVuc3Vic2NyaWJlZCB0b3BpYyBcIiArIHRvcGljLCBpZCwgTWVzc2FnZVR5cGUuSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChUcmFuc3BvcnRNYW5hZ2VyLnNlcnZlckhhbmRsZXNUb3BpY1N1YnNjcmlwdGlvbnMoKSAmJiBzdWJzY3JpcHRpb25PYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIFRyYW5zcG9ydE1hbmFnZXIuc2VydmVyUmVtb3ZlU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbk9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlQ29tbWFuZFN1YnNjcmlwdGlvbihjb21tYW5kOiBzdHJpbmcsIGRhdGE/OiBhbnksIGlkPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIExvZ2dlci5Mb2coXCJ1bnN1YnNjcmliZSBjb21tYW5kIFwiICsgY29tbWFuZCwgaWQsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbk9iamVjdDogRW50aXRpZXMuQ29tbWFuZFFMQ29tbWFuZCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zW2ldLm5hbWUgPT09IGNvbW1hbmQgJiYgKCFpZCB8fCB0aGlzLnN1YnNjcmlwdGlvbnNbaV0uaWQgPT09IGlkKSAmJiAoIWRhdGEgfHwgZGF0YSA9PT0gdGhpcy5zdWJzY3JpcHRpb25zW2ldLnBhcmFtZXRlcnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uT2JqZWN0ID0gdGhpcy5zdWJzY3JpcHRpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLkxvZyhcInVuc3Vic2NyaWJlZCBjb21tYW5kIFwiICsgY29tbWFuZCwgaWQsIE1lc3NhZ2VUeXBlLkluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUFsbFN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIExvZ2dlci5Mb2coXCJ1bnN1YnNjcmliZUFsbFwiLCBudWxsLCBNZXNzYWdlVHlwZS5JbmZvKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9waWNTdWJzY3JpcHRpb25zID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoVHJhbnNwb3J0TWFuYWdlci5zZXJ2ZXJIYW5kbGVzVG9waWNTdWJzY3JpcHRpb25zKCkpIHtcclxuICAgICAgICAgICAgICAgIFRyYW5zcG9ydE1hbmFnZXIuc2VydmVyUmVtb3ZlQWxsU3Vic2NyaXB0aW9ucygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUFsbENvbW1hbmRTdWJzY3JpcHRpb25zKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBMb2dnZXIuTG9nKFwidW5zdWJzY3JpYmVBbGwgY29tbWFuZHNcIiwgbnVsbCwgTWVzc2FnZVR5cGUuSW5mbyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgQlJPQ0tIQVVTQUcge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUcmFuc3BvcnRNYW5hZ2VyIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjdXJyZW50VHJhbnNwb3J0OiBUcmFuc3BvcnQuSVRyYW5zcG9ydDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzZXR0aW5nczogRW50aXRpZXMuSUNvbW1hbmRRTENvbmZpZ3VyYXRpb247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29uZmlnKHNldHRpbmdzOiBFbnRpdGllcy5JQ29tbWFuZFFMQ29uZmlndXJhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJXZWJTb2NrZXRcIiBpbiB3aW5kb3cgJiYgc2V0dGluZ3MudXNlSHR0cCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhbnNwb3J0ID0gbmV3IFRyYW5zcG9ydC5XZWJTb2NrZXRUcmFuc3BvcnQodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0Lkh0dHBUcmFuc3BvcnQodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmVySGFuZGxlc1RvcGljU3Vic2NyaXB0aW9ucygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRyYW5zcG9ydC5uYW1lID09PSBcInNvY2tldFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2ZXJBZGRTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uOiBFbnRpdGllcy5Db21tYW5kUUxUb3BpY1N1YnNjcmlwdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICAodGhpcy5jdXJyZW50VHJhbnNwb3J0IGFzIFRyYW5zcG9ydC5JU2VydmVyTWFuYWdlZFRyYW5zcG9ydCkuYWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZlclJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb246IEVudGl0aWVzLkNvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgICh0aGlzLmN1cnJlbnRUcmFuc3BvcnQgYXMgVHJhbnNwb3J0LklTZXJ2ZXJNYW5hZ2VkVHJhbnNwb3J0KS5yZW1vdmVTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmVyUmVtb3ZlQWxsU3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcclxuICAgICAgICAgICAgKHRoaXMuY3VycmVudFRyYW5zcG9ydCBhcyBUcmFuc3BvcnQuSVNlcnZlck1hbmFnZWRUcmFuc3BvcnQpLnJlc2V0U3Vic2NyaXB0aW9ucygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnZva2UoY29tbWFuZDogc3RyaW5nLCBkYXRhOiBhbnksIHN1Y2Nlc3M/OiAoZGF0YTogYW55KSA9PiB2b2lkLCBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpbnZva2VEYXRhOiBFbnRpdGllcy5Db21tYW5kUUxSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgc2VuZGVyOiB0aGlzLnNldHRpbmdzLnNlbmRlcixcclxuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbW1hbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBpZDogSGVscGVyLkdlbmVyYXRlR3VpZCgpXHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VHJhbnNwb3J0LnNlbmREYXRhKHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IGludm9rZURhdGEsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBzdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxyXG4gICAgICAgICAgICAgICAgaWQ6IEhlbHBlci5HZW5lcmF0ZUd1aWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmVnaW4oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMucG9sbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlcnZlckhhbmRsZXNUb3BpY1N1YnNjcmlwdGlvbnMoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRUb3BpY1VwZGF0ZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBlbmQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuYnJlYWtQb2xsID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5icmVha1RvcGljVXBkYXRlcyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBicmVha1BvbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9sbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYnJlYWtQb2xsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJyZWFrUG9sbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY29tbWFuZHM6IEVudGl0aWVzLkNvbW1hbmRRTENvbW1hbmRbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgc3Vic2NyaXB0aW9uIG9mIFN1YnNjcmlwdGlvbk1hbmFnZXIuc3Vic2NyaXB0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdWJzY3JpcHRpb24ucGFyYW1ldGVycyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvbGxPYmo6IEVudGl0aWVzLkNvbW1hbmRRTENvbW1hbmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBzdWJzY3JpcHRpb24uZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHN1YnNjcmlwdGlvbi5zdWNjZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogc3Vic2NyaXB0aW9uLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzdWJzY3JpcHRpb24ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogc3Vic2NyaXB0aW9uLnBhcmFtZXRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzLnB1c2gocG9sbE9iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzLnB1c2goc3Vic2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHBvbGxEYXRhOiBFbnRpdGllcy5Db21tYW5kUUxSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgc2VuZGVyOiB0aGlzLnNldHRpbmdzLnNlbmRlclxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQb2xsUmVxdWVzdChwb2xsRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVBvbGxSZXF1ZXN0KGRhdGE6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFuc3BvcnQuc2VuZERhdGEoe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiB0aGlzLnBvbGxDb21wbGV0ZUhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0aGlzLnBvbGxTdWNjZXNzSGFuZGxlcixcclxuICAgICAgICAgICAgICAgIGVycm9yOiB0aGlzLnBvbGxFcnJvckhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICBpZDogSGVscGVyLkdlbmVyYXRlR3VpZCgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYnJlYWtUb3BpY1VwZGF0ZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRUb3BpY1VwZGF0ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJyZWFrVG9waWNVcGRhdGVzID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJyZWFrVG9waWNVcGRhdGVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChTdWJzY3JpcHRpb25NYW5hZ2VyLnRvcGljU3Vic2NyaXB0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFuc3BvcnQuc2VuZERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9waWNzOiBTdWJzY3JpcHRpb25NYW5hZ2VyLnRvcGljU3Vic2NyaXB0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyOiB0aGlzLnNldHRpbmdzLnNlbmRlclxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IHRoaXMudG9waWNDb21wbGV0ZUhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHRoaXMudG9waWNFcnJvckhhbmRsZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdGhpcy50b3BpY1N1Y2Nlc3NIYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBIZWxwZXIuR2VuZXJhdGVHdWlkKClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRvcGljU3VjY2Vzc0hhbmRsZXIoZGF0YTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdG9waWNFcnJvckhhbmRsZXIoZXJyb3I6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRvcGljQ29tcGxldGVIYW5kbGVyKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBUcmFuc3BvcnRNYW5hZ2VyLmdldFRvcGljVXBkYXRlcygpO1xyXG4gICAgICAgICAgICB9LCBUcmFuc3BvcnRNYW5hZ2VyLnNldHRpbmdzLmNvbXBsZXRlVGltZW91dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHBvbGxTdWNjZXNzSGFuZGxlcihkYXRhOiBFbnRpdGllcy5Db21tYW5kUUxSZXNwb25zZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBMb2dnZXIuTG9nKFwiX3N1Y2Nlc3MgXCIgKyAoZGF0YS50KSArIFwibXNcIiwgZGF0YSwgTWVzc2FnZVR5cGUuSW5mbyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjb21tYW5kIG9mIGRhdGEuY29tbWFuZHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21tYW5kLmVycm9ycyAmJiBjb21tYW5kLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZXJyb3Igb2YgY29tbWFuZC5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLkxvZyhcImNhbGwgXCIgKyBjb21tYW5kLm5hbWUgKyBcIiByZXR1cm5zIHdpdGggZXJyb3IgXCIgKyBlcnJvciwgbnVsbCwgTWVzc2FnZVR5cGUuV2FybmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm5IYW5kbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmRTdWJzY3JpcHRpb24gPSBIZWxwZXIuRmluZChTdWJzY3JpcHRpb25NYW5hZ2VyLnN1YnNjcmlwdGlvbnMsIFwiaWRcIiwgY29tbWFuZC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFN1YnNjcmlwdGlvbiAmJiBmb3VuZFN1YnNjcmlwdGlvbi5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuSGFuZGxlciA9IGZvdW5kU3Vic2NyaXB0aW9uLnN1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm5IYW5kbGVyID0gVHJhbnNwb3J0TWFuYWdlci5zZXR0aW5ncy5oYW5kbGVyW2NvbW1hbmQubmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZuSGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5Mb2coXCJjYWxsIFwiICsgY29tbWFuZC5uYW1lLCBjb21tYW5kLnJldHVybiwgTWVzc2FnZVR5cGUuSW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWFuZC5yZXR1cm4gJiYgY29tbWFuZC5yZXR1cm4ucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbkhhbmRsZXIoY29tbWFuZC5yZXR1cm4ucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuSGFuZGxlcihjb21tYW5kLnJldHVybik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuTG9nKFwiZnVuY3Rpb24gXCIgKyBjb21tYW5kLm5hbWUgKyBcIiBub3QgZm91bmRcIiwgbnVsbCwgTWVzc2FnZVR5cGUuV2FybmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHBvbGxFcnJvckhhbmRsZXIoZXJyb3I6IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICBMb2dnZXIuTG9nKFwiX2Vycm9yIFwiLCBlcnJvciwgTWVzc2FnZVR5cGUuRXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBwb2xsQ29tcGxldGVIYW5kbGVyKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBUcmFuc3BvcnRNYW5hZ2VyLnBvbGwoKTtcclxuICAgICAgICAgICAgfSwgVHJhbnNwb3J0TWFuYWdlci5zZXR0aW5ncy5jb21wbGV0ZVRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBCUk9DS0hBVVNBRy5FbnRpdGllcyB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFFMQ29tbWFuZCB7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgcGFyYW1ldGVyczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBzdWNjZXNzPzogKGRhdGE6IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgZXJyb3JzPzogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIHJldHVybj86IGFueTtcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBCUk9DS0hBVVNBRy5FbnRpdGllcyB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFFMUmVxdWVzdCB7XHJcbiAgICAgICAgcHVibGljIHNlbmRlcjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBjb21tYW5kczogQ29tbWFuZFFMQ29tbWFuZFtdO1xyXG4gICAgICAgIHB1YmxpYyBleGVjdXRlUGFyYWxsZWw/OiBib29sZWFuO1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHLkVudGl0aWVzIHtcclxuICAgIGV4cG9ydCBjbGFzcyBDb21tYW5kUUxSZXNwb25zZSB7XHJcbiAgICAgICAgcHVibGljIGNvbW1hbmRzOiBFbnRpdGllcy5Db21tYW5kUUxDb21tYW5kW107XHJcbiAgICAgICAgcHVibGljIGVycm9yczogc3RyaW5nW107XHJcbiAgICAgICAgcHVibGljIHQ6IG51bWJlcjtcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBCUk9DS0hBVVNBRy5FbnRpdGllcyB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ29tbWFuZFFMVG9waWNTdWJzY3JpcHRpb24ge1xyXG4gICAgICAgIHB1YmxpYyB0b3BpYzogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBwYXJhbWV0ZXJzOiBhbnk7XHJcbiAgICAgICAgcHVibGljIHN1Y2Nlc3M/OiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHLkVudGl0aWVzIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVzcG9uc2VEYXRhT2JqZWN0IHtcclxuICAgICAgICBwdWJsaWMgZGF0YTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHLkVudGl0aWVzIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2VuZERhdGFPYmplY3Qge1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGlkOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHN1Y2Nlc3M/OiAoZGF0YTogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBjb21wbGV0ZT86ICgpID0+IHZvaWQ7XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgQlJPQ0tIQVVTQUcuRW50aXRpZXMge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBXZWJTb2NrZXRNZXNzYWdlIHtcclxuICAgICAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhPzogYW55O1xyXG4gICAgfVxyXG59IiwibmFtZXNwYWNlIEJST0NLSEFVU0FHLlRyYW5zcG9ydCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEh0dHBUcmFuc3BvcnQgaW1wbGVtZW50cyBJVHJhbnNwb3J0IHtcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJodHRwXCI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2V0dGluZ3M6IEVudGl0aWVzLklDb21tYW5kUUxDb25maWd1cmF0aW9uKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtYWtlUmVxdWVzdChzZW5kRGF0YTogRW50aXRpZXMuU2VuZERhdGFPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgaHR0cC5vcGVuKFwiUE9TVFwiLCB0aGlzLnNldHRpbmdzLnNlcnZlcnBhdGgsIHRydWUpO1xyXG4gICAgICAgICAgICBodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50aW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICBodHRwLnRpbWVvdXQgPSB0aGlzLnNldHRpbmdzLnRpbWVvdXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmhlYWRlcnMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBPYmplY3Qua2V5cyh0aGlzLnNldHRpbmdzLmhlYWRlcnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdGhpcy5zZXR0aW5ncy5oZWFkZXJzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGh0dHAucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChodHRwLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlOiBhbnk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoaHR0cC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmREYXRhLnN1Y2Nlc3MocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbmREYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kRGF0YS5lcnJvcihcIkh0dHAgZXJyb3I6IFwiICsgaHR0cC5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VuZERhdGEuY29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZERhdGEuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBodHRwLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2VuZERhdGEuZGF0YSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFN0YXR1cygpOiBUcmFuc3BvcnRTdGF0dXMge1xyXG4gICAgICAgICAgICByZXR1cm4gVHJhbnNwb3J0U3RhdHVzLlJlYWR5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNlbmREYXRhKHNlbmREYXRhOiBFbnRpdGllcy5TZW5kRGF0YU9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLm1ha2VSZXF1ZXN0KHNlbmREYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBCUk9DS0hBVVNBRy5UcmFuc3BvcnQge1xyXG5cclxuICAgIGV4cG9ydCBlbnVtIFRyYW5zcG9ydFN0YXR1cyB7IE5vbmUsIFJlYWR5LCBJblVzZSwgRGlzY29ubmVjdGVkLCBFcnJvciwgQ29ubmVjdGluZyB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJVHJhbnNwb3J0IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgZ2V0U3RhdHVzKCk6IFRyYW5zcG9ydFN0YXR1cztcclxuICAgICAgICBzZW5kRGF0YShzZW5kRGF0YTogRW50aXRpZXMuU2VuZERhdGFPYmplY3QsIHBvbGw/OiBib29sZWFuKTogdm9pZDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTZXJ2ZXJNYW5hZ2VkVHJhbnNwb3J0IGV4dGVuZHMgSVRyYW5zcG9ydCB7XHJcbiAgICAgICAgYWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbjogRW50aXRpZXMuQ29tbWFuZFFMVG9waWNTdWJzY3JpcHRpb24pOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb246IEVudGl0aWVzLkNvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uKTogdm9pZDtcclxuICAgICAgICByZXNldFN1YnNjcmlwdGlvbnMoKTogdm9pZDtcclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBCUk9DS0hBVVNBRy5UcmFuc3BvcnQge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBXZWJTb2NrZXRUcmFuc3BvcnQgaW1wbGVtZW50cyBJU2VydmVyTWFuYWdlZFRyYW5zcG9ydCB7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZyA9IFwic29ja2V0XCI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgdXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc29ja2V0OiBXZWJTb2NrZXQ7XHJcbiAgICAgICAgcHJpdmF0ZSBub3RTZW5kU3RhY2s6IEVudGl0aWVzLlNlbmREYXRhT2JqZWN0W10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHNlbmRTdGFjazogRW50aXRpZXMuU2VuZERhdGFPYmplY3RbXSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBFbnRpdGllcy5JQ29tbWFuZFFMQ29uZmlndXJhdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMuc2V0dGluZ3Muc2VydmVycGF0aC5pbmRleE9mKFwiaHR0cHNcIikgIT09IC0xID8gXCJ3c3NcIiArIHRoaXMuc2V0dGluZ3Muc2VydmVycGF0aC5yZXBsYWNlKFwiaHR0cHNcIiwgXCJcIikgOiBcIndzXCIgKyB0aGlzLnNldHRpbmdzLnNlcnZlcnBhdGgucmVwbGFjZShcImh0dHBcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLnVybCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9ub3BlbkhhbmRsZXIgPSB0aGF0LnNvY2tldC5vbm9wZW47XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9uY2xvc2VIYW5kbGVyID0gdGhhdC5zb2NrZXQub25jbG9zZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgb25tZXNzYWdlSGFuZGxlciA9IHRoYXQuc29ja2V0Lm9ubWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoYXQudXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNvY2tldC5vbm9wZW4gPSBvbm9wZW5IYW5kbGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc29ja2V0Lm9uY2xvc2UgPSBvbmNsb3NlSGFuZGxlcjtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNvY2tldC5vbm1lc3NhZ2UgPSBvbm1lc3NhZ2VIYW5kbGVyO1xyXG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChTdWJzY3JpcHRpb25NYW5hZ2VyLnN1YnNjcmlwdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhOiBFbnRpdGllcy5XZWJTb2NrZXRNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1YnNjcmliZU1hbnlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogU3Vic2NyaXB0aW9uTWFuYWdlci50b3BpY1N1YnNjcmlwdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhhdC5ub3RTZW5kU3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5ub3RTZW5kU3RhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9iajogYW55ID0gdGhhdC5ub3RTZW5kU3RhY2tbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQubm90U2VuZFN0YWNrLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZW5kRGF0YShvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2OiBNZXNzYWdlRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOiBFbnRpdGllcy5XZWJTb2NrZXRNZXNzYWdlID0gSlNPTi5wYXJzZShldi5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS50eXBlID09PSBcImV4ZWN1dGVSZXN1bHRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQ6IEVudGl0aWVzLlJlc3BvbnNlRGF0YU9iamVjdCA9IGRhdGEuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbmRPYmplY3Q6IEVudGl0aWVzLlNlbmREYXRhT2JqZWN0ID0gSGVscGVyLkZpbmQodGhhdC5zZW5kU3RhY2ssIFwiaWRcIiwgcmVzdWx0LmlkLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbmRPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbmRPYmplY3Quc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZE9iamVjdC5zdWNjZXNzKHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbmRPYmplY3QuY29tcGxldGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRPYmplY3QuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSBcInN1YnNjcmliZVJlc3VsdFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFkZFN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb246IEVudGl0aWVzLkNvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTogRW50aXRpZXMuV2ViU29ja2V0TWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1YnNjcmliZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb246IEVudGl0aWVzLkNvbW1hbmRRTFRvcGljU3Vic2NyaXB0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTogRW50aXRpZXMuV2ViU29ja2V0TWVzc2FnZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInVuc3Vic2NyaWJlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVzZXRTdWJzY3JpcHRpb25zKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6IEVudGl0aWVzLldlYlNvY2tldE1lc3NhZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJyZXNldFwiXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0U3RhdHVzKCk6IFRyYW5zcG9ydFN0YXR1cyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVHJhbnNwb3J0U3RhdHVzLlJlYWR5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRyYW5zcG9ydFN0YXR1cy5Db25uZWN0aW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc2VuZERhdGEoc2VuZERhdGE6IEVudGl0aWVzLlNlbmREYXRhT2JqZWN0LCBwb2xsPzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFN0YWNrLnB1c2goc2VuZERhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOiBFbnRpdGllcy5XZWJTb2NrZXRNZXNzYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZXhlY3V0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlbmREYXRhXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvbGwgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdFNlbmRTdGFjay5wdXNoKHNlbmREYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbmREYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmREYXRhLmVycm9yKFwiTm8gc29ja2V0IGNvbm5lY3Rpb24gaXMgb3BlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
