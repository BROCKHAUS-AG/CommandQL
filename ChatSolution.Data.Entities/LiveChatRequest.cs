using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{
    
    /// <summary>
    ///     The request.
    /// </summary>
    public class LiveChatRequest : IDbEntity, ILiveChatRequestData
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="Request" /> class.
        /// </summary>
        public LiveChatRequest()
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
        ///     Gets or sets the question.
        /// </summary>
        [MaxLength(4000)]
        public string Question { get; set; }

        /// <summary>
        ///     Gets the request time.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        ///     Gets or sets the customer id.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        ///     Gets or sets the customer name.
        /// </summary>
        [MaxLength(250)]
        public string UserName { get; set; }

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

        [MaxLength(150)]
        public string Category { get; set; }

        [MaxLength(50)]
        public string CustomerNumber { get; set; }

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