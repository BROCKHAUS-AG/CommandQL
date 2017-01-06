using BAG.CommandQL.WebUI.Data;
using ChatSolution.Data.Entities;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace BAG.CommandQL.WebUI.Controllers.Hub
{

    public class CommandQLHandler
    {
        public CommandQLHandler(HttpContext context)
        {
            this.Context = context;
        }

        public HttpContext Context { get; set; }

        public ChangeGetApplicationUserResponse ChangeGetApplicationUser(ChangeGetApplicationUserRequest req)
        {
            //TODO: change user status!!!
            return null;
        }
        public GetGetApplicationUsersResponse GetApplicationUsers(GetGetApplicationUsersRequest req)
        {
            GetGetApplicationUsersResponse result = new GetGetApplicationUsersResponse();
            result.ApplicationUsers = DataContext.ApplicationUsers.FindAll(
                u =>
                    u.Group != null &&
                    u.Group.Id == req.GroupId
                    );
            return result;
        }

        public async Task<string> Ping(PingRequest req)
        {
            //Thread.Sleep(10);
            return await Task.FromResult(DateTime.Now.ToString());
        }

        public async Task<string> Echo(string msg)
        {
            return await Task.FromResult(msg);
        }

        [Description("Agents")]
        public SetLiveChatChannelResponse SetLiveChatChannel(SetLiveChatChannelRequest request)
        {
            var liveChatRequest = DataContext.LiveChatRequests.FirstOrDefault(s => s.Id == request.LiveChatRequestId);
            LiveChatChannel liveChatChannel = null;
            if (liveChatRequest != null)
            {
                //find user

                //add app user to channel
                liveChatChannel = new LiveChatChannel(
                    liveChatRequest,
                    new ChatSolution.Data.Entities.ApplicationUser()
                    {
                        Id = request.ApplicationUserId.ToString(),
                        UserName = "Agent Name"
                    });
                DataContext.LiveChatChannels.Add(liveChatChannel);
                DataContext.LiveChatRequests.Remove(liveChatRequest);
            }
            if (liveChatChannel != null)
            {
                return new SetLiveChatChannelResponse()
                {
                    LiveChatChannel = liveChatChannel,
                    LiveChatRequestId = liveChatRequest.Id
                };
            }
            return null;
        }

        [Description("Client")]
        public GetLiveChatChannelResponse GetLiveChatChannel(GetLiveChatChannelRequest request)
        {
            var liveChatChannel = DataContext.LiveChatChannels.FirstOrDefault(s => s.LiveChatRequestId == request.LiveChatRequestId);
            if (liveChatChannel != null)
                return new GetLiveChatChannelResponse() { LiveChatChannel = liveChatChannel };
            return null;
        }

        [Description("Agents")]
        public GetLiveChatChannelsResponse GetChatSessions(GetLiveChatChannelsRequest request)
        {
            var liveChatChannels = DataContext.LiveChatChannels.FindAll(cs => cs.ApplicationUserId == request.ApplicationUserId);
            var result = new GetLiveChatChannelsResponse();
            if (liveChatChannels != null && liveChatChannels.Count > 0)
            {
                result.LiveChatChannels.AddRange(liveChatChannels);
                return result;
            }
            return null;
        }


        [Description("Client+Agents")]
        public SetLiveChatMessageResponse SetLiveChatMessage(SetLiveChatMessageRequest request)
        {
            //request.LiveChatChannelId;
            var liveChatMessage = new LiveChatMessage()
            {
                LiveChatChannelId = request.LiveChatChannelId,
                Message = request.Message,
                SenderId = request.UserId,
                UserName = request.UserName,
            };
            DataContext.LiveChatMessages.Add(liveChatMessage);

            return new SetLiveChatMessageResponse() { LiveChatMessage = liveChatMessage };
        }

        [Description("Client+Agents")]
        public GetLiveChatMessageResponse GetLiveChatMessage(GetLiveChatMessageRequest request)
        {
            var liveChatMessage = DataContext.LiveChatMessages.FirstOrDefault(cs => cs.Id == request.LiveChatMessageId);
            if (liveChatMessage != null)
            {
                var result = new GetLiveChatMessageResponse();
                result.LiveChatMessage = liveChatMessage;
                return result;
            }
            return null;
        }

        [Description("Client+Agents")]
        public GetLiveChatMessagesResponse GetLiveChatMessages(GetLiveChatMessagesRequest request)
        {
            var liveChatMessages = DataContext.LiveChatMessages.FindAll(cs => cs.LiveChatChannelId == request.LiveChatChannelId);
            if (liveChatMessages != null || liveChatMessages.Count > 0)
            {
                var result = new GetLiveChatMessagesResponse();
                result.LiveChatMessages.AddRange(liveChatMessages);
                return result;
            }
            return null;
        }

        [Description("Client")]
        public SetLiveChatRequestResponse SetLiveChatRequest(SetLiveChatRequestRequest request)
        {
            var liveChatRequest = new LiveChatRequest()
            {
                Category = request.Category,
                CustomerNumber = request.CustomerNumber,
                Device = request.Device,
                Ip = request.Ip,
                Parameter = request.Parameter,
                Question = request.Question,
                Sender = request.Sender,
                Tag = request.Tag,
                UserAgent = request.UserAgent,
                UserId = request.UserId,
                UserName = request.UserName,
                Url = request.Url,
                Token = request.Token,
                //mandanten
                Scope = request.Scope,
                ReferenceId = request.ReferenceId
            };

            DataContext.LiveChatRequests.Add(liveChatRequest);
            return new SetLiveChatRequestResponse() { Id = liveChatRequest.Id };
        }

        [Description("Agents")]
        public GetLiveChatRequestsResponse GetLiveChatRequests(GetLiveChatRequestsRequest request)
        {
            GetLiveChatRequestsResponse result = new GetLiveChatRequestsResponse();
            result.LiveChatRequests = DataContext.LiveChatRequests.FindAll(r => r.ReferenceId == request.GroupId);
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

        private void CorrectMessageLength(LiveChatMessage message)
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

        private void CorrectIllegalStrings(LiveChatMessage message)  //SECURITY
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