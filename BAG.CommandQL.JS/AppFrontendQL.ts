module BAG {

    export class AppFrontendQL {
        public cmdQL: CommandQL;
        public mandant: string;
        public mandantId: string;
        public group: string;
        public groupId: string;
        public userName: string;
        public userId;

        public applicationUser: any;

        public liveChatUser: any;
        public liveChatChannel: any;
        public liveChatMessages: any;

        constructor(settings: IConfigurationQL) {
            this.cmdQL = new CommandQL(settings);
            this.liveChatMessages = [];
        }
        init(groupId) {
            this.groupId = groupId;
        }
        run() {

        }

        public createRequest(userName: string, category: string) {
            let that = this;

            var parameter = "";
            that.userName = userName;

            that.cmdQL.invoke("setLiveChatRequest", [{
                "scope": "group",
                "referenceId": this.groupId,
                "userName": userName,
                "userAgent": navigator.userAgent,
                "category": category,
                "question": "my question"
            }], function (data) { that.waitForRequestAccepted(data) });
        }

        public waitForRequestAccepted(data) {
            let that = this;
            if (!data)
                return;
            console.log(data);
            that.cmdQL.connect();
            that.cmdQL.subscribe("getLiveChatChannel", [{ "liveChatRequestId": data.id }],
                function (data) {
                    if (!data)
                        return;
                    that.liveChatChannel = data.liveChatChannel;
                    $(".load").hide();
                    $(".getChatSession").html(JSON.stringify(that.liveChatChannel) + "<br/>");
                    that.cmdQL.unsubscribe("getLiveChatChannel");
                    that.cmdQL.subscribe("getLiveChatMessages", [{ "liveChatMessageId": that.liveChatChannel.id }],
                        function (data) {
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
        }

        send(message) {
            let that = this;

            that.cmdQL.invoke("setLiveChatMessage", [{
                "id": that.cmdQL.newGuid(),
                "liveChatChannelId": that.liveChatChannel.id,
                "message": message,
                "userName": that.userName
            }], function (data) {
                that.cmdQL.subscribe("getLiveChatMessage", [{ "liveChatMessageId": data.liveChatMessage.id }],
                    function (data) {
                        that.cmdQL.unsubscribe("getLiveChatMessage", [{ "liveChatMessageId": data.liveChatMessage.id }]);
                    });
            });

            $(".chatMessages").append("me: " + message + "<br/>");
        }

        ping(data) {
            console.log(data);
            $(".ping").append(data + "<br/>");
        }
    }
}