using System;
using System.ComponentModel.DataAnnotations;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    /// The rule activation.
    /// </summary>
    public class LiveChatRule : IDbEntity, IScopable
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LiveChatRule"/> class.
        /// </summary>
        /// <param name="id">
        /// The id.
        /// </param>
        /// <param name="isActivated">
        /// The is activated.
        /// </param>
        /// <param name="ruleName">
        /// The rule name.
        /// </param>
        /// <param name="text">
        /// The text.
        /// </param>
        /// <param name="description">
        /// The description.
        /// </param>
        public LiveChatRule(bool isActivated, string name, string reasonText, string description)
            : this()
        {
            IsActivated = isActivated;
            Name = name;
            ReasonText = reasonText;
            Description = description;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="LiveChatRule"/> class.
        /// </summary>
        public LiveChatRule()
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
        /// Gets or sets the text
        /// </summary>
        [MaxLength(1000)]
        public string ReasonText { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        [MaxLength(2000)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets the params
        /// </summary>
        [MaxLength(250)]
        public string Params { get; set; }

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