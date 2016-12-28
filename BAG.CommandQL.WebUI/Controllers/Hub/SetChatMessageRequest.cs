using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class SetChatMessageRequest
    {
        public SetChatMessageRequest()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }

        public string Message { get; set; }

        public Guid UserId { get; set; }

        public string Mandant { get; set; }
    }
}