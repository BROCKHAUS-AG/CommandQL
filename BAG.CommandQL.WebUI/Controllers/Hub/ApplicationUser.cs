using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class ApplicationUser
    {
        public ApplicationUser()
        {
            Id = Guid.NewGuid();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Counter { get; set; }
        public string Status { get; set; }
    }
}