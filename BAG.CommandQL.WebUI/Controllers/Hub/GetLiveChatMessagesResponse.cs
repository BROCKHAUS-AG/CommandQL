using BAG.CommandQL.WebUI.Data;
using ChatSolution.Data.Entities;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetLiveChatMessagesResponse
    {
        public GetLiveChatMessagesResponse()
        {
            LiveChatMessages = new List<LiveChatMessage>();
        }
        public List<LiveChatMessage> LiveChatMessages { get; set; }
    }
}