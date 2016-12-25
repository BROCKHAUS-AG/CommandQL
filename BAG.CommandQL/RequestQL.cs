using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class RequestQL
    {
        public RequestQL()
        {
            Commands = new List<CommandQL>();
        }

        public static RequestQL FromJObject(JObject obj)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<BAG.CommandQL.RequestQL>(json);
        }

        public bool? ExecuteParallel { get; set; }

        public string Sender { get; set; }

        public List<CommandQL> Commands { get; set; }

        public ResponseQL CreateResponse()
        {
            var result = new ResponseQL();
            this.Commands.ForEach((cmd) =>
            {
                result.Commands.Add(new CommandQL()
                {
                    Name = cmd.Name,
#if DEBUG
                    Parameters = cmd.Parameters,
#endif
                    Errors = cmd.Errors,
                    Return = cmd.Return
                });
            });
            return result;
        }
    }
}
