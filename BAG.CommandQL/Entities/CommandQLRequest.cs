using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Entities
{
    public class CommandQLRequest
    {
        public CommandQLRequest()
        {
            Commands = new List<CommandQLCommand>();
        }

        public static CommandQLRequest FromJObject(JObject obj)
        {
            var json = JsonConvert.SerializeObject(obj);
            json = json.Replace("[[", "[").Replace("]]", "]");
            return JsonConvert.DeserializeObject<CommandQLRequest>(json);
        }

        public bool? ExecuteParallel { get; set; }

        public string Sender { get; set; }

        public List<CommandQLCommand> Commands { get; set; }

        public CommandQLResponse CreateResponse()
        {
            var result = new CommandQLResponse();
            this.Commands.ForEach((cmd) =>
            {
                result.Commands.Add(new CommandQLCommand()
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
