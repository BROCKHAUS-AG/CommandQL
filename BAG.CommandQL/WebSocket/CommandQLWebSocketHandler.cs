using BAG.CommandQL.Entities;
using Microsoft.Web.WebSockets;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Web;

namespace BAG.CommandQL.WebSocket
{
    class CommandQLWebSocketHandler : WebSocketHandler
    {
        public Guid Id { get; set; }

        public DateTime ConnectedOn { get; set; }

        public HttpContext Context { get; set; }

        public string ReferenceId { get; set; }

        public List<string> Subscriptions { get; set; }

        public CommandQLWebSocketHandler(HttpContext _context)
        {
            Context = _context;
            ConnectedOn = DateTime.UtcNow;
            Id = Guid.NewGuid();
            Subscriptions = new List<string>();
        }

        public override void OnOpen()
        {
            ReferenceId = WebSocketContext.QueryString["id"];
            CommandQLWebSocketStorage.clients.Add(this);
            //CommandQLWebSocketStorage.clients.Broadcast(" has connected");
        }

        public override void OnMessage(string message)
        {
            JToken json = JToken.Parse(message);
            string type = json.Value<String>("type");

            if (type == "execute")
            {
                CommandQLWebsocketExecuteRequest sendData = json.ToObject<CommandQLWebsocketExecuteRequest>();

                if (sendData.Data.Data != null)
                {
                    CommandQLResponse response = new CommandQLExecuter(Context, CommandQL.CreateHandlerInstances(Context)).Execute(sendData.Data.Data);

                    CommandQLWebsocketResponse wsResponse = new CommandQLWebsocketResponse()
                    {
                        Data = new CommandQLResponseSendData()
                        {
                            Id = sendData.Data.Id,
                            Data = response
                        },
                        Type = "executeResult"
                    };

                    string result = JsonConvert.SerializeObject(wsResponse, CommandQL.serializerSettings);
                    Send(result);
                }

                //CommandQLRequest request = sendData.Value<CommandQLRequest>("data");

                //string request = sendData.Value<string>("data");
            }

            //CommandQLWebSocketStorage.clients.Broadcast("Echo: " + message);
        }

        public override void OnClose()
        {
            CommandQLWebSocketStorage.clients.Remove(this);
            //CommandQLWebSocketStorage.clients.Broadcast("Has gone: ");
        }
    }
}