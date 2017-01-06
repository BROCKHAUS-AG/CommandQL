using Newtonsoft.Json;
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

        //Time-Durration ms
        public long T { get; set; }
    }

    //[JsonArray]
    //public class ListCommandQL: List<CommandQL> { }

    //[JsonArray]
    //public class ListString : List<string> { }
}
