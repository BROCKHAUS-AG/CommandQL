using BAG.CommandQL.WebUI.Data;
using ChatSolution.Data.Entities;
using System;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetLiveChatRequestsResponse
    {
        public GetLiveChatRequestsResponse()
        {
            LiveChatRequests = new List<LiveChatRequest>();
        }

        public Guid Id { get; set; }

        public List<LiveChatRequest> LiveChatRequests { get; set; }
    }
}