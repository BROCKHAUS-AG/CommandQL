using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Data
{
    public class ChatSession
    {
        public ChatSession()
        {
            History = new List<ChatMessage>();
        }
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public Guid ConsultantId { get; set; }

        public List<ChatMessage> History { get; set; }
    }
}