using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BAG.CommandQL;
using BAG.CommandQL.Analyze;
using Newtonsoft.Json;
using System.Reflection;

namespace BAG.CommandQL.Execute
{
    public class Executer
    {
        public object Handler { get; set; }
        public Executer(object handler)
        {
            this.Handler = handler;
        }

        public async Task<ResponseQL> Execute(RequestQL request)
        {
            var type = Handler.GetType();
            var methods = type.GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            var globalDateTime = DateTime.Now;
            foreach (var cmd in request.Commands)
            {
                await Task.Run(() =>
                {
                    var durationDateTime = DateTime.Now;
                    var name = cmd.Name.ToLowerInvariant();
                    var mi = methods.FirstOrDefault(m => m.Name.ToLowerInvariant() == name);
                    if (mi != null)
                    {
                        try
                        {
                            var parameters = CreateParameters(cmd.Parameters, mi);
                            cmd.Return = mi.Invoke(Handler, parameters.ToArray());
                        }
                        catch (Exception ex)
                        {
                            cmd.Errors.Add(cmd.Name + " - " + ex.Message + " - " + ex.ToString());
                        }
                    }
                    else
                    {
                        cmd.Errors.Add(cmd.Name + " - Command not found");
                    }
                    cmd.T = (DateTime.Now-durationDateTime).Milliseconds;
                });
            }

            var result= request.CreateResponse();
            result.T = (DateTime.Now-globalDateTime).Milliseconds;
            return result;
        }     

        public List<object> CreateParameters(List<ParameterQL> parameters, MethodInfo mi)
        {
            List<object> result = new List<object>();
            var miAnalyser = new MethodInfoAnalyzer(mi);
            for (int i = 0; i < miAnalyser.Parameters.Count; i++)
            {
                var miap = miAnalyser.Parameters[i];

                if (parameters.Count > i)
                {
                    var json = JsonConvert.SerializeObject(parameters[i]);
                    var desObj = JsonConvert.DeserializeObject(json, miap.ParameterType);
                    result.Add(desObj);
                }
                else
                {
                    if (miap.ParameterType == typeof(string))
                    {
                        var obj = Activator.CreateInstance(miap.ParameterType, string.Empty);
                        //set value
                        result.Add(obj);
                    }
                    else
                    {
                        var obj = Activator.CreateInstance(miap.ParameterType);
                        result.Add(obj);
                    }
                }
            }
            return result;
        }
    }
}
