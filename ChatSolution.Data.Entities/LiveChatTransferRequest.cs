using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{
    
    /// <summary>
    ///     The request.
    /// </summary>
    public class LiveChatTransferRequest : IDbEntity, IScopable
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="Request" /> class.
        /// </summary>
        public LiveChatTransferRequest()
        {
            Created = DateTime.Now;
            Id = Guid.NewGuid();
        }

        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        ///     Gets or sets the RequestTest.
        /// </summary>
        [MaxLength(1000)]
        public string RequestTest { get; set; }

        /// <summary>
        ///     Gets or sets the RequestTest.
        /// </summary>
        [MaxLength(1000)]
        public string ResponseTest { get; set; }

        /// <summary>
        ///     Gets the request time.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        ///     Gets or sets the  LiveChatChannelId
        /// </summary>
        public Guid LiveChatChannelId { get; set; }

        /// <summary>
        /// Gets or sets the status
        /// </summary>
        public int Status { get; set; }

        [MaxLength(150)]
        public string Parameter { get; set; }

        [MaxLength(1000)]
        public string Tag { get; set; }

        [MaxLength(500)]
        public string Token { get; set; }

        public Scope Scope
        {
            get;
            set;
        }

        public Guid ReferenceId
        {
            get;
            set;
        }
    }
}