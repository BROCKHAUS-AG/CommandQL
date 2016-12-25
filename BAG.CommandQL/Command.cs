using BAG.CommandQL.Interfaces;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class Command
    {
        public Command()
        {
            Parameters = new List<Parameter>();
            Errors = new List<string>();
        }
        public string Name { get; set; }


        public List<Parameter> Parameters { get; set; }
        public object Return { get; set; }
        public List<string> Errors { get; set; }
    }
}
