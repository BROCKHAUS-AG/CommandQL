using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL.Infrastructure
{
    [AttributeUsage(AttributeTargets.Method|AttributeTargets.Class)]
    public class CommandQLBasicAuthorizeAttribute : Attribute, ICommandQLAuthorizeAttribute
    {
        public string[] Roles;

        public CommandQLBasicAuthorizeAttribute(params string[] roles)
        {
            if(roles.Length == 1)
            {
                roles = roles[0].Split(',');
            }

            Roles = roles;
        }

        public bool IsAuthorized(HttpContext context)
        {
            return context.User.Identity.IsAuthenticated && (Roles.Length == 0 || Roles.Any(r => context.User.IsInRole(r)));
        }
    }
}
