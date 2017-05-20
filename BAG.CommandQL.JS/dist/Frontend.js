var BAG;
(function (BAG) {
    var FrontendApp = (function () {
        function FrontendApp(settings) {
            this.cmdQL = new BAG.CommandQL(settings);
        }
        FrontendApp.prototype.init = function (groupId) {
            this.groupId = groupId;
        };
        FrontendApp.prototype.run = function () {
        };
        FrontendApp.prototype.createRequest = function (name, category) {
            var that = this;
            var sender = "sender";
            var parameter = "";
            that.cmdQL.invoke("setLiveChatRequest", [{
                    "scope": "group",
                    "referenceId": this.groupId,
                    "userName": name,
                    "userAgent": navigator.userAgent,
                    "category": "allgemein",
                    "question": "my question"
                }], function (data) { that.waitForRequestAccepted(data); });
        };
        FrontendApp.prototype.waitForRequestAccepted = function (data) {
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
                that.cmdQL.subscribe("getLiveChatMessages", [{ "liveChatMessageId": that.liveChatChannel.id }], function (data) {
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
                            html += on_element.message + '<br/>';
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
        FrontendApp.prototype.setMessageCall = function () {
            var that = this;
            var message = $("#message").val();
            $("#message").val("");
            that.cmdQL.invoke("setLiveChatMessage", [{
                    "id": that.cmdQL.newGuid(),
                    "liveChatChannelId": that.liveChatChannel.id,
                    "message": message,
                    "name": name
                }]);
            $(".chatMessages").append("me: " + message + "<br/>");
        };
        FrontendApp.prototype.ping = function (data) {
            console.log(data);
            $(".ping").append(data + "<br/>");
        };
        return FrontendApp;
    })();
    BAG.FrontendApp = FrontendApp;
})(BAG || (BAG = {}));
