using BAG.CommandQL.WebUI.Data;
using ChatSolution.Data.Entities;
using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetLiveChatChannelResponse
    {
        public LiveChatChannel LiveChatChannel { get; set; }
        public Guid LiveChatRequestId { get; set; }
    }
}