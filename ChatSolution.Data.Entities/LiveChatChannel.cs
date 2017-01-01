using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    ///     The chat session.
    /// </summary>
    public class LiveChatChannel : IDbEntity, ILiveChatRequestData
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LiveChatChannel"/> class.
        /// </summary>
        /// <param name="request">
        /// The customer .
        /// </param>
        /// <param name="applicationUser">
        /// The consultant.
        /// </param>
        public LiveChatChannel(LiveChatRequest request, ApplicationUser applicationUser)
            : this()
        {
            Users.Add(new LiveChatUser(applicationUser));
            Users.Add(new LiveChatUser(request));

            this.LiveChatRequestId = request.Id;
            this.Category = request.Category;
            this.CustomerNumber = request.CustomerNumber;
            this.Device = request.Device;
            this.Ip = request.Ip;
            this.Parameter = request.Parameter;
            this.Question = request.Question;
            this.Sender = request.Sender;
            this.Tag = request.Tag;
            this.UserAgent = request.UserAgent;
            this.UserId = request.UserId;
            this.UserName = request.UserName;
            this.Url = request.Url;
            this.Token = request.Token;

            this.Scope = Entities.Scope.Group;
            if (applicationUser.Group == null)
            {
                Debug.Write("applicationUser.Group is null");
            }
            else
            {
                this.ReferenceId = applicationUser.Group.Id;
            }

            ApplicationUserId = Guid.Parse(applicationUser.Id);
            ApplicationUserName = applicationUser.UserName;
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="LiveChatChannel" /> class.
        /// </summary>
        public LiveChatChannel()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            Updated = DateTime.Now;
            Messages = new List<LiveChatMessage>();
            Users = new List<LiveChatUser>();
            Status = 1;
        }

        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the LiveChatRequestId.
        /// </summary>
        public Guid LiveChatRequestId { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<LiveChatMessage> Messages { get; set; }


        /// <summary>
        /// Gets or sets the users.
        /// </summary>
        public virtual IList<LiveChatUser> Users { get; set; }


        /// <summary>
        /// Gets or sets a value indicating whether is customer disconnected.
        /// </summary>
        public int Status { get; set; } //Success, Broken, Undefined

        public int UserStatus { get; set; }

        public DateTime Updated { get; set; }

        public int ApplicationUserStatus { get; set; }

        //ApplicationUser
        public Guid ApplicationUserId { get; set; }


        [MaxLength(250)]
        public string ApplicationUserName { get; set; }
        //Request
        public DateTime Created { get; set; }
        public Guid UserId { get; set; }
        [MaxLength(250)]
        public string UserName { get; set; }
        [MaxLength(4000)]
        public string Question { get; set; }
        [MaxLength(150)]
        public string Device { get; set; }
        [MaxLength(100)]
        public string Ip { get; set; }
        [MaxLength(250)]
        public string Category { get; set; }
        [MaxLength(100)]
        public string CustomerNumber { get; set; }
        [MaxLength(250)]
        public string Location { get; set; }
        [MaxLength(250)]
        public string Url { get; set; }
        [MaxLength(150)]
        public string Parameter { get; set; }
        [MaxLength(150)]
        public string Sender { get; set; }
        [MaxLength(1000)]
        public string Tag { get; set; }
        [MaxLength(500)]
        public string Token { get; set; }
        [MaxLength(450)]
        public string UserAgent { get; set; }

        public Scope Scope { get; set; }

        public Guid ReferenceId { get; set; }
    }
}