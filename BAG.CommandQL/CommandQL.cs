using BAG.CommandQL.Analysis;
using BAG.CommandQL.Entities;
using BAG.CommandQL.Infrastructure;
using BAG.CommandQL.WebSocket;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL
{
    public static class CommandQL
    {
        static CommandQL()
        {
            HandlerInfos = new List<CommandQLHandlerInfo>();
            Configuration = new CommandQLConfiguration();
        }

        public static CommandQLConfiguration Configuration { get; set; }

        public static List<CommandQLHandlerInfo> HandlerInfos { get; set; }

        public static List<CommandQLHandlerInfo> GetHandlerInfos(params CommandQLHandlerBase[] _handler)
        {
            return HandlerInfos.Where(hi => _handler.Select(h => h.GetType()).Contains(hi.HandlerType)).ToList();
        }

        public static List<CommandQLHandlerInfo> GetHandlerInfos(params Type[] _handlerTypes)
        {
            return HandlerInfos.Where(hi => _handlerTypes.Contains(hi.HandlerType)).ToList();
        }

        public static void AnalyzeHandler(params Type[] _handlerTypes)
        {
            foreach (Type t in _handlerTypes)
            {
                if (!HandlerInfos.Any(hi => hi.HandlerType == t))
                {
                    HandlerInfos.Add(new CommandQLHandlerInfo(t));
                }
            }
        }

        public static void SetNinjectKernel(IKernel _kernel)
        {
            Configuration.Kernel = _kernel;
        }

        public static CommandQLHandlerBase[] CreateHandlerInstances(HttpContext context)
        {
            return HandlerInfos.Select(h => {
                CommandQLHandlerBase handler = (CommandQLHandlerBase)Configuration.Kernel.Get(h.HandlerType);
                handler.Context = context;
                return handler;
            }).ToArray();
        }

        public static void Notify(string subscriptionName)
        {
            CommandQLNotification notification = new CommandQLNotification()
            {
                SubscriptionName = subscriptionName
            };

            string data = JsonConvert.SerializeObject(notification);

            IEnumerable<CommandQLWebSocketHandler> clients = CommandQLWebSocketStorage.clients
                .Where(c =>
                    c.Value.Subscriptions.Any(s =>
                        String.Equals(s, subscriptionName, StringComparison.OrdinalIgnoreCase)))
                .Select(c => c.Value);

            foreach (CommandQLWebSocketHandler client in clients)
            {
                client.Send(data);
            }
        }

        public static JsonSerializerSettings serializerSettings = new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}
