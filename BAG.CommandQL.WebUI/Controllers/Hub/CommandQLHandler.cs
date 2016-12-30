using BAG.CommandQL.WebUI.Data;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{

    public class CommandQLHandler
    {
        public GetConsultantsResponse GetConsultants(GetConsultantsRequest req)
        {
            GetConsultantsResponse result = new GetConsultantsResponse();

            result.Users.Add(new ApplicationUser() { Name = "Matthias" });
            result.Users.Add(new ApplicationUser() { Name = "Guido" });
            result.Users.Add(new ApplicationUser() { Name = "Paul" });

            return result;
        }

        public async Task<string> Ping(PingRequest req)
        {
            return await Task.FromResult(DateTime.Now.ToString());
        }

        public async Task<string> Echo(string msg)
        {
            return await Task.FromResult(msg);
        }

        [Description("Agents")]
        public SetChatSessionResponse SetChatSession(SetChatSessionRequest request)
        {
            var chatRequest = DataContext.ChatRequests.FirstOrDefault(s => s.Id == request.ChatRequestId);
            ChatSession chatSession = null;
            if (chatRequest != null)
            {
                chatSession = new ChatSession()
                {
                    Id = chatRequest.Id,
                    Name = chatRequest.Name,
                    Question = chatRequest.Question,
                    Query = chatRequest.Query,
                    ApplicationUserId = request.ChatRequestId
                };
                DataContext.ChatSessions.Add(chatSession);
                DataContext.ChatRequests.Remove(chatRequest);
            }
            if (chatSession != null)
            {
                return new SetChatSessionResponse()
                {
                    ChatSession = chatSession,
                    ChatRequestId = chatRequest.Id
                };
            }
            return null;
        }

        [Description("Client")]
        public GetChatSessionResponse GetChatSession(GetChatSessionRequest request)
        {
            var chatSession = DataContext.ChatSessions.FirstOrDefault(s => s.Id == request.Id);
            if (chatSession != null)
                return new GetChatSessionResponse() { ChatSession = chatSession };
            return null;
        }

        [Description("Agents")]
        public GetChatSessionsResponse GetChatSessions(GetChatSessionsRequest request)
        {
            var chatSessions = DataContext.ChatSessions.FindAll(cs => cs.ApplicationUserId == request.ApplicationUserId);
            var result = new GetChatSessionsResponse();
            if (chatSessions != null && chatSessions.Count > 0)
            {
                result.ChatSessions.AddRange(chatSessions);
                return result;
            }
            return null;
        }


        [Description("Client+Agents")]
        public SetChatMessageResponse SetChatMessage(SetChatMessageRequest request)
        {
            var chatMessage = new ChatMessage()
            {
                Message = request.Message,
                SenderId = request.UserId
            };
            DataContext.ChatMessages.Add(chatMessage);

            return new SetChatMessageResponse() { ChatMessage = chatMessage };
        }

        [Description("Client+Agents")]
        public GetChatMessagesResponse GetChatMessages(GetChatMessagesRequest request)
        {
            var chatMessages = DataContext.ChatMessages.FindAll(cs => cs.ChatSessionId == request.ChatSessionId);
            if (chatMessages != null || chatMessages.Count > 0)
            {
                var result = new GetChatMessagesResponse();
                result.ChatMessages.AddRange(chatMessages);
                return result;
            }
            return null;
        }

        [Description("Client")]
        public SetChatRequestResponse SetChatRequest(SetChatRequestRequest request)
        {
            var chatRequest = new ChatRequest()
            {
                Name = request.Name,
                Query = request.Query,
                Agent = request.Agent,
                Question = request.Question
            };
            DataContext.ChatRequests.Add(chatRequest);
            return new SetChatRequestResponse() { Id = chatRequest.Id };
        }

        [Description("Agents")]
        public GetChatRequestsResponse GetChatRequests(GetChatRequestsRequest request)
        {
            GetChatRequestsResponse result = new GetChatRequestsResponse();
            result.Requests = DataContext.ChatRequests;
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