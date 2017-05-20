using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL.Infrastructure
{
    public class CommandQLHandlerBase
    {
        public CommandQLHandlerBase()
        {
            Context = HttpContext.Current;
        }

        public HttpContext Context { get; set; }
    }
}
