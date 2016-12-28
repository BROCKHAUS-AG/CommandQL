using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Data
{
    public class ChatRequest
    {
        public ChatRequest()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
        }
        public Guid Id { get; set; }

        public DateTime Created { get; set; }

        public string MandantName { get; set; }
        public string GroupName { get; set; }

        public string Name { get; set; }
        public string Agent { get; set; }
        public string Query { get; set; }

        public string Question { get; set; }



    }
}