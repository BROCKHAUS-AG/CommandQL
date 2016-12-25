using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetAllConsultantsResponse
    {
        public GetAllConsultantsResponse()
        {
            Users = new List<User>();
        }
        public List<User> Users { get; set; }


    }
}