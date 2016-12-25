using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class Response
    {
        public Response()
        {
            Commands = new List<Command>();
            Errors = new List<string>();
        }

        public List<Command> Commands { get; set; }

        public List<string> Errors { get; set; }
    }
}
