using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetChatSessionRequest
    {
        public Guid ChatRequestId { get; set; }
        public Guid ApplicationUserId { get; set; }
    }
}