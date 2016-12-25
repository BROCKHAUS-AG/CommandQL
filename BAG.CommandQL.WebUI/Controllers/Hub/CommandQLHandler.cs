using BAG.CommandQL.WebUI.Data;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{

    public class CommandQLHandler
    {

        public GetAllConsultantsResponse GetAllConsultants(GetAllConsultantsRequest req)
        {
            GetAllConsultantsResponse result = new GetAllConsultantsResponse();
            result.Users.Add(new User() { Name = "Name" });
            return result;
        }

        public async Task<string> Ping(PingRequest req)
        {
            return DateTime.Now.ToString();
        }

        public string Echo(string msg)
        {
            return msg;
        }


        public void SetRequest(GetRequestsRequest request)
        {
            DataContext.Requests.Add(new ChatRequest()
            {
                Name = request.Name,
                Query = request.Query,
                Agent = request.Agent,
                Question = request.Question
            });
        }

        public GetRequestsResponse GetRequests(GetRequestsRequest request)
        {
            GetRequestsResponse result = new GetRequestsResponse();
            result.Requests = DataContext.Requests;
            return result;
        }

        //ChatSessionClose
        //RequestStatus
        //ChatSessionTransferRequest
        //ChatSessionTransferResponse
        //Send
        //MessageReceived

        //'newChatRequest',
        //'removeChatRequest',
        //'addMessage',
        //'consultantLoggedIn',
        //'consultantLoggedOut',
        //'chatSessionTransferRequested',
        //'chatSessionTransferResponded',
        //'chatSessionTransferHappend',
        //'customerDisconnected',
        //'chatSessionClosed',
        //'consultantStatusChanged',
        //'addChatSessionInfo',
        //'chatReconnected',
        //'echo',
        //'verifiedMessage',
        //'supportCategoriesUpdated',
        //'agentNameChanged',
        //'customerIsStillAlive',
        //'customerPossiblyDisconnected',
        //'consultantIsStillAlive',
        //'consultantPossiblyDisconnected',
        //'consultantDisconnected',
        //'customerDisconnected',
        //'receiveLifeSign',
        ////client
        //'requestAccepted',
        //'changeConsultantStatus',
        //'setConsultantData'


        //getRequests
        //setRequest 
        //changeRequest - requestAccepted
        //
        //setMessage
        //changeMessage - verifiedMessage
        //getMessages
        //
        //getConsultants
        //changeConsultant -consultantStatusChanged-setConsultantData-changeConsultantStatus
        //

        private void CorrectMessageLength(ChatMessage message)
        {
            int allowedLength = 10000;//WebConfiguration.MaxChatMessageLength;
            if (!String.IsNullOrWhiteSpace(message.Message))
            {
                if (message.Message.Length > allowedLength)
                    message.Message = message.Message.Substring(0, allowedLength);
            }
            else
            {
                message.Message = "";
            }
        }

        private void CorrectIllegalStrings(ChatMessage message)  //SECURITY
        {
            string[,] forbiddenRegex = new string[,] {
                        {"SCRIPT",@"</*(\s*|\+*?|\n*)*s(\+*?)*c(\+*?)*r(\+*?)*i(\+*?)*p(\+*?)*t.*?>"},
                        {"STYLE",@"</*(\s*|\+*?|\n*)*s(\+*?)*t(\+*?)*y(\+*?)*l(\+*?)*e.*?>"        },
                        {"LINK",@"</*(\s*|\+*?|\n*)*l(\+*?)*i(\+*?)*n(\+*?)*k.*?>"                },
                        {"IFRAME",@"</*(\s*|\+*?|\n*)*i(\+*?)*f(\+*?)*r(\+*?)*a(\+*?)*m(\+*?)*e.*?>"},
                        {"VIDEO",@"</*(\s*|\+*?|\n*)*v(\+*?)*i(\+*?)*d(\+*?)*e(\+*?)*o.*?>"        },
                        {"CANVAS",@"</*(\s*|\+*?|\n*)*c(\+*?)*a(\+*?)*n(\+*?)*v(\+*?)*a(\+*?)*s.*?>" }
                    };

            for (int i = 0; i < forbiddenRegex.GetLength(0); i++)
            {
                string replacement = "[" + forbiddenRegex[i, 0] + ": Verbotene Zeichenkombination]";
                Regex rgx = new Regex(forbiddenRegex[i, 1], RegexOptions.IgnoreCase);

                message.Message = rgx.Replace(message.Message, replacement);
            }
        }

        //QueryString _queryString = null;
        //public QueryString QueryString
        //{
        //    get
        //    {
        //        if (_queryString == null)
        //        {
        //            _queryString = new QueryString(HttpContext.Current.Request.QueryString);
        //        }
        //        return _queryString;
        //    }
        //}
    }
}