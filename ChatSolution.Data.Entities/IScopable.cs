using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatSolution.Data.Entities
{
    public interface IScopable
    {
        Scope Scope { get; set; }
        Guid ReferenceId { get; set; }
    }

    public interface IKeyable
    {
        string Key { get; set; }
        
    }
    
}
