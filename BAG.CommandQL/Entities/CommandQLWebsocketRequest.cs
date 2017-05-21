using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAG.CommandQL.Entities
{
    class CommandQLWebsocketExecuteRequest
    {
        public string Type { get; set; }

        public CommandQLRequestSendData Data { get; set; }

    }

    class CommandQLRequestSendData
    {
        public CommandQLRequest Data { get; set; }

        public string Id { get; set; }
    }
}
