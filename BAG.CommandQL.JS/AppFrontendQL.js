// BROCKHAUS AG 2017
// Paul Mizel
var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var AppFrontendQL = (function () {
        function AppFrontendQL(settings) {
            this.cmdQL = new BROCKHAUSAG.CommandQL(settings);
            this.liveChatMessages = [];
        }
        AppFrontendQL.prototype.init = function (groupId) {
            this.groupId = groupId;
        };
        AppFrontendQL.prototype.run = function () {
        };
        AppFrontendQL.prototype.createRequest = function (userName, category) {
            var that = this;
            var parameter = "";
            that.userName = userName;
            that.cmdQL.invoke("setLiveChatRequest", [{
                    "scope": "group",
                    "referenceId": this.groupId,
                    "userName": userName,
                    "userAgent": navigator.userAgent,
                    "category": category,
                    "question": "my question"
                }], function (data) { that.waitForRequestAccepted(data); });
        };
        AppFrontendQL.prototype.waitForRequestAccepted = function (data) {
            var that = this;
            if (!data)
                return;
            console.log(data);
            that.cmdQL.connect();
            that.cmdQL.subscribe("getLiveChatChannel", [{ "liveChatRequestId": data.id }], function (data) {
                if (!data)
                    return;
                that.liveChatChannel = data.liveChatChannel;
                $(".load").hide();
                $(".getChatSession").html(JSON.stringify(that.liveChatChannel) + "<br/>");
                that.cmdQL.unsubscribe("getLiveChatChannel");
                that.cmdQL.subscribe("getLiveChatMessages", [{ "liveChatChannelId": that.liveChatChannel.id }], function (data) {
                    if (!data)
                        return;
                    var html = "";
                    $.each(data.liveChatMessages, function (index, on_element) {
                        var contains = false;
                        $.each(that.liveChatMessages, function (index, off_element) {
                            if (off_element.id == on_element.id) {
                                contains = true;
                                off_element.status = on_element.status;
                            }
                        });
                        if (!contains) {
                            that.liveChatMessages.push(on_element);
                            html += "<span id=\"" + on_element.id + "\">" +
                                on_element.userName + " : " + on_element.message + '</span><br/>';
                        }
                    });
                    if (html) {
                        $(".chatMessages").append(html);
                    }
                    console.log(data);
                });
            });
            that.cmdQL.poll();
        };
        AppFrontendQL.prototype.send = function (messageText) {
            var that = this;
            that.cmdQL.invoke("setLiveChatMessage", [{
                    "id": that.cmdQL.newGuid(),
                    "liveChatChannelId": that.liveChatChannel.id,
                    "message": messageText,
                    "userName": that.userName
                }], function (data) {
                //that.cmdQL.subscribe("getLiveChatMessage", [{ "liveChatMessageId": data.liveChatMessage.id }],
                //    function (data) {
                //        that.cmdQL.unsubscribe("getLiveChatMessage", [{ "liveChatMessageId": data.liveChatMessage.id }]);
                //    });
            });
            $(".chatMessages").append("me: " + messageText + "<br/>");
        };
        AppFrontendQL.prototype.ping = function (data) {
            console.log(data);
            $(".ping").append(data + "<br/>");
        };
        return AppFrontendQL;
<<<<<<< HEAD
    }());
    BROCKHAUSAG.AppFrontendQL = AppFrontendQL;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
=======
    })();
    BAG.AppFrontendQL = AppFrontendQL;
})(BAG || (BAG = {}));
>>>>>>> 1c919fe0ba967bc61a647dde3d3085db9d675968
//# sourceMappingURL=AppFrontendQL.js.map