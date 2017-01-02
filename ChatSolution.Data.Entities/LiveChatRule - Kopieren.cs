using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    /// The LiveChat File
    /// </summary>
    public class LiveChatFile : IDbEntity, IScopable
    {
                /// <summary>
        /// Initializes a new instance of the <see cref="LiveChatRule"/> class.
        /// </summary>
        public LiveChatFile()
        {
            Id = Guid.NewGuid();
        }

        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether is activated.
        /// </summary>
        public bool IsActivated { get; set; }

        /// <summary>
        /// Gets or sets the rule name.
        /// </summary>
        [MaxLength(250)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the data
        /// </summary>
        public byte[] Data { get; set; }
        
        /// <summary>
        /// Gets or sets the params
        /// </summary>
        [MaxLength(50)]
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the TagType
        /// </summary>
        [MaxLength(250)]
        public string TagType { get; set; }

        /// <summary>
        /// ets or sets the Tag
        /// </summary>
        [MaxLength(2000)]
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