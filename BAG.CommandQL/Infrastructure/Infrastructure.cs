using BAG.CommandQL.Analysis;
using BAG.CommandQL.Entities;
using BAG.CommandQL.RouteHandler;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Routing;
using System.Web;
using System.Reflection;

namespace BAG.CommandQL.Infrastructure
{
    public static class Infrastructure
    {
        public static void RegisterCommandQL(this RouteCollection routes, CommandQLConfiguration config = null)
        {
            Assembly assembly = Assembly.GetCallingAssembly();

            if (config != null)
            {
                CommandQL.Configuration = config;

                if (String.IsNullOrEmpty(CommandQL.Configuration.HandlerNamespace))
                {
                    CommandQL.Configuration.HandlerNamespace = assembly.GetName().Name + ".Handlers";
                }
            }
            else
            {
                if (CommandQL.Configuration != null)
                {
                    CommandQL.Configuration.HandlerNamespace = assembly.GetName().Name + ".Handlers";
                }
                else
                {
                    CommandQL.Configuration = new CommandQLConfiguration()
                    {
                        HandlerNamespace = assembly.GetName().Name + ".Handlers"
                    };
                }
            }

            Type[] handlerTypes = assembly.DefinedTypes.Where(t => t.BaseType == typeof(CommandQLHandlerBase) && String.Equals(t.Namespace, CommandQL.Configuration.HandlerNamespace, StringComparison.OrdinalIgnoreCase)).ToArray();

            CommandQL.AnalyzeHandler(handlerTypes);

            foreach(Route r in routes.Where(r => r.GetType() == typeof(Route)))
            {
                r.Constraints.Add("controller", new CommandQLConstraint());
            }

            routes.Add("commandql", new Route("commandql", new CommandQLRouteHandler()));
            routes.Add("commandql/info", new Route("commandql/info", new CommandQLInfoRouteHandler()));
        }
    }

    class CommandQLConstraint : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {
            object value = values.Values.FirstOrDefault();
            return !String.Equals(value.ToString(), "commandql", StringComparison.OrdinalIgnoreCase);
        }
    }
}
