using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    ///     The request.
    /// </summary>
    public class LiveChatUser : IDbEntity
    {

        public LiveChatUser(LiveChatRequest request)
            : this()
        {
            this.Id = request.Id;
            this.Type = "customer";
            this.UserName = request.UserName;
        }

        public LiveChatUser(ApplicationUser user)
            : this()
        {
            this.Type = "agent";
            this.UserId = Guid.Parse(user.Id);
            this.UserName = user.UserName;
        }
        /// <summary>
        ///     Initializes a new instance of the <see cref="Request" /> class.
        /// </summary>
        public LiveChatUser()
        {
            Created = DateTime.Now;
            Updated = DateTime.Now;
            Id = Guid.NewGuid();
            Status = 1;
        }
        /// <summary>
        ///     Gets the request time.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        ///     Gets the request time.
        /// </summary>
        public DateTime Updated { get; set; }

        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }


        public Guid UserId { get; set; }

        /// <summary>
        ///     Gets or sets the customer name.
        /// </summary>
        [MaxLength(250)]
        public string UserName { get; set; }

        [MaxLength(250)]
        public string Type { get; set; }

        [MaxLength(1000)]
        public string Tag { get; set; }

        public int Status { get; set; }
    }
}