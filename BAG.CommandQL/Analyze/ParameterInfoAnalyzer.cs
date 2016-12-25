using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace BAG.CommandQL.Analyze
{
    public class ParameterInfoAnalyzer
    {
        public ParameterInfoAnalyzer()
        {

        }

        public ParameterInfoAnalyzer(ParameterInfo pi)
        {
            Name = pi.Name;
            ParameterTypeFullName = pi.ParameterType.FullName;
            ParameterType = pi.ParameterType;



            var properties = pi.ParameterType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            Properties = new List<PropertyInfoAnalyzer>();
            foreach (var property in properties)
            {
                Properties.Add(new PropertyInfoAnalyzer(property));
            }

            PropertiesSample = new ExpandoObject() as IDictionary<string, Object>;

            Properties.ForEach((p) =>
            {
                ((IDictionary<string, object>)PropertiesSample).Add(p.Name, p.PropertyTypeFullName);
            });
        }


        public string Name { get; set; }

        [XmlIgnore]
        [JsonIgnore]
        public Type ParameterType { get; set; }
        public string ParameterTypeFullName { get; set; }

        public List<PropertyInfoAnalyzer> Properties { get; set; }
        public dynamic PropertiesSample { get; set; }
    }
}
