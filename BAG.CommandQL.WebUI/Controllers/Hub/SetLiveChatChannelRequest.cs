using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetLiveChatChannelRequest
    {
        public Guid LiveChatRequestId { get; set; }
        public Guid ApplicationUserId { get; set; }
    }
}