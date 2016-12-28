using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Data
{
    public static class DataContext
    {
        static DataContext()
        {
            ChatRequests = new List<ChatRequest>();
            ChatSessions = new List<ChatSession>();
            ChatMessages = new List<ChatMessage>();
        }
        public static List<ChatRequest> ChatRequests { get; set; }
        public static List<ChatSession> ChatSessions { get; set; }

        public static List<ChatMessage> ChatMessages { get; set; }
    }
}