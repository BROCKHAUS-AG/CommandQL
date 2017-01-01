using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace ChatSolution.Data.Entities
{
    /// <summary>
    ///     The support category.
    /// </summary>
    public class SupportCategory : IDbEntity, IScopable
    {
        /// <summary>
        ///     Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        ///     Gets or sets the title.
        /// </summary>
        [Required]
        [StringLength(30)]
        public string Title { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this support category is activated. 
        /// Only active categories should be accessible from the client.
        /// </summary>
        /// <value> true if this support category is activated, false if not. </value>
        public bool IsActivated { get; set; }

        /// <summary>
        ///     Gets or sets the application users.
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<ApplicationUser> ApplicationUsers { get; set; }


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