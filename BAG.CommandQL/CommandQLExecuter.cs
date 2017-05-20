using BAG.CommandQL.Analysis;
using BAG.CommandQL.Entities;
using BAG.CommandQL.Helper;
using BAG.CommandQL.Infrastructure;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL
{
    public class CommandQLExecuter
    {
        private CommandQLHandlerBase[] Handlers { get; set; }

        private HttpContext Context { get; set; }

        public CommandQLExecuter(HttpContext _context, params CommandQLHandlerBase[] _handlers)
        {
            Context = _context;
            Handlers = _handlers;
        }

        public CommandQLResponse Execute(CommandQLRequest request)
        {
            Stopwatch executeWatch = new Stopwatch();
            executeWatch.Start();

            if(request.ExecuteParallel.HasValue && request.ExecuteParallel.Value == true)
            {
                Parallel.ForEach(request.Commands, ExecuteCommand);
            }
            else
            {
                foreach(CommandQLCommand cmd in request.Commands)
                {
                    ExecuteCommand(cmd);
                }
            }

            executeWatch.Stop();

            CommandQLResponse result = request.CreateResponse();
            result.T = executeWatch.ElapsedMilliseconds;
            return result;
        }
        
        public Task<CommandQLResponse> ExecuteAsync(CommandQLRequest request)
        {
            return Task.FromResult(Execute(request));
        }

        public void ExecuteCommand(CommandQLCommand cmd)
        {
            Stopwatch methodWatch = new Stopwatch();
            methodWatch.Start();

            string[] nameParts = cmd.Name.Split('.');

            CommandQLMethodInfo cQLmi = null;
            CommandQLHandlerInfo handlerInfo = null;

            if (nameParts.Length == 2)
            {
                handlerInfo = CommandQL.HandlerInfos.FirstOrDefault(hi => String.Equals(hi.Name, nameParts[0].AppendIfNotPresented("handler"), StringComparison.OrdinalIgnoreCase));

                if (handlerInfo != null)
                {
                    cQLmi = handlerInfo.Methods.FirstOrDefault(m => String.Equals(m.MethodInfo.Name, nameParts[1], StringComparison.OrdinalIgnoreCase));
                }
            }
            else if (nameParts.Length == 1 && Handlers.Length == 1)
            {
                handlerInfo = CommandQL.HandlerInfos.FirstOrDefault(hi => hi.HandlerType == Handlers[0].GetType());

                if (handlerInfo != null)
                {
                    cQLmi = handlerInfo.Methods.FirstOrDefault(m => String.Equals(m.MethodInfo.Name, nameParts[0], StringComparison.OrdinalIgnoreCase));
                }
            }
            else if (nameParts.Length == 1)
            {
                handlerInfo = CommandQL.HandlerInfos.FirstOrDefault(hi => hi.Methods.Any(m => String.Equals(m.MethodInfo.Name, nameParts[0], StringComparison.OrdinalIgnoreCase)));

                if (handlerInfo != null)
                {
                    cQLmi = handlerInfo.Methods.FirstOrDefault(m => String.Equals(m.MethodInfo.Name, nameParts[0], StringComparison.OrdinalIgnoreCase));
                }
            }

            if (handlerInfo != null && cQLmi != null)
            {
                MethodInfo mi = cQLmi.MethodInfo;

                if ((handlerInfo.AuthorizeAttribute == null || handlerInfo.AuthorizeAttribute.IsAuthorized(Context)) && cQLmi.AuthorizeAttribute == null || cQLmi.AuthorizeAttribute.IsAuthorized(Context))
                {
                    try
                    {
                        List<object> parameters = CreateParameters(cmd.Parameters, cQLmi);

                        CommandQLHandlerBase handlerClass = Handlers.FirstOrDefault(h => h.GetType() == handlerInfo.HandlerType);

                        if (handlerClass != null)
                        {

                            cmd.Return = mi.Invoke(handlerClass, parameters.ToArray());
                        }
                        else
                        {
                            cmd.Errors.Add(cmd.Name + " - A suitable handler-instance was not found");
                        }
                    }
                    catch (Exception ex)
                    {
                        cmd.Errors.Add(cmd.Name + " - " + ex.Message + " - " + ex.ToString());
                    }
                }
                else
                {
                    cmd.Errors.Add(cmd.Name + " - Not authorized to execute command");
                }
                
            }
            else
            {
                cmd.Errors.Add(cmd.Name + " - Command not found");
            }

            methodWatch.Stop();
            cmd.T = methodWatch.ElapsedMilliseconds;
        }

        public List<object> CreateParameters(/*List<CommandQLParameter> parameters*/ JToken parameters, CommandQLMethodInfo _methodInfo)
        {
            List<object> result = new List<object>();

            if(parameters.Type != JTokenType.Array)
            {
                CommandQLParameterInfo miap = _methodInfo.Parameters.FirstOrDefault();

                if(miap != null)
                {
                    result.Add(parameters.ToObject(miap.ParameterType));
                }

                for (int i = 1; i < _methodInfo.Parameters.Count; i++)
                {
                    miap = _methodInfo.Parameters[i];

                    if (miap.ParameterType.IsValueType)
                    {
                        result.Add(Activator.CreateInstance(miap.ParameterType));
                    }
                    else
                    {
                        result.Add(null);
                    }
                }
            }
            else
            {
                JToken[] arr = parameters.ToArray();

                for(int i = 0; i < _methodInfo.Parameters.Count; i++)
                {
                    CommandQLParameterInfo miap = _methodInfo.Parameters[i];

                    if (arr.Length > i)
                    {
                        result.Add(arr[i].ToObject(miap.ParameterType));
                    }
                    else
                    {
                        if (miap.ParameterType.IsValueType)
                        {
                            result.Add(Activator.CreateInstance(miap.ParameterType));
                        }
                        else
                        {
                            result.Add(null);
                        }
                    }
                }

                //for (int i = 0; i < _methodInfo.Parameters.Count; i++)
                //{
                //    CommandQLParameterInfo miap = _methodInfo.Parameters[i];

                //    //if (miap.ParameterType == typeof(string))
                //    //{
                //    //    //object value = parameters.
                //    //    object obj = Activator.CreateInstance(miap.ParameterType, string.Empty);
                //    //    result.Add(obj);
                //    //}
                //    //else if (miap.ParameterType == typeof(bool))
                //    //{


                //    //    object obj = Activator.CreateInstance(miap.ParameterType, )
                //    //}

                //    if (parameters.Count > i)
                //    {
                //        string json = JsonConvert.SerializeObject(parameters[i]);
                //        object desObj = JsonConvert.DeserializeObject(json, miap.ParameterType);
                //        result.Add(desObj);
                //    }
                //    else
                //    {
                //        if(miap.ParameterType == typeof(String))
                //        {
                //            result.Add("");
                //        }
                //        else
                //        {
                //            object obj = Activator.CreateInstance(miap.ParameterType);
                //            result.Add(obj);
                //        }
                //    }
                //}
            }

            return result;
        }
    }
}
