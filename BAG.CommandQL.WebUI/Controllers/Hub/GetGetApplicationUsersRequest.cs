using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetGetApplicationUsersRequest
    {        
        public Guid GroupId { get; set; }


        public bool? Online { get; set; }
    }
}