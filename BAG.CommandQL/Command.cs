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

        /// <summary>
        /// Command.Name = Handler.Method[Name]
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Handler.Method[Name](Parameters)
        /// </summary>
        public List<Parameter> Parameters { get; set; }
        /// <summary>
        /// Return Handler.Method[Name](Parameters)
        /// </summary>
        public object Return { get; set; }
        /// <summary>
        /// Exceptions
        /// </summary>
        public List<string> Errors { get; set; }
    }
}
