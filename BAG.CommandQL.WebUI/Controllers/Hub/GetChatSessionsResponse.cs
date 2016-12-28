using BAG.CommandQL.WebUI.Data;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetChatSessionsResponse
    {
        public GetChatSessionsResponse()
        {
            ChatSessions = new List<ChatSession>();
        }
        public List<ChatSession> ChatSessions { get; set; }
    }
}