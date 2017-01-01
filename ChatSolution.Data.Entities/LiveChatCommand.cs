using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    ///     The chat session.
    /// </summary>
    public class LiveChatCommand : IDbEntity, IScopable
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LiveChatChannel" /> class.
        /// </summary>
        public LiveChatCommand()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            Updated = DateTime.Now;
            Status = 1;
        }

        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }



        /// <summary>
        /// Gets or sets a value indicating whether is customer disconnected.
        /// </summary>
        public int Status { get; set; } //Success, Broken, Undefined
        

        public DateTime Updated { get; set; }
        

        //ApplicationUserId
        public Guid ApplicationUserId { get; set; }

        //User
        public Guid UserId { get; set; }

        public DateTime Created { get; set; }

        [MaxLength(1000)]
        public string Text { get; set; }
        [MaxLength(150)]
        public string Command { get; set; }
        [MaxLength(2000)]
        public string Parameter { get; set; }
        [MaxLength(2000)]
        public string Return { get; set; }


        [MaxLength(150)]
        public string Sender { get; set; }
        [MaxLength(1000)]
        public string Tag { get; set; }
        [MaxLength(500)]
        public string Token { get; set; }

        public Scope Scope { get; set; }

        public Guid ReferenceId { get; set; }
    }
}