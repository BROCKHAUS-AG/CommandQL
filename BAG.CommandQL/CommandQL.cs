using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL
{
    public class CommandQL
    {
        public CommandQL()
        {
            Parameters = new List<ParameterQL>();
            Errors = new List<string>();
        }

        /// <summary>
        /// Command.Name = Handler.Method[Name]
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Handler.Method[Name](Parameters)
        /// </summary>
        public List<ParameterQL> Parameters { get; set; }
        /// <summary>
        /// Return Handler.Method[Name](Parameters)
        /// </summary>
        public object Return { get; set; }
        /// <summary>
        /// Exceptions
        /// </summary>
        public List<string> Errors { get; set; }


        public string Mandant { get; set; }

        public string Group { get; set; }

        public string User { get; set; }

        public string Channel { get; set; }

        //Time-Durration ms
        public long T { get; set; }
    }
}
