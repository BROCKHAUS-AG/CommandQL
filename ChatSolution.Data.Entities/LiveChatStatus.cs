using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{

    /// <summary>
    ///     The request.
    /// </summary>
    public enum LiveChatStatus
    {
        None,
        Enabled,
        Blur,
        Fokus,
        Close,
        Cancel
    }
}