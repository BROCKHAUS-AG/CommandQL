using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetLiveChatMessageRequest
    {
        public SetLiveChatMessageRequest()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }

        public Guid LiveChatChannelId { get; set; }

        public string Message { get; set; }

        public string UserName { get; set; }

        public Guid UserId { get; set; }

        public string Type { get; set; }
    }
}