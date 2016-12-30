using BAG.CommandQL.WebUI.Data;
using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetChatSessionResponse
    {
        public ChatSession ChatSession { get; set; }
        public Guid ChatRequestId { get; set; }
    }
}