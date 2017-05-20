using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebSocket
{
    class CommandQLWebSocketList : ConcurrentDictionary<Guid, CommandQLWebSocketHandler>
    {
        public bool Add(CommandQLWebSocketHandler _socket)
        {
            return TryAdd(_socket.Id, _socket);
        }

        public bool Remove(CommandQLWebSocketHandler _socket)
        {
            return TryRemove(_socket.Id, out _socket);
        }

        public void Broadcast(string message)
        {
            foreach(KeyValuePair<Guid, CommandQLWebSocketHandler> socket in this)
            {
                socket.Value.Send(message);
            }
        }
    }
}