using ChatSolution.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetGetApplicationUsersResponse
    {
        public GetGetApplicationUsersResponse()
        {
            ApplicationUsers = new List<ApplicationUser>();
        }
        public List<ApplicationUser> ApplicationUsers { get; set; }


    }
}