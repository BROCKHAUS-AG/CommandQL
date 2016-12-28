using BAG.CommandQL.WebUI.Data;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetChatMessagesResponse
    {
        public GetChatMessagesResponse()
        {
            ChatMessages = new List<ChatMessage>();
        }
        public List<ChatMessage> ChatMessages { get; set; }
    }
}