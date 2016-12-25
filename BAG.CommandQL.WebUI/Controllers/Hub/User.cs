using System;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Counter { get; set; }
        public string Status { get; set; }
    }
}