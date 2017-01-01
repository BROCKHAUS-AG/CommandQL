using System;
using ChatSolution.Data.Entities;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetLiveChatRequestRequest : ILiveChatRequestData
    {
        public string Category { get; set; }

        public DateTime Created { get; set; }

        public string CustomerNumber { get; set; }

        public string Device { get; set; }

        public string Ip { get; set; }

        public string Location { get; set; }

        public string Parameter { get; set; }

        public string Question { get; set; }

        public Guid ReferenceId { get; set; }

        public Scope Scope { get; set; }

        public string Sender { get; set; }

        public string Tag { get; set; }

        public string Token { get; set; }

        public string Url { get; set; }

        public string UserAgent { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; }
    }
}