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
            Requests = new List<ChatRequest>();
        }
        public static List<ChatRequest> Requests { get; set; }
    }
}