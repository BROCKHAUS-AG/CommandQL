using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebSocket
{
    class CommandQLWebSocketConnection
    {
        public CommandQLWebSocketConnection(HttpContext _context)
        {
            Context = _context;
            Id = Guid.NewGuid();
        }

        public HttpContext Context { get; set; }

        public Guid Id { get; set; }
    }
}