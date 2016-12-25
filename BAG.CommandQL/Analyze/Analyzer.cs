using BAG.CommandQL.Analyze;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analyze
{
    [Serializable]
    [DataContract]
    public class Analyzer
    {
        
        public Analyzer()
        {
        }

        public Analyzer(object obj)
        {
            Analyze(obj);
        }

        public void Analyze(object obj)
        {
            var ignoreMethods = new string[] {
            "ToString",
            "Equals",
            "GetHashCode",
            "GetType"};

            var type = obj.GetType();
            TypeName = type.Name;
            FullName = type.FullName;

            var methods = type.GetMethods(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
            Commands = new List<MethodInfoAnalyzer>();
            foreach (var method in methods)
            {
                if (ignoreMethods.Contains(method.Name))
                    continue;

                Commands.Add(new MethodInfoAnalyzer(method));
            }
        }

        [DataMember]
        public string FullName
        {
            get; set;
        }
        [DataMember]
        public string TypeName
        {
            get; set;
        }

        [DataMember]
        [Newtonsoft.Json.JsonProperty(PropertyName = "Commands")]
        public List<MethodInfoAnalyzer> Commands { get; set; }
    }
}
