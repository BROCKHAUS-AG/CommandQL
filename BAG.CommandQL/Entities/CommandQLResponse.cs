using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Entities
{
    public class CommandQLResponse
    {
        public CommandQLResponse()
        {
            Commands = new List<CommandQLCommand>();
            Errors = new List<string>();
        }

        
        public List<CommandQLCommand> Commands { get; set; }

        public List<string> Errors { get; set; }

        public long T { get; set; }

    }
}
