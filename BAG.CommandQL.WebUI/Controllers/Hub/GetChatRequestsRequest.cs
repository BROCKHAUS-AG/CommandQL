namespace BAG.CommandQL.WebUI.Controllers.Hub
{
    public class GetChatRequestsRequest
    {
        public string Name { get; set; }
        public string Agent { get; set; }
        public string Query { get; set; }
        public string Question { get; set; }
    }
}