using BAG.CommandQL.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Analysis
{
    public class CommandQLMethodInfo
    {
        public CommandQLMethodInfo(MethodInfo _methodInfo)
        {
            MethodInfo = _methodInfo;
            Name = _methodInfo.Name;
            AuthorizationInfo = "";
            DisplayName = Name;
            Description = "";

            ReturnType = _methodInfo.ReturnType;
            ReturnTypeFullName = _methodInfo.ReturnType.FullName;

            Parameters = _methodInfo.GetParameters().Select(mi => new CommandQLParameterInfo(mi)).ToList();

            IEnumerable<Attribute> attributes = _methodInfo.GetCustomAttributes();

            /*Auth*/
            IEnumerable<Attribute> authAttributes = attributes.Where(x => x.GetType().GetInterfaces().Contains(typeof(ICommandQLAuthorizeAttribute)));

            if (authAttributes.Any())
            {
                AuthorizeAttribute = (ICommandQLAuthorizeAttribute)authAttributes.LastOrDefault();

                if(AuthorizeAttribute.GetType() == typeof(CommandQLBasicAuthorizeAttribute))
                {
                    AuthorizationInfo = String.Join(",", ((CommandQLBasicAuthorizeAttribute)AuthorizeAttribute).Roles);
                }
            }

            /*Description*/
            IEnumerable<Attribute> descriptionAttributes = attributes.Where(x => x.GetType() == typeof(DescriptionAttribute));

            if (descriptionAttributes.Any())
            {
                Description = ((DescriptionAttribute)descriptionAttributes.FirstOrDefault()).Description;
            }

            /*DisplayName*/
            IEnumerable<Attribute> displayNameAttributes = attributes.Where(x => x.GetType() == typeof(DisplayNameAttribute));

            if (displayNameAttributes.Any())
            {
                DisplayName = ((DisplayNameAttribute)displayNameAttributes.FirstOrDefault()).DisplayName;
            }
        }

        [JsonIgnore]
        public MethodInfo MethodInfo { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string Description { get; set; }

        [JsonIgnore]
        public Type ReturnType { get; set; }

        public string ReturnTypeFullName { get; set; }

        public string AuthorizationInfo { get; set; }

        [JsonIgnore]
        public ICommandQLAuthorizeAttribute AuthorizeAttribute { get; set; }

        public List<CommandQLParameterInfo> Parameters { get; set; }
    }
}
