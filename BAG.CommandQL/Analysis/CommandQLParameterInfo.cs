using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analysis
{
    public class CommandQLParameterInfo
    {
        public CommandQLParameterInfo(ParameterInfo _parameterInfo)
        {
            Name = _parameterInfo.Name;

            ParameterType = _parameterInfo.ParameterType;
            ParameterTypeFullName = _parameterInfo.ParameterType.FullName;

            Properties = _parameterInfo.ParameterType.GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(prop => new CommandQLParameterPropertyInfo(prop)).ToList();
        }

        public string Name { get; set; }

        [JsonIgnore]
        public Type ParameterType { get; set; }

        public string ParameterTypeFullName { get; set; }

        public List<CommandQLParameterPropertyInfo> Properties { get; set; }

        //PropertySamples Missing
    }
}
