using Newtonsoft.Json;
using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL
{
    public class CommandQLConfiguration
    {
        public CommandQLConfiguration()
        {
            SocketConfiguration = new CommandQLSocketConfiguration();

            EnableAnalyzer = true;
            RequestCondition = x => true;
            Kernel = new StandardKernel();
            IgnoreMethods = new string[] { "ToString", "Equals", "GetHashCode", "GetType" };
        }

        [JsonIgnore]
        public Func<HttpContext, bool> RequestCondition { get; set; }

        [JsonIgnore]
        public string HandlerNamespace { get; set; }
        
        public bool EnableAnalyzer { get; set; }

        public CommandQLSocketConfiguration SocketConfiguration { get; set; }

        [JsonIgnore]
        public IKernel Kernel { get; set; }

        [JsonIgnore]
        public readonly string[] IgnoreMethods;
    }

    public class CommandQLSocketConfiguration
    {
        public CommandQLSocketConfiguration()
        {
            Enable = true;
            NotifySendObject = true;
            NotifyUseDatebase = false;
            NotifyStoreChanges = true;
        }

        public bool Enable { get; set; }

        public bool NotifySendObject { get; set; }

        public bool NotifyUseDatebase { get; set; }

        public bool NotifyStoreChanges { get; set; }
    }

    public class CommandQLTypeMapping
    {
        public Type Type { get; set; }

        public Func<string, object> ParseFunction { get; set; }
    }
}
