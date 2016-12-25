using BAG.CommandQL.Interfaces;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class Request
    {
        public Request()
        {
            Commands = new List<Command>();
        }

        public static Request FromJObject(JObject obj)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<BAG.CommandQL.Request>(json);
        }
        public bool? ExecuteParallel { get; set; }

        public string Sender { get; set; }

        public List<Command> Commands { get; set; }

        public Response CreateResponse()
        {
            var result = new Response();
            this.Commands.ForEach((cmd) =>
            {
                result.Commands.Add(new Command()
                {
                    Name = cmd.Name,
                    Errors = cmd.Errors,
                    Return = cmd.Return
                });
            });
            return result;
        }
    }
}
