using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analysis
{
    public class CommandQLParameterPropertyInfo
    {
        public CommandQLParameterPropertyInfo(PropertyInfo _propertyInfo)
        {
            Name = _propertyInfo.Name;
            PropertyTypeFullName = _propertyInfo.PropertyType.FullName;
            PropertyType = _propertyInfo.PropertyType;
        }

        [JsonIgnore]
        public Type PropertyType { get; set; }

        public string Name { get; set; }

        public string PropertyTypeFullName { get; set; }
    }
}
