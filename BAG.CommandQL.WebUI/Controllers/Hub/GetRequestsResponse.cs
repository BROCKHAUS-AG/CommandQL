using BAG.CommandQL.WebUI.Data;
using System.Collections.Generic;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetRequestsResponse
    {
        public GetRequestsResponse()
        {
            Requests = new List<ChatRequest>();
        }

        public List<ChatRequest> Requests { get; set; }
    }
}