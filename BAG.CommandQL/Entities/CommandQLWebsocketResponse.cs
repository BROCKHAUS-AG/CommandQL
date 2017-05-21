using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Entities
{
    class CommandQLWebsocketResponse
    {
        public string Type { get; set; }

        public CommandQLResponseSendData Data { get; set; }
    }

    class CommandQLResponseSendData
    {
        public CommandQLResponse Data { get; set; }

        public string Id { get; set; }
    }
}
