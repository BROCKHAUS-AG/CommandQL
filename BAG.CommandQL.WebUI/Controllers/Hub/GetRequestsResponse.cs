using BAG.CommandQL.WebUI.Data;
using System;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetChatRequestsResponse
    {
        public GetChatRequestsResponse()
        {
            Requests = new List<ChatRequest>();
        }

        public Guid Id { get; set; }

        public List<ChatRequest> Requests { get; set; }
    }
}