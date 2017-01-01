using System;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    /// The DbEntity interface.
    /// </summary>
    public interface IDbEntity
    {
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        Guid Id { get; set; }
    }
}
