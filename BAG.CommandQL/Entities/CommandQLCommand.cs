using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Entities
{
    public class CommandQLCommand
    {
        public CommandQLCommand()
        {
            Errors = new List<string>();
        }

        public string Id { get; set; }

        /// <summary>
        /// Command.Name = Handler.Method[Name]
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Handler.Method[Name](Parameters)
        /// </summary>
        //public List<CommandQLParameter> Parameters { get; set; }
        public JToken Parameters { get; set; }
            
        /// <summary>
        /// Return Handler.Method[Name](Parameters)
        /// </summary>
        public object Return { get; set; }
        /// <summary>
        /// Exceptions
        /// </summary>
        public List<string> Errors { get; set; }

        public long T { get; set; }
    }
}
