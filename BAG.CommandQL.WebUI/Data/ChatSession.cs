using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Data
{
    public class ChatSession : ChatRequest
    {
        public ChatSession() : base()
        {
            History = new List<ChatMessage>();
            Id = Guid.NewGuid();
        }
        
        public Guid UserId { get; set; }
        public Guid ApplicationUserId { get; set; }

        public List<ChatMessage> History { get; set; }
    }
}