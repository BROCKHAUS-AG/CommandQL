using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Data
{
    public class ChatMessage
    {
        public Guid Id { get; set; }

        public Guid ChatSessionId { get; set; }

        public Guid SenderId { get; set; }

        public bool IsFromConsultant { get; set; }

        public string Message { get; set; }

    }
}