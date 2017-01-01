using BAG.CommandQL.WebUI.Data;
using ChatSolution.Data.Entities;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetLiveChatChannelsResponse
    {
        public GetLiveChatChannelsResponse()
        {
            LiveChatChannels = new List<LiveChatChannel>();
        }
        public List<LiveChatChannel> LiveChatChannels { get; set; }
    }
}