using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetConsultantsResponse
    {
        public GetConsultantsResponse()
        {
            Users = new List<ApplicationUser>();
        }
        public List<ApplicationUser> Users { get; set; }


    }
}