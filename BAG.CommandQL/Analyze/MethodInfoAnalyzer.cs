using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analyze
{
    public class MethodInfoAnalyzer
    {
        public MethodInfoAnalyzer()
        {

        }

        public MethodInfoAnalyzer(MethodInfo mi)
        {
            this.Name = mi.Name;
            var parameters = mi.GetParameters();
            ReturnTypeFullName = mi.ReturnType.FullName;
            Parameters = new List<ParameterInfoAnalyzer>();
            foreach (var parameter in parameters)
            {
                Parameters.Add(new ParameterInfoAnalyzer(parameter));
            }
            ReturnTypeProperies = new List<PropertyInfoAnalyzer>();
            var properies = mi.ReturnType.GetProperties(BindingFlags.Public|BindingFlags.Instance);
            foreach (var property in properies)
            {
                ReturnTypeProperies.Add(new PropertyInfoAnalyzer(property));
            }

            ReturnTypeProperiesSample = new ExpandoObject() as IDictionary<string, Object>;

            ReturnTypeProperies.ForEach((p) =>
            {
                ((IDictionary<string, object>)ReturnTypeProperiesSample).Add(p.Name, p.PropertyTypeFullName);
            });

            
        }

        public string Name { get; set; }

        public string ReturnTypeFullName { get; set; }

        public List<PropertyInfoAnalyzer> ReturnTypeProperies { get; set; }

        public dynamic ReturnTypeProperiesSample { get; set; }

        public List<ParameterInfoAnalyzer> Parameters { get; set; }

    }
}
