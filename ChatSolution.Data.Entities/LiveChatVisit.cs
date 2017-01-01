using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{

    /// <summary>
    ///     The request.
    /// </summary>
    public class LiveChatVisit : IDbEntity, IScopable
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="Request" /> class.
        /// </summary>
        public LiveChatVisit()
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
        ///     Gets the request time.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        ///     Gets or sets the customer name.
        /// </summary>
        [MaxLength(450)]
        public string UserAgent { get; set; }

        /// <summary>
        ///     Gets or sets the customer name.
        /// </summary>
        [MaxLength(150)]
        public string Device { get; set; }

        /// <summary>
        ///     Gets or sets the ip address.
        /// </summary>
        [MaxLength(100)]
        public string Ip { get; set; }

        [MaxLength(250)]
        public string Location { get; set; }

        [MaxLength(250)]
        public string Url { get; set; }

        [MaxLength(150)]
        public string Sender { get; set; }

        [MaxLength(150)]
        public string Parameter { get; set; }

        [MaxLength(1000)]
        public string Tag { get; set; }

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