using BAG.CommandQL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace BAG.CommandQL.RouteHandler
{
    class CommandQLInfoRouteHandler : IRouteHandler
    {
        public CommandQLInfoRouteHandler()
        {

        }

        public IHttpHandler GetHttpHandler(RequestContext rContext)
        {
            return new CommandQLInfoRequestHandler();
        }
    }
}