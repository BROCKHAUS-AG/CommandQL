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
    public class CommandQLHandlerInfo
    {
        public CommandQLHandlerInfo(Type _handlerType)
        {
            HandlerType = _handlerType;
            Name = _handlerType.Name;
            FullName = _handlerType.FullName;
            AuthorizationInfo = "";
            DisplayName = Name;
            Description = "";

            Methods = _handlerType.GetMethods(BindingFlags.Public | BindingFlags.Instance).Where(m => !CommandQL.Configuration.IgnoreMethods.Contains(m.Name) && !m.IsSpecialName).Select(m => new CommandQLMethodInfo(m)).ToList();

            IEnumerable<Attribute> attributes = _handlerType.GetCustomAttributes();

            /*Auth*/
            IEnumerable<Attribute> authAttributes = attributes.Where(x => x.GetType().GetInterfaces().Contains(typeof(ICommandQLAuthorizeAttribute)));

            if (authAttributes.Any())
            {
                AuthorizeAttribute = (ICommandQLAuthorizeAttribute)authAttributes.LastOrDefault();

                if (AuthorizeAttribute.GetType() == typeof(CommandQLBasicAuthorizeAttribute))
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
        public Type HandlerType { get; set; }

        public string FullName { get; set; }

        public string Name { get; set; }

        public string DisplayName { get; set; }

        public string Description { get; set; }

        [JsonIgnore]
        public ICommandQLAuthorizeAttribute AuthorizeAttribute { get; set; }

        public string AuthorizationInfo { get; set; }

        public List<CommandQLMethodInfo> Methods { get; set; }
    }
}
