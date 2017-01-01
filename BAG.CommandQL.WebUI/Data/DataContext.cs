using ChatSolution.Data.Entities;
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
            LiveChatRequests = new List<LiveChatRequest>();
            LiveChatChannels = new List<LiveChatChannel>();
            LiveChatMessages = new List<LiveChatMessage>();
            ApplicationUsers = new List<ApplicationUser>();
            var group = new ChatSolution.Data.Entities.Group()
            {
                Id = Guid.Parse("B7D4E718-A900-4A19-8543-D5E28F57F431"),
                Name = "BAG"
            };
            ApplicationUsers.Add(new ChatSolution.Data.Entities.ApplicationUser()
            {
                UserName = "Matthias",
                Group = group
            });
            ApplicationUsers.Add(new ChatSolution.Data.Entities.ApplicationUser()
            {
                UserName = "Guido",
                Group = group
            });
            ApplicationUsers.Add(new ChatSolution.Data.Entities.ApplicationUser()
            {
                UserName = "Paul",
                Group = group
            });
        }
        public static List<ApplicationUser> ApplicationUsers { get; set; }
        public static List<LiveChatRequest> LiveChatRequests { get; set; }
        public static List<LiveChatChannel> LiveChatChannels { get; set; }
        public static List<LiveChatMessage> LiveChatMessages { get; set; }
    }
}