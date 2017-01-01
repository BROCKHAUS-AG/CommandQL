using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatSolution.Data.Entities
{
    public class LiveChatServerConfiguration : IDbEntity
    {
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        [Key]
        public Guid Id { get; set; }

        [MaxLength(50)]
        public string Key { get; set; }

        [MaxLength(3500)]
        public string Value { get; set; }

        [MaxLength(50)]
        public string Type { get; set; }
        
        //Frontend | Backend | Both        
        public ServerType ServerType { get; set; }

        [MaxLength(1000)]
        public string Tag { get; set; }
    }

    // server.configuration
    // request.agent
    // rules.disabled = go to bot (bot name)
    // rules.text
    // override, take web.config
}
