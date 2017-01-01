using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatSolution.Data.Entities
{
    public interface ILiveChatRequestData : IScopable
    {
        DateTime Created { get; set; }
        Guid UserId { get; set; }
        string UserName { get; set; }
        string Question { get; set; }
        string Device { get; set; }
        string Ip { get; set; }
        string Category { get; set; }
        string CustomerNumber { get; set; }
        string Location { get; set; }        
        string Url { get; set; }
        string Parameter { get; set; }
        string Sender { get; set; }
        string Tag { get; set; }
        string UserAgent { get; set; }
        string Token { get; set; }
    }
}
