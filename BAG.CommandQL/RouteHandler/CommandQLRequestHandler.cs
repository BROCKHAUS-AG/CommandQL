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
    class CommandQLRequestHandler : IHttpHandler
    {
        public CommandQLRequestHandler()
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
                if (context.IsWebSocketRequest && CommandQL.Configuration.SocketConfiguration.Enable)
                {
                    context.AcceptWebSocketRequest(new CommandQLWebSocketHandler(context));
                    return;
                }
                else
                {
                    if (context.Request.HttpMethod == "GET" && CommandQL.Configuration.EnableAnalyzer)
                    {
                        string result = JsonConvert.SerializeObject(CommandQL.HandlerInfos);

                        context.Response.ContentType = "application/json";
                        context.Response.Write(result);
                        return;
                    }
                    else if (context.Request.HttpMethod == "POST")
                    {
                        CommandQLRequest request = GetRequestObject(context);

                        if (request != null)
                        {
                            CommandQLResponse response = new CommandQLExecuter(context, CommandQL.CreateHandlerInstances(context)).Execute(request);

                            string result = JsonConvert.SerializeObject(response);

                            context.Response.ContentType = "application/json";
                            context.Response.Write(result);
                            return;
                        }
                        else
                        {
                            context.Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                            context.Response.Write("Error");
                        }
                    }
                }
            }

            context.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
            context.Response.Write("Not authorized");
        }

        public CommandQLRequest GetRequestObject(HttpContext context)
        {
            try
            {
                context.Request.InputStream.Seek(0, SeekOrigin.Begin);
                string requestString = new StreamReader(context.Request.InputStream).ReadToEnd();
                //IDictionary formData = ConvertQueryString(requestString);
                //string json = JsonConvert.SerializeObject(formData);
                return JsonConvert.DeserializeObject<CommandQLRequest>(requestString);
            }
            catch
            {
                return null;
            }
        }

        //private IDictionary ConvertQueryString(string sQry)
        //{
        //    string pattern = @"(?<Prop>[^[]+)(?:\[(?<Key>[^]]+)\])*=(?<Value>.*)";
        //    var qry = HttpUtility.UrlDecode(sQry);

        //    var re = new Regex(pattern);
        //    var dict = qry.Split(new[] { "?", "&" }, StringSplitOptions.RemoveEmptyEntries)
        //               .Select(s => re.Match(s)).Where(g => g.Success)
        //               .GroupBy(m => m.Groups["Prop"].Value)
        //               .ToDictionary<IGrouping<string, Match>, string, object>(
        //                    g => g.Key,
        //                    g => GetKey(g, 0));
        //    return dict;
        //}

        //private object GetKey(IGrouping<string, Match> grouping, int level)
        //{
        //    var count = grouping.FirstOrDefault().Groups["Key"].Captures.Count;
        //    if (count == level)
        //    {
        //        var gValue = grouping.Where(gr => gr.Success).FirstOrDefault();
        //        var value = gValue.Groups["Value"].Value;
        //        return value;
        //    }
        //    else
        //    {
        //        var result = grouping.Where(gr => gr.Success)
        //                .GroupBy(m => m.Groups["Key"].Captures[level].Value);

        //        IGrouping<string, Match> first = result.FirstOrDefault();

        //        if(first != null)
        //        {
        //            if(Int32.TryParse(first.Key, out int temp))
        //            {
        //                return result.Select(a => GetKey(a, level + 1));
        //            }
        //        }

        //        return result.ToDictionary<IGrouping<string, Match>, string, object>(
        //                        a => a.Key,
        //                        a => GetKey(a, level + 1));
        //    }
        //}
    }
}
