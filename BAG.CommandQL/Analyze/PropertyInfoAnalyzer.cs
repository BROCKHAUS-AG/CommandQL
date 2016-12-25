using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analyze
{
    public class PropertyInfoAnalyzer
    {
        public PropertyInfoAnalyzer()
        {

        }

        public PropertyInfoAnalyzer(PropertyInfo pi)
        {
            Name = pi.Name;
            PropertyTypeFullName = pi.PropertyType.FullName;
        }
        public string Name { get; set; }
        public string PropertyTypeFullName { get; set; }
        
    }
}
