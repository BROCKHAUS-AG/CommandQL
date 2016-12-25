using BAG.CommandQL.Analyze;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public static class ReflectionExtensions
    {

    //    public static List<object> ToMethodInfoParameterList(this List<Parameter> parameters, MethodInfo mi)
    //    {
    //        List<object> result = new List<object>();
    //        var miAnalyser = new MethodInfoAnalyzer(mi);
    //        for (int i = 0; i < miAnalyser.Parameters.Count; i++)
    //        {
    //            var miap = miAnalyser.Parameters[i];

    //            if (parameters.Count > i)
    //            {
    //                var json = JsonConvert.SerializeObject(parameters[i]);
    //                var desObj = JsonConvert.DeserializeObject(json, miap.ParameterType);
    //                result.Add(desObj);
    //            }
    //            else
    //            {
    //                var obj = Activator.CreateInstance(miap.ParameterType);
    //                result.Add(obj);
    //            }
    //        }
    //        return result;
    //    }

    }
}
