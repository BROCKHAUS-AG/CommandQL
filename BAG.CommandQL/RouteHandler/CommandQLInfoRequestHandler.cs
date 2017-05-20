using BAG.CommandQL.Analysis;
using BAG.CommandQL.Entities;
using BAG.CommandQL.WebSocket;
using Microsoft.Web.WebSockets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using System.Collections;
using System.Dynamic;

namespace BAG.CommandQL.RouteHandler
{
    class CommandQLInfoRequestHandler : IHttpHandler
    {
        public CommandQLInfoRequestHandler()
        {

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }



        public void ProcessRequest(HttpContext context)
        {
            if (CommandQL.Configuration.RequestCondition(context))
            {
                string data = JsonConvert.SerializeObject(CommandQL.Configuration);

                context.Response.ContentType = "application/json";
                context.Response.Write(data);
            }
            else
            {
                context.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
                context.Response.Write("Not authorized");
            }
        }
    }
}
