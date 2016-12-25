using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class ResponseQL
    {
        public ResponseQL()
        {
            Commands = new List<CommandQL>();
            Errors = new List<string>();
        }

        public List<CommandQL> Commands { get; set; }

        public List<string> Errors { get; set; }
    }
}
