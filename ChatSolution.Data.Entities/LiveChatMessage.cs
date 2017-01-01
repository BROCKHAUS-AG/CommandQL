using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Newtonsoft.Json;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    ///     The chat message.
    /// </summary>
    public class LiveChatMessage : IDbEntity
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ChatMessage" /> class.
        /// </summary>
        public LiveChatMessage()
        {
            Created = DateTime.Now;
            Updated = DateTime.Now;
            Id = Guid.NewGuid();
        }

        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        [MaxLength(250)]
        public string UserName { get; set; }

        /// <summary>
        ///     Gets or sets the chat session_ id.
        /// </summary>
        // ReSharper disable once InconsistentNaming
        [SuppressMessage("StyleCopPlus.StyleCopPlusRules", "SP0100:AdvancedNamingRules",
            Justification = "Reviewed. Suppression is OK here.")]
        [ForeignKey("LiveChatChannel")]
        public Guid LiveChatChannelId { get; set; }


        /// <summary>
        ///     Gets or sets the received time.
        /// </summary>
        [Column(Order = 0)]
        public DateTime Created { get; set; }

        [Column(Order = 1)]
        public DateTime Updated { get; set; }

        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        [MaxLength(250)]
        public string Type { get; set; }

        /// <summary>
        ///     Gets or sets the message.
        /// </summary>
        [MaxLength(5000)]
        public string Message { get; set; }

        /// <summary>
        ///     Gets or sets the sender.
        /// </summary>
        public Guid SenderId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether is from consultant.
        /// </summary>
        public bool IsFromConsultant { get; set; }


        /// <summary>
        /// Gets or sets the status.
        /// </summary>
        public int Status { get; set; }

        [MaxLength(1000)]
        public string Tag { get; set; }
    }
}