using BAG.CommandQL.Analyze;

using BAG.CommandQL.WebUI.Controllers.Hub;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace BAG.CommandQL.WebUI.Controllers

{
    [RoutePrefix("api/CommandQL")]
    public class CommandQLController : ApiController
    {
        // GET api/<controller>
        public object Get()
        {
            return new Analyzer(new CommandQLHandler());
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<BAG.CommandQL.Response> Post(JObject obj)
        {
            BAG.CommandQL.Request request = BAG.CommandQL.Request.FromJObject(obj);
            BAG.CommandQL.Response response = null;
            if (request != null)
            {
                var exec = new BAG.CommandQL.Execute.Executer(new CommandQLHandler());
                response = await exec.Execute(request);
            }
            else
            {
                response = new Response();
                response.Errors.Add(new NullReferenceException().ToString());
            }
            return response;
        }



        //        public ResponseMessage Publish(RequestMessage msg)
        //        {
        //            var handler = msg.Handler.ToLowerInvariant();
        //            switch (handler)
        //            {
        //                case "chat":
        //                    return new HandlerChat(this, _unit).Publish(msg);
        //                case "system":
        //                    return new HandlerSystem(this, _unit).Publish(msg);
        //                case "cobrowsing":
        //                    return new HandlerCoBrowsing(this, _unit).Publish(msg);
        //                default:
        //                    break;
        //            }
        //            return null;
        //        }

    }

}






//using System;
//using System.Collections.Generic;
//using System.Data.Entity;
//using System.Linq;
//using System.Threading.Tasks;
//using System.Web;
//using ChatSolution.Data;
//using ChatSolution.Data.Entities;
//using ChatSolution.Data.Entities.SignalR;
//using ChatSolution.Data.Repositories;
//using ChatSolution.Web.Authorization;
//using ChatSolution.Web.Exceptions;
//using ChatSolution.Web.Extensions;
//using ChatSolution.Web.Hubs.ViewModels;
//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
//using Microsoft.AspNet.SignalR;
//using NLog;
//using System.Text.RegularExpressions;


//namespace ChatSolution.Web.Hubs
//{
//    public class ChatHub : Hub
//    {
//        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
//        private static DateTime LastOnlineCheckTime = DateTime.Now;
//        private readonly IUnitOfWork _unit;

//        private ApplicationUser _currentApplicationUser;
//        private ApplicationUser CurrentApplicationUser
//        {
//            get
//            {
//                if (_currentApplicationUser == null)
//                {
//                    _currentApplicationUser = ApplicationUser.GetCurrentApplicationUser(Context.User);
//                }
//                return _currentApplicationUser;
//            }
//        }

//        private string GetConnectionId()
//        {
//            return Context.ConnectionId;
//        }

//        private bool IsRequestingUserAConsultant()
//        {
//            bool isClient = GetRequestingClientId() != Guid.Empty;
//            bool isAuthenticated =
//                Context.User != null &&
//                Context.User.Identity != null &&
//                Context.User.Identity.IsAuthenticated;

//            return isAuthenticated && !isClient;
//        }

//        #region notify helper

//        private dynamic NotifyAllConsultants()
//        {
//            IQueryable<string> connectionIds =
//                from c in _unit.ConnectionManager.GetConnectedConsultants(Scope.Group, QueryString.GroupId)
//                select c.SignalRConnectionId;

//            return Clients.Clients(connectionIds.ToArray());
//        }

//        private dynamic NotifyAllConsultants(Scope scope, Guid referenceId)
//        {
//            IQueryable<string> connectionIds =
//                from c in _unit.ConnectionManager.GetConnectedConsultants(scope, referenceId)
//                select c.SignalRConnectionId;

//            return Clients.Clients(connectionIds.ToArray());
//        }

//        [Obsolete("use NotifyAllConsultants", false)]
//        private dynamic NotifyAllConsultantsExceptCurrentConsultant()
//        {
//            logger.Debug("Notify all consultants except id {0}", this.GetConnectionId());

//            IQueryable<string> connectionIds =
//                from c in _unit.ConnectionManager.GetConnectedConsultants()
//                where c.SignalRConnectionId != GetConnectionId()
//                select c.SignalRConnectionId;

//            return Clients.Clients(connectionIds.ToArray());
//        }

//        private dynamic NotifyUser(SignalRUser user)
//        {
//            logger.Debug("Notify user {0} with id {1}", user.UserName, user.Id);

//            IEnumerable<string> userConnections = _unit.ConnectionManager.GetConnectedConnectionIdsForUser(user);
//            return Clients.Clients(userConnections.ToArray());
//        }

//        [Obsolete("use NotifyUser", false)]
//        private dynamic NotifyOthersInChatSession(ChatSession chatSession)
//        {
//            SignalRUser consultant = _unit.UserRepository.GetById(chatSession.ConsultantSignalRUserId);
//            SignalRUser customer = _unit.UserRepository.GetById(chatSession.CustomerSignalRUserId);

//            logger.Trace("Notify other in chat session {0}", chatSession.Id);

//            IEnumerable<string> consultantConnectionIds = consultant == null
//                ? Enumerable.Empty<string>()
//                : _unit.ConnectionManager.GetConnectedConnectionIdsForUser(consultant) ?? Enumerable.Empty<string>();

//            IEnumerable<string> costumerConnectionIds = customer == null
//                ? Enumerable.Empty<string>()
//                : _unit.ConnectionManager.GetConnectedConnectionIdsForUser(customer) ?? Enumerable.Empty<string>();

//            List<string> chatSessionConnectionIds = consultantConnectionIds.Concat(costumerConnectionIds).ToList();
//            chatSessionConnectionIds.RemoveAll(conId => conId == GetConnectionId());

//            if (chatSessionConnectionIds.Any())
//            {
//                logger.Trace("NotifyOthersInChatSession-ChatSessionIds:" +
//                             chatSessionConnectionIds.Aggregate((a, b) => a + "," + b));
//            }
//            else
//            {
//                logger.Info("NotifyOthersInChatSession-ChatSessionIds: 0 elements");
//            }

//            return Clients.Clients(chatSessionConnectionIds);
//        }

//        #endregion



//        QueryString _queryString = null;
//        public QueryString QueryString
//        {
//            get
//            {
//                if (_queryString == null)
//                {
//                    _queryString = new QueryString(Context);
//                }
//                return _queryString;
//            }
//        }


//        private Guid GetRequestingClientId()
//        {
//            Guid clientId;
//            Guid.TryParse(Context.QueryString["client[id]"], out clientId);
//            return clientId;
//        }

//        private void ClearRequests()
//        {

//            IEnumerable<Request> oldRequests = _unit.RequestRepository.Get(c => (Math.Abs(DbFunctions.DiffMinutes(DateTimeOffset.Now, c.RequestTime) ?? 0) > WebConfiguration.RequestTimeOut.TotalMinutes));

//            logger.Debug("Deleting {0} old requests", oldRequests.Count());

//            var oldRequestList = oldRequests as IList<Request> ?? oldRequests.ToList();
//            if (oldRequestList.Any())
//            {
//                _unit.RequestRepository.DeleteRange(oldRequestList);

//                foreach (Request oldRequest in oldRequestList)
//                {
//                    logger.Debug("Notify all consultants: remove request {0}", oldRequest.Id);
//                    var user = new GenericRepository<SignalRUser>(new ApplicationDbContext()).GetById(oldRequest.SignalRCustomerId);
//                    NotifyAllConsultants().RemoveChatRequest(oldRequest.Id);
//                    NotifyUser(user).RequestClosed(oldRequest);
//                }
//            }
//        }

//        /// <summary>
//        /// Initializes a new instance of the <see cref="ChatHub"/> class.
//        /// </summary>
//        /// <param name="unit">
//        /// The unit of work.
//        /// </param>
//        public ChatHub(IUnitOfWork unit)
//        {
//            logger.Trace("ChatHub initialized");
//            _unit = unit;
//        }



//        //SECURITY:-> Nur der CurrentCOnsultant darf ChatSession manipulieren
//        private bool IsMySignalRConnection(Guid signalRUserId)
//        {
//            // TODO: LL also rethink about this 
//            //if (signalRUserId == Guid.Empty)
//            //    return false;

//            //if (Context == null || Context.Request == null || Context.Request.User == null || Context.Request.User.Identity == null || String.IsNullOrWhiteSpace(Context.Request.User.Identity.Name))
//            //{
//            //    logger.Warn("SECURITY(ChatHub): Context.Request.User.Identity.Name is not set for signalRConnection affinity check (associated signalRUserId: {0})", signalRUserId);
//            //    return false;
//            //}

//            //SignalRUser consultantSignalRUser = _unit.UserRepository.GetById(signalRUserId); //Den SignalR User hollen
//            //if (consultantSignalRUser != null)
//            //{
//            //    if (consultantSignalRUser.IdentityName != Context.Request.User.Identity.Name) //SECURITY:-> Ich darf nur meinen Status ändern
//            //    {
//            //        logger.Warn("SECURITY(ChatHub): someone is trying to manipulate data by SignalRUSerId that does not belongs to him (signalRUserId: {0} -> ctxUser {1})", signalRUserId, Context.Request.User.Identity.Name);
//            //        return false;
//            //    }
//            //}
//            //else
//            //{
//            //    logger.Warn("SECURITY(ChatHub): signalRUser not found for signalRConnection affinity check (associated signalRUserId: {0})", signalRUserId);
//            //    return false;
//            //}

//            return true;
//        }

//        //SECURITY:-> Nur der CurrentCOnsultant darf ChatSession manipulieren
//        private bool IsMyChatSession(Guid chatSessionId)
//        {
//            // TODO: LL 24.07.2015 rethink about this logic as it disabled the customer to send messages.
//            return true;
//            //if (chatSessionId == Guid.Empty)
//            //    return false;

//            //// TODO: LL 24.07.2015 on nlb, this prevents the customer from sending messages!
//            ////if (Context == null || Context.Request == null || Context.Request.User == null || Context.Request.User.Identity == null || String.IsNullOrWhiteSpace(Context.Request.User.Identity.Name))
//            ////{
//            ////    logger.Warn("SECURITY(ChatHub): Context.Request.User.Identity.Name is not set for a task associated with chatSession (associated chatSessionId: {0})", chatSessionId);
//            ////    return false;
//            ////}

//            //var chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            //if (chatSession == null)
//            //{
//            //    logger.Warn("SECURITY(ChatHub): chatSession with delivered chatSessionId not found in the database (associated chatSessionId: {0})", chatSessionId);
//            //    return false;
//            //}

//            //var targetSignalRConnection = _unit.SignalRConnectionRepository.Get(s => s.ConnectionSignalRUser.Id == chatSession.ConsultantSignalRUserId).FirstOrDefault(); //Get signalR target connection
//            //if (targetSignalRConnection != null)// target found
//            //{
//            //    // TODO: LL this also prevents the customer from sending messages as 'associatedUser.UserName != Context.Request.User.Identity.Name'
//            //    //var associatedUser = _unit.ApplicationUserRepository.Get(u => u.Id == targetSignalRConnection.ConnectionSignalRUser.UserId.ToString()).FirstOrDefault(); //Get user accociated with target signalR connection
//            //    //if (associatedUser != null)
//            //    //{
//            //    //    //check if associated user is the caller of the function
//            //    //    if (associatedUser.UserName != Context.Request.User.Identity.Name)
//            //    //    {
//            //    //        logger.Warn("SECURITY(ChatHub): someone is trying to manipulate a chatsession that not belongs to him (associatedUser: {0} -> ctxUser {1})", associatedUser.UserName, Context.Request.User.Identity.Name);
//            //    //        return false;
//            //    //    }
//            //    //}
//            //    //else //associated user not found
//            //    //{
//            //    //    logger.Warn("SECURITY(ChatHub): no user was found for SignalR connection (associated chatSessionId: {0}, SignalRId user {1})", chatSessionId, targetSignalRConnection.Id);
//            //    //    return false;
//            //    //}

//            //}
//            //else  //connection not found
//            //{
//            //    logger.Warn("SECURITY(ChatHub): no signalR connection was found for current consultant for chatSession (associated chatSessionId: {0}, IdentityName: {1})", chatSessionId, Context.Request.User.Identity.Name);
//            //    return false;
//            //}


//            //return true;
//        }




//        #region Lifetime Events
//        #region Inherited Hub Methods
//        /// <summary>
//        ///     The method which is called if a new connection is accepted.
//        /// </summary>
//        /// <returns>
//        ///     The <see cref="Task" /> returned by the base class <see cref="Hub" />.
//        /// </returns>
//        public override Task OnConnected()
//        {
//            string connectionId = GetConnectionId();
//            Guid clientId = GetRequestingClientId();
//            string identityName = CurrentApplicationUser.UserName;
//            bool isConsultant = IsRequestingUserAConsultant();

//            logger.Debug("Hub event 'OnConnected' for (ConnId: {0}, ClientId: {1}, IdentName: {2}, DispName: {3}, Consultant: {4}", connectionId, clientId, identityName, CurrentApplicationUser.Displayname, isConsultant);


//            Guid groupId = Guid.Empty;
//            if (isConsultant && CurrentApplicationUser.Group != null)
//            {
//                groupId = CurrentApplicationUser.Group.Id;
//            }

//            // TODO: WHY?
//            ClearRequests();

//            SignalRUser signalrUser = _unit.ConnectionManager.RevalidateOnConnect(
//                clientId, connectionId, identityName, CurrentApplicationUser.Displayname, isConsultant, groupId, CurrentApplicationUser);

//            if (isConsultant)
//            {
//                HandleConsultantConnected(signalrUser);
//            }
//            else
//            {
//                HandleCustomerConnected(signalrUser);
//            }

//            return base.OnConnected();
//        }

//        /// <summary>
//        /// The method which is called if a closed connection is opened.
//        /// </summary>
//        /// <param name="stopCalled">
//        /// A flag indicating if disconnect was triggered by a "graceful close".
//        /// Will return true if the Connection was cloed explicitly (e.g. by calling Stop() or closing the Browser Window)
//        /// Will return false if the Connection Timed out.
//        /// For more information see: 
//        /// https://github.com/SignalR/SignalR/releases/tag/2.1.0
//        /// https://github.com/SignalR/SignalR/issues/3115
//        /// </param>
//        /// <returns>
//        /// The <see cref="Task"/> returned by the base class <see cref="Hub"/>.
//        /// </returns>
//        public override Task OnDisconnected(bool stopCalled)
//        {
//            string connectionId = GetConnectionId();
//            DisconnectResult disconnectResult = _unit.ConnectionManager.RevalidateOnDisconnect(connectionId);
//            if (IsRequestingUserAConsultant())
//            {
//                SignalRUser signalrUser = _unit.ConnectionManager.GetConsultantSignalRUserByConnectionId(connectionId);
//                if (signalrUser != null)
//                {

//                    logger.Debug("User disconnected. Name: '{0}', Graceful Close: '{1}'", signalrUser.IdentityName, stopCalled);

//                    if (stopCalled)
//                    {
//                        HandleSelfInitializedConsultantDisconnected(disconnectResult);
//                    }
//                    else
//                    {
//                        HandlePossibleConsultantDisconnect(disconnectResult);
//                    }
//                }
//                else
//                {
//                    if (stopCalled)
//                    {
//                        HandleCustomerDisconnect(disconnectResult);
//                    }
//                    else
//                    {
//                        HandlePossibleCustomerDisconnect(disconnectResult);
//                    }
//                }
//            }
//            else
//            {
//                logger.Warn("Disconnect User, but no user found! ConnectionId: '{0}'", connectionId);
//            }

//            return base.OnDisconnected(stopCalled);
//        }

//        public override Task OnReconnected()
//        {
//            ReceiveLifeSign();
//            return base.OnReconnected();
//        }
//        #endregion
//        public void ReceiveLifeSign()
//        {
//            string connectionId = GetConnectionId();
//            Guid clientId = GetRequestingClientId();
//            string identityName = CurrentApplicationUser.UserName;
//            string displayName = CurrentApplicationUser.Displayname;
//            bool isConsultant = IsRequestingUserAConsultant();

//            logger.Trace("Hub event 'Receive Life Sign' for (ConnId: {0}, ClientId: {1}, IdentName: {2}, DispName: {3}, Consultant: {4}", connectionId, clientId, identityName, displayName, isConsultant);
//            SignalRUser signalrUser;

//            if (isConsultant)
//            {
//                signalrUser = _unit.ConnectionManager.RevalidateOnConnect(clientId, connectionId, identityName, displayName, isConsultant, CurrentApplicationUser.Group.Id, CurrentApplicationUser);
//            }
//            else
//            {
//                signalrUser = _unit.ConnectionManager.RevalidateOnConnect(clientId, connectionId, identityName, displayName, isConsultant, CurrentApplicationUser);
//            }
//            IEnumerable<ChatSession> chatSessions = _unit.ChatSessionRepository.Get(session => (session.ConsultantSignalRUserId == signalrUser.Id || session.CustomerSignalRUserId == signalrUser.Id) && !session.IsSessionClosed);

//            if (IsRequestingUserAConsultant())
//            {
//                NotifyAllConsultants().ConsultantIsStillAlive(new
//                {
//                    signalrUser.Id,
//                    signalrUser.StatusId
//                });

//                foreach (ChatSession chatSession in chatSessions)
//                {
//                    NotifyOthersInChatSession(chatSession).ConsultantIsStillAlive();
//                    ResendUnverifiedMessagesInChatSessionOnConnect(chatSession);
//                }
//            }
//            else
//            {
//                foreach (ChatSession chatSession in chatSessions)
//                {
//                    NotifyOthersInChatSession(chatSession).CustomerIsStillAlive();
//                    ResendUnverifiedMessagesInChatSessionOnConnect(chatSession);
//                    NotifyAllConsultantsExceptCurrentConsultant().AddChatSessionInfo(chatSession.Id, chatSession.ConsultantSignalRUserId);
//                }
//            }
//        }

//        private void HandleConsultantConnected(SignalRUser signalrUser)
//        {
//            logger.Debug("Notify all consultants: consultant logged in (Id: {0}, Name: {1})", signalrUser.Id, CurrentApplicationUser.Displayname);
//            NotifyAllConsultants().ConsultantLoggedIn(new
//            {
//                Id = signalrUser.Id,
//                UserName = CurrentApplicationUser.Displayname,
//                StatusId = signalrUser.StatusId,
//                UserId = signalrUser.UserId
//            });

//            IEnumerable<ChatSession> chatSessions = _unit.ChatSessionRepository.Get(c => c.ConsultantSignalRUserId == signalrUser.Id && !c.IsSessionClosed);
//            foreach (var chatSession in chatSessions)
//            {
//                NotifyOthersInChatSession(chatSession).ChatReconnected();
//                ResendUnverifiedMessagesInChatSessionOnConnect(chatSession);
//            }
//        }

//        private void HandleCustomerConnected(SignalRUser signalrUser)
//        {
//            IEnumerable<ChatSession> chatSessions = _unit.ChatSessionRepository.Get(c => c.CustomerSignalRUserId == signalrUser.Id && !c.IsSessionClosed,
//                    includeProperties: "CurrentMediaItem");

//            foreach (var chatSession in chatSessions)
//            {
//                NotifyOthersInChatSession(chatSession).AddMessage(new ChatMessage
//                {
//                    ChatSession_Id = chatSession.Id,
//                    IsFromConsultant = false,
//                    MessageType = "customerReconnected",
//                });
//                ResendUnverifiedMessagesInChatSessionOnConnect(chatSession);

//                if (chatSession.CurrentMediaItem != null)
//                {
//                    Clients.Caller
//                        .Send(new ChatMessage() { MessageType = "mediaAsset", Message = chatSession.CurrentMediaItem.Path });
//                }
//            }
//        }

//        private void LogLifetime(SignalRUser signalrUser, IEnumerable<ChatSession> chatSessions)
//        {
//            if (WebConfiguration.SignalRServersideLifetimeEventLogging)
//            {
//                Clients.All.LifetimeDebugLog(new ResponseMessage()
//                {
//                    Cmd = "LifetimeDebugLog",
//                    Handler = "System",
//                    Tag = new DataDebug()
//                    {
//                        Timestamp = DateTime.Now,
//                        CurrentConnectionId = GetConnectionId(),
//                        IsConsultant = IsRequestingUserAConsultant(),
//                        SignalRUser = signalrUser,
//                        ChatSessions = chatSessions
//                    }
//                });
//            }
//        }

//        private void HandleSelfInitializedConsultantDisconnected(DisconnectResult disconnectResult)
//        {
//            if (disconnectResult.DisconnectedUser != null)
//            {
//                logger.Info("Notify all consultants: consultant logged out '{0}':'{1}'", disconnectResult.DisconnectedUser.Id, disconnectResult.DisconnectedUser.IdentityName);
//                NotifyAllConsultants().ConsultantLoggedOut(new
//                {
//                    disconnectResult.DisconnectedUser
//                });

//                var chatSessions = _unit.ChatSessionRepository.Get(
//                    c => c.ConsultantSignalRUserId == disconnectResult.DisconnectedUser.Id && !c.IsSessionClosed);
//                foreach (var chatSession in chatSessions)
//                {
//                    NotifyOthersInChatSession(chatSession).ConsultantDisconnected();
//                }
//            }
//        }

//        private void HandlePossibleConsultantDisconnect(DisconnectResult disconnectResult)
//        {
//            logger.Info("Notify all consultants: consultant possibly disconnected: signalR-Id:'{0}' --- database-Id:'{1}' --- identityname:'{2}'", disconnectResult.DisconnectedUser.Id, disconnectResult.DisconnectedUser.UserId, disconnectResult.DisconnectedUser.IdentityName);
//            NotifyAllConsultants().ConsultantPossiblyDisconnected(new
//            {
//                disconnectResult.DisconnectedUser
//            });

//            var chatSessions = _unit.ChatSessionRepository.Get(
//                c => c.ConsultantSignalRUserId == disconnectResult.DisconnectedUser.Id && !c.IsSessionClosed);
//            foreach (var chatSession in chatSessions)
//            {
//                NotifyOthersInChatSession(chatSession).ConsultantPossiblyDisconnected();
//            }
//        }

//        private void HandlePossibleCustomerDisconnect(DisconnectResult disconnectResult)
//        {
//            foreach (ChatSession closedChatSession in disconnectResult.ClosedChatSessions)
//            {
//                logger.Info("Notify customer possibly disconnected for chat {0}", closedChatSession.Id);
//                NotifyOthersInChatSession(closedChatSession).CustomerPossiblyDisconnected(closedChatSession.Id);
//                NotifyAllConsultants().CustomerPossiblyDisconnected(closedChatSession.Id);
//            }
//        }

//        private void HandleCustomerDisconnect(DisconnectResult disconnectResult)
//        {
//            foreach (ChatSession closedChatSession in disconnectResult.ClosedChatSessions)
//            {
//                logger.Info("Notify customer disconnected for chat {0}", closedChatSession.Id);
//                NotifyOthersInChatSession(closedChatSession).CustomerDisconnected(closedChatSession.Id);
//                NotifyAllConsultants().CustomerDisconnected(closedChatSession.Id);
//            }
//        }

//        #endregion

//        public ResponseMessage Publish(RequestMessage msg)
//        {
//            var handler = msg.Handler.ToLowerInvariant();
//            switch (handler)
//            {
//                case "chat":
//                    return new HandlerChat(this, _unit).Publish(msg);
//                case "system":
//                    return new HandlerSystem(this, _unit).Publish(msg);
//                case "cobrowsing":
//                    return new HandlerCoBrowsing(this, _unit).Publish(msg);
//                default:
//                    break;
//            }
//            return null;
//        }

//        #region RequestChat / AcceptChat / CloseChat / RequestStatus

//        /// <summary>
//        /// Called by a customer to request a new chat.
//        /// </summary>
//        /// <param name="reqChat">
//        /// The <see cref="ReqChatViewModel"/>.
//        /// </param>
//        /// <returns>
//        /// The request id as <see cref="Guid"/>.
//        /// </returns>
//        public Guid RequestChat(ReqChatViewModel reqChat)
//        {
//            var request = BuildRequest(reqChat);

//            // SYNC Flooding
//            IEnumerable<Request> requestsWithSameIp = _unit.RequestRepository.Get(filter => filter.Ip == request.Ip);

//            //prevent multiple requests caused by refresh (If a user tries to refresh the browserwindow, a request with same build will be sent, to prevent it we must check if it already exists in the past)
//            IEnumerable<Request> requestsWithSameCustomerId = _unit.RequestRepository.Get(filter => filter.SignalRCustomerId == request.SignalRCustomerId);
//            Request existingRequest = requestsWithSameCustomerId.FirstOrDefault();

//            if (requestsWithSameIp.Count() < WebConfiguration.SyncFloodingMax || !WebConfiguration.SyncFloodingEnabled)
//            {
//                logger.Debug("SyncFlooding test passed, adding request to repository.");
//                if (existingRequest == null) // if no previous Requests was found with same constelation, create one
//                {
//                    _unit.RequestRepository.Insert(request);
//                    _unit.RequestRepository.Save();

//                    NotifyAllConsultants(request.Scope, request.ReferenceId).NewChatRequest(request);
//                }
//                else //else update
//                {
//                    existingRequest.RequestTime = DateTimeOffset.Now;
//                    _unit.RequestRepository.Update(existingRequest);
//                    _unit.RequestRepository.Save();
//                }
//            }
//            else
//            {
//                logger.Info("SyncFlooding test failed: too many connections from ip: '{0}'", request.Ip);
//                throw new NotSupportedException("too many connections");
//            }
//            if (HttpContext.Current != null && WebConfiguration.IpBlackList.Contains(HttpContext.Current.Request.UserHostAddress))
//            {
//                logger.Debug("SyncFlooding test failed: ip error.");
//                throw new NotSupportedException("ip error");
//            }

//            logger.Debug("Request creation finalized. Request db id: {0}", request.Id);
//            return request.Id;
//        }

//        private Request BuildRequest(ReqChatViewModel reqViewModel)
//        {
//            SignalRUser customer = _unit.ConnectionManager.GetSignalRUserByConnectionId(GetConnectionId());
//            if (customer == null)
//            {
//                logger.Debug("Chat request has no valid customer as caller. (Question: {0})", reqViewModel.Question);
//                throw new Exception("Caller is not a valid customer.");
//            }
//            else
//            {
//                customer.UserName = reqViewModel.Name;
//                _unit.ConnectionManager.UpdateSignalRUser(customer);

//                Request request = new Request
//                {
//                    SignalRCustomerId = customer.Id,
//                    CustomerUserName = customer.UserName,
//                    Question = reqViewModel.Question,
//                    Ip = HttpContext.Current == null ? "" : HttpContext.Current.Request.UserHostAddress,
//                };

//                if (reqViewModel.ConsultantId != Guid.Empty)
//                {
//                    request.Scope = Scope.User;
//                    request.ReferenceId = reqViewModel.ConsultantId;
//                }
//                else if (QueryString.GroupId != Guid.Empty)
//                {
//                    request.Scope = Scope.Group;
//                    request.ReferenceId = QueryString.GroupId;
//                }
//                else
//                {
//                    request.Scope = Scope.Global;

//                    //TODO: do we have to set referenceId in this case?
//                    request.ReferenceId = QueryString.GroupId;
//                }

//                logger.Debug("Chat request created (SignalRCustomeR: {0}, User: {1}, Question: {2}, Ip: {3}, Gid: {4})",
//                    request.SignalRCustomerId, request.CustomerUserName, request.Question, request.Ip, request.ReferenceId);

//                if (!string.IsNullOrEmpty(reqViewModel.CategoryTitle))
//                {
//                    request.CategoryTitle = reqViewModel.CategoryTitle;
//                }

//                return request;
//            }
//        }

//        /// <summary>
//        /// Called by a consultant to accept a pending request.
//        /// </summary>
//        /// <param name="requestId">
//        /// The request id.
//        /// </param>
//        /// <returns>
//        /// The <see cref="ChatSession"/>.
//        /// </returns>
//        [SignalRLdapAuthorization]
//        public ChatSession AcceptRequest(Guid requestId)
//        {
//            Request request = _unit.RequestRepository.GetById(requestId);
//            if (request == null)
//            {
//                logger.Debug("Could not accept chat request: No such request with id '{0}'", requestId);
//                throw new NoRequestFoundException(requestId);
//            }

//            SignalRUser consultant = _unit.ConnectionManager.GetConsultantSignalRUserByConnectionId(GetConnectionId());
//            SignalRUser customer = _unit.UserRepository.GetById(request.SignalRCustomerId);

//            ChatSession chatSession = new ChatSession(consultant, customer)
//            {
//                CategoryTitle = request.CategoryTitle,
//                Question = request.Question,
//                RequestTime = request.RequestTime
//            };


//            if (!string.IsNullOrWhiteSpace(request.Question))
//            {
//                chatSession.History.Add(new ChatMessage()
//                {
//                    Name = customer.UserName,
//                    IsFromConsultant = false,
//                    Message = request.Question,
//                    MessageType = "userMessage",
//                    Status = ChatMessageStatus.VerifiedByOtherParty
//                });
//            }

//            logger.Debug("Request {0} accepted by consultant '{1}' at '{2}'", requestId, consultant.UserName, request.RequestTime);

//            _unit.ChatSessionRepository.Insert(chatSession);
//            _unit.ChatSessionRepository.Save();

//            ReqAcceptedViewModel model = new ReqAcceptedViewModel
//            {
//                Consultant = new ConsultantViewModel
//                {
//                    Name = consultant.UserName,
//                    Picture = GetConsultantImagePath(consultant),
//                    ConsultantStatus = consultant.StatusId
//                },
//                ChatSessionId = chatSession.Id.ToString()
//            };

//            NotifyUser(customer).RequestAccepted(model);
//            NotifyAllConsultants().RemoveChatRequest(
//                request.Id,
//                new
//                {
//                    ChatSessionId = chatSession.Id,
//                    ConsultantId = consultant.Id
//                });

//            _unit.RequestRepository.Delete(request);
//            _unit.RequestRepository.Save();

//            return chatSession;
//        }

//        /// <summary>
//        /// The chat session close.
//        /// </summary>
//        /// <param name="chatSessionId">
//        /// The chat session id.
//        /// </param>
//        /// <exception cref="NoChatSessionFoundException">
//        /// Is thrown if there is no chat session with the <paramref name="chatSessionId"/> specified.
//        /// </exception>
//        public void ChatSessionClose(Guid chatSessionId)
//        {
//            ChatSession chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            if (chatSession == null)
//            {
//                logger.Debug("Closing chat session, chatSession could not be found (chatSessionId: {0})", chatSessionId);
//                throw new NoChatSessionFoundException(chatSessionId);
//            }

//            if (!IsMyChatSession(chatSessionId)) //SECURITY
//                return;

//            chatSession.IsSessionClosed = true;
//            _unit.ChatSessionRepository.Update(chatSession);

//            SignalRUser customer = _unit.UserRepository.GetById(chatSession.CustomerSignalRUserId);
//            if (customer != null)
//            {
//                NotifyUser(customer).ChatSessionClosed();
//            }
//            else
//            {
//                logger.Debug("Closing a chat session, but the customer of that chat session could not be found (chatSessionId: {0})", chatSessionId);
//            }

//            NotifyAllConsultants().ChatSessionClosed(chatSession.Id);
//            _unit.ChatSessionRepository.Save();
//        }


//        /// <summary>
//        ///     Called by a customer to request its status (is there an open chatSession?).
//        /// </summary>
//        /// <returns>
//        ///     The <see cref="ChatStatus" />.
//        /// </returns>
//        public ChatStatus RequestStatus()
//        {
//            SignalRUser customer = _unit.ConnectionManager.GetSignalRUserByConnectionId(GetConnectionId());
//            ChatSession chatSession = null;

//            if (customer != null)
//            {
//                chatSession = _unit.ChatSessionRepository.Get(cs => cs.CustomerSignalRUserId == customer.Id).FirstOrDefault();
//            }
//            else
//            {
//                logger.Warn("Customer requests status but Customer is unknown(Ip: {0})", HttpContext.Current.Request.UserHostAddress);
//            }

//            ReqAcceptedViewModel model = null;
//            if (chatSession != null)
//            {
//                chatSession.IsSessionClosed = false;
//                _unit.ChatSessionRepository.Update(chatSession);
//                _unit.ChatSessionRepository.Save();

//                // This should now occur in OnReconnected()
//                //NotifyOthersInChatSession(chatSession).AddMessage(new ChatMessage
//                //{
//                //    ChatSession_Id = chatSession.Id,
//                //    IsFromConsultant = false,
//                //    MessageType = "customerReconnected",
//                //});
//                //NotifyAllConsultantsExceptCurrentConsultant().AddChatSessionInfo(chatSession.Id, chatSession.ConsultantSignalRUserId);

//                //TODO: NotifyAllConsultants().AddChatSessionInfo(chatSession.Id, chatSession.ConsultantSignalRUserId);


//                SignalRUser consultant = _unit.UserRepository.GetById(chatSession.ConsultantSignalRUserId);
//                model = new ReqAcceptedViewModel
//                {
//                    Consultant = new ConsultantViewModel
//                    {
//                        Name = consultant.UserName,
//                        Picture = GetConsultantImagePath(consultant)
//                    },
//                    ChatSessionId = chatSession.Id.ToString()
//                };
//                // TODO: can we pass the sorting criteria through the IGenericRepository<T>
//                //       so that sorting happen in the DB?
//                // NOTE: This should be done after all db operations to prevent errors from entity framework 
//                chatSession.History = (from message in chatSession.History
//                                       where message.MessageType == "userMessage"
//                                       orderby message.ReceivedTime
//                                       select message).ToArray();
//            }

//            return new ChatStatus
//            {
//                ChatSession = chatSession,
//                RequestAcceptedModel = model,
//            };
//        }

//        //SignalRuser
//        public SignalRUser GetSignalRUser()
//        {
//            return _unit.ConnectionManager.GetSignalRUserByConnectionId(GetConnectionId());

//        }
//        #endregion

//        #region transfer Chat
//        /// <summary>
//        /// The method to request a transfer of a chat session to another consultant.
//        /// </summary>
//        /// <param name="chatSessionId">
//        /// The chat session id.
//        /// </param>
//        /// <param name="newConsultantSignalRUserId">
//        /// The new consultant signal r user id.
//        /// </param>
//        /// <param name="reason">
//        /// The reason why someone else should take the chat session.
//        /// </param>
//        /// <exception cref="NoChatSessionFoundException">
//        /// Is thrown if there is no chat session with the <paramref name="chatSessionId"/> specified.
//        /// </exception>
//        [SignalRLdapAuthorization]
//        public void ChatSessionTransferRequest(DataTransferChatRequest request) //TODO SECURITY check if newConsultant is from same group
//        {
//            if (!IsMyChatSession(request.ChatSessionId)) //SECURITY
//                return;

//            ChatSession chatSession = _unit.ChatSessionRepository.GetById(request.ChatSessionId);
//            if (chatSession == null)
//            {
//                logger.Debug("Requesting a transfer of a chat session to another consultant, chatSession is null (ChatSessionId: {0}, newConsultantSignalRUserId: {1}, Reason: {2})",
//                    request.ChatSessionId, request.NewConsultantSignalRUserId, request.Message);
//                throw new NoChatSessionFoundException(request.ChatSessionId);
//            }

//            SignalRUser newConsultant = _unit.ConnectionManager.GetConsultantSignalRUserByUserId(request.NewConsultantSignalRUserId);
//            if (newConsultant == null)
//            {
//                logger.Debug("Requesting a transfer of a chat session to another consultant, newConsultant is null (ChatSessionId: {0}, newConsultantSignalRUserId: {1}, Reason: {2})",
//                    request.ChatSessionId, request.NewConsultantSignalRUserId, request.Message);
//                throw new NoConsultantFoundException(request.NewConsultantSignalRUserId);
//            }

//            if (chatSession.History != null)
//            {
//                chatSession.History = chatSession.History.OrderBy(cm => cm.ReceivedTime).ToArray();
//            }

//            NotifyUser(newConsultant).ChatSessionTransferRequested(request, chatSession);
//        }

//        /// <summary>
//        /// The method to respond to a transfer of a chat session to another consultant.
//        /// </summary>
//        /// <param name="accepted">
//        /// Flag signaling if the request was accepted.
//        /// </param>
//        /// <param name="chatSessionId">
//        /// The chat session id.
//        /// </param>
//        /// <exception cref="NoChatSessionFoundException">
//        /// Is thrown if there is no chat session with the <paramref name="chatSessionId"/> specified.
//        /// </exception>
//        [SignalRLdapAuthorization]
//        public void ChatSessionTransferResponse(bool accepted, Guid chatSessionId)
//        {
//            ChatSession chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            if (chatSession == null)
//            {
//                logger.Debug("Response of transfered Chat Session, chatSession is null (ChatSessionId: {0})", chatSessionId);
//                throw new NoChatSessionFoundException(chatSessionId);
//            }

//            SignalRUser currentConsultant = _unit.ConnectionManager.GetConsultantSignalRUserByUserId(chatSession.ConsultantSignalRUserId);
//            if (currentConsultant == null)
//            {
//                logger.Debug("Requesting a transfer of a chat session to another consultant, current consultant of the chat is null (SignalRUserId of current consultant: {0}, chatSessionId: {1})", chatSession.ConsultantSignalRUserId, chatSessionId);
//                throw new NoConsultantFoundException(
//                    string.Format(
//                        "The consultant of the specified chat '{0}' was not found.",
//                        chatSessionId));
//            }

//            SignalRUser newConsultant = _unit.ConnectionManager.GetConsultantSignalRUserByConnectionId(GetConnectionId());
//            if (currentConsultant == null)
//            {
//                logger.Debug("Requesting a transfer of a chat session to another consultant, current consultant of the chat is null (SignalRUserId of current consultant: {0}, chatSessionId: {1})", chatSession.ConsultantSignalRUserId, chatSessionId);
//                throw new InvalidOperationException("Caller is not a valid Consultant.");
//            }

//            if (accepted)
//            {
//                chatSession.ConsultantSignalRUserId = newConsultant.Id;

//                SignalRUser customer = _unit.UserRepository.GetById(chatSession.CustomerSignalRUserId);
//                if (customer != null)
//                {
//                    NotifyUser(customer).SetConsultantData(new ConsultantViewModel
//                    {
//                        Name = newConsultant.UserName,
//                        Picture = GetConsultantImagePath(newConsultant),
//                    });
//                }

//                NotifyAllConsultants().ChatSessionTransferHappend(new
//                {
//                    ChatSessionId = chatSessionId,
//                    NewConsultantId = newConsultant.Id
//                });
//            }

//            NotifyUser(currentConsultant).ChatSessionTransferResponded(new
//            {
//                Accepted = accepted,
//                ChatSessionId = chatSessionId,
//                NewConsultantId = newConsultant.Id
//            });
//            _unit.ChatSessionRepository.Update(chatSession);
//            _unit.ChatSessionRepository.Save();
//        }
//        #endregion

//        #region Send And Receive Messages

//        /// <summary>
//        /// The method to send a message to a secified chatSession.
//        /// </summary>
//        /// <param name="chatSessionId">
//        /// The chat session id.
//        /// </param>
//        /// <param name="message">
//        /// The message.
//        /// </param>
//        /// <exception cref="NoChatSessionFoundException">
//        /// Is thrown if there is no chat session with the <paramref name="chatSessionId"/> specified.
//        /// </exception>
//        /// <returns>
//        /// The <see cref="ChatMessage"/> of the newly added message.
//        /// </returns>
//        public ChatMessage Send(Guid chatSessionId, ChatMessage message)
//        {
//            CorrectMessageLength(message);


//            ChatSession chatSession =
//                _unit.ChatSessionRepository.Get(s => s.Id == chatSessionId, null, "History").SingleOrDefault();
//            if (chatSession == null)
//            {
//                logger.Debug("Unnable to add message to non existant chat session {0}", chatSessionId);
//                throw new NoChatSessionFoundException(chatSessionId);
//            }

//            if (!IsMyChatSession(chatSessionId)) //SECURITY
//                return null;

//            message.ChatSession_Id = chatSessionId;
//            message.IsFromConsultant = IsRequestingUserAConsultant();
//            if (message.IsFromConsultant)
//            {
//                if (CurrentApplicationUser != null)
//                {
//                    message.SenderId = new Guid(CurrentApplicationUser.Id);
//                    message.Name = CurrentApplicationUser.Displayname;
//                }
//            }
//            else
//            {
//                message.Name = chatSession.CustomerUserName;
//            }
//            message.ReceivedTime = DateTimeOffset.Now;
//            message.Status = ChatMessageStatus.SendToOtherParty;


//            CorrectIllegalStrings(message);


//            chatSession.History.Add(message);
//            _unit.ChatSessionRepository.Update(chatSession);
//            _unit.ChatSessionRepository.Save();

//            logger.Debug(
//                "Add message to chat session {0} - {1} to {2} - {3}",
//                chatSessionId,
//                message.IsFromConsultant ? "ConsultantId: " + chatSession.ConsultantSignalRUserId : "CustomerId: " + chatSession.CustomerSignalRUserId,
//                !message.IsFromConsultant ? "ConsultantId: " + chatSession.ConsultantSignalRUserId : "CustomerId: " + chatSession.CustomerSignalRUserId,
//                message.Message);

//            // Should we inform all members to be consistent?
//            NotifyOthersInChatSession(chatSession).AddMessage(message);
//            return message;
//        }

//        private void CorrectMessageLength(ChatMessage message)
//        {
//            int allowedLength = WebConfiguration.MaxChatMessageLength;
//            if (!String.IsNullOrWhiteSpace(message.Message))
//            {
//                if (message.Message.Length > allowedLength)
//                    message.Message = message.Message.Substring(0, allowedLength);
//            }
//            else
//            {
//                message.Message = "";
//            }
//        }

//        private void CorrectIllegalStrings(ChatMessage message)  //SECURITY
//        {

//            string[,] forbiddenRegex = new string[,] {
//                {"SCRIPT",@"</*(\s*|\+*?|\n*)*s(\+*?)*c(\+*?)*r(\+*?)*i(\+*?)*p(\+*?)*t.*?>"},
//                {"STYLE",@"</*(\s*|\+*?|\n*)*s(\+*?)*t(\+*?)*y(\+*?)*l(\+*?)*e.*?>"        },
//                {"LINK",@"</*(\s*|\+*?|\n*)*l(\+*?)*i(\+*?)*n(\+*?)*k.*?>"                },
//                {"IFRAME",@"</*(\s*|\+*?|\n*)*i(\+*?)*f(\+*?)*r(\+*?)*a(\+*?)*m(\+*?)*e.*?>"},
//                {"VIDEO",@"</*(\s*|\+*?|\n*)*v(\+*?)*i(\+*?)*d(\+*?)*e(\+*?)*o.*?>"        },
//                {"CANVAS",@"</*(\s*|\+*?|\n*)*c(\+*?)*a(\+*?)*n(\+*?)*v(\+*?)*a(\+*?)*s.*?>" }
//            };

//            for (int i = 0; i < forbiddenRegex.GetLength(0); i++)
//            {

//                string replacement = "[" + forbiddenRegex[i, 0] + ": Verbotene Zeichenkombination]";
//                Regex rgx = new Regex(forbiddenRegex[i, 1], RegexOptions.IgnoreCase);

//                message.Message = rgx.Replace(message.Message, replacement);
//            }



//        }

//        /// <summary>
//        /// The method to verify that a message has been received.
//        /// </summary>
//        /// <param name="chatSessionId">
//        /// The chat session id.
//        /// </param>
//        /// <param name="chatMessageId">
//        /// The chat message id.
//        /// </param>
//        public void MessageReceived(Guid chatSessionId, Guid chatMessageId)
//        {
//            var chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            if (chatSession != null)
//            {
//                var message = chatSession.History.FirstOrDefault(m => m.Id == chatMessageId);
//                if (message != null)
//                {
//                    message.Status = ChatMessageStatus.VerifiedByOtherParty;
//                }
//                else
//                {
//                    logger.Debug("Verifieng that a message has been received, but message is null (chatSessionId: {0}, chatMessageId: {1})", chatSessionId, chatMessageId);
//                }
//                _unit.ChatSessionRepository.Update(chatSession);
//                _unit.ChatSessionRepository.Save();

//                logger.Debug("verified message with id {0} in chat session {1}", chatMessageId, chatSessionId);

//                NotifyOthersInChatSession(chatSession).VerifiedMessage(chatSessionId, chatMessageId);
//            }
//        }

//        private void ResendUnverifiedMessagesInChatSessionOnConnect(ChatSession chatSession)
//        {
//            foreach (var message in chatSession.History.Where(m => m.Status != ChatMessageStatus.VerifiedByOtherParty))
//            {
//                if (message.MessageType != "state")
//                    Clients.Client(GetConnectionId()).AddMessage(message);
//            }
//        }

//        #endregion

//        #region meta information for chats
//        /// <summary>
//        /// The consultant status transfer.
//        /// </summary>
//        /// <param name="signalRUserId">
//        /// The signal R User Id.
//        /// </param>
//        /// <param name="statusId">
//        /// The status id.
//        /// </param>
//        [SignalRLdapAuthorization]
//        public void TransferConsultantStatus(Guid signalRUserId, StatusType statusId) //TODO: Security
//        {
//            SignalRUser consultantSignalRUser = _unit.UserRepository.GetById(signalRUserId);
//            if (consultantSignalRUser == null) //not found, then is signalRUserId=userid
//            {
//                var userId = signalRUserId;
//                consultantSignalRUser = _unit.UserRepository.Get(f => f.UserId == userId).FirstOrDefault();
//                signalRUserId = consultantSignalRUser.Id;
//            }

//            if (!IsMySignalRConnection(signalRUserId))
//            {
//                logger.Warn("SECURITY(ChatHub): someone is trying to manipulate consultant status that not belongs to him!");
//                return;
//            }


//            if (consultantSignalRUser != null)
//            {
//                consultantSignalRUser.StatusId = statusId;
//                _unit.ConnectionManager.UpdateSignalRUser(consultantSignalRUser);
//            }
//            else
//            {
//                logger.Debug("Transfering consultant status: SignalRUser of consultant could not be found (SignalRUserId: {0}, Status: {1})", signalRUserId, statusId);
//            }

//            logger.Debug("Notify all consultants: consultant user status changed (Id: {0}, Status: {1})", signalRUserId, statusId);
//            NotifyAllConsultantsExceptCurrentConsultant().ConsultantStatusChanged(signalRUserId, statusId); // TODO: Nur aus eigener gruppe benachrichtigen

//            IEnumerable<ChatSession> chatSessions =
//                _unit.ChatSessionRepository.Get(c => c.ConsultantSignalRUserId == signalRUserId && !c.IsSessionClosed);

//            foreach (ChatSession chatSession in chatSessions)
//            {
//                logger.Debug("Notify others in chat session {0} about state change", chatSession.Id);
//                NotifyOthersInChatSession(chatSession).ChangeConsultantStatus(statusId);
//            }
//        }

//        /// <summary>
//        /// Set the current MediaItem for the ChatSession.
//        /// </summary>
//        /// <param name="mediaItemId">
//        /// The id of the MediaItem.
//        /// </param>
//        /// <param name="chatSessionId">
//        /// The id of the ChatSession.
//        /// </param>
//        [SignalRLdapAuthorization]
//        public void SetCurrentMediaItem(Guid mediaItemId, Guid chatSessionId)
//        {
//            if (!IsMyChatSession(chatSessionId)) //SECURITY
//                return;

//            var chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            var mediaItem = _unit.MediaItemRepository.GetById(mediaItemId);

//            if (chatSession != null && mediaItem != null)
//            {
//                chatSession.CurrentMediaItem = mediaItem;
//                _unit.ChatSessionRepository.Update(chatSession);
//                _unit.ChatSessionRepository.Save();

//                logger.Debug("MediaItem '{0}' is now the current MediaItem in chat session '{1}'", mediaItemId, chatSessionId);
//            }
//        }

//        /// <summary>
//        /// Set the current ConsultantActivity for the ChatSession.
//        /// </summary>
//        /// <param name="consultantActivityId">
//        /// The id of the ConsultantActivity.
//        /// </param>
//        /// <param name="chatSessionId">
//        /// The id of the ChatSession.
//        /// </param>
//        [SignalRLdapAuthorization]
//        public void SetCurrentConsultantActivity(Guid consultantActivityId, Guid chatSessionId)
//        {
//            if (!IsMyChatSession(chatSessionId)) //SECURITY
//                return;

//            var chatSession = _unit.ChatSessionRepository.GetById(chatSessionId);
//            var consultantActivity = _unit.ConsultantActivityRepository.GetById(consultantActivityId);

//            if (chatSession != null && consultantActivity != null)
//            {
//                chatSession.CurrentConsultantActivity = consultantActivity;
//                _unit.ChatSessionRepository.Update(chatSession);
//                _unit.ChatSessionRepository.Save();

//                logger.Debug("ConsultantActivity '{0}' is now the current ConsultantActivity in chat session '{1}'", consultantActivityId, chatSessionId);
//            }
//        }

//        #endregion

//        #region echo
//        /// <summary>
//        /// This method is used to reestablish accidentally closed chat sessions and update the time on clients.
//        /// </summary>
//        /// <param name="message">
//        /// The message.
//        /// </param>
//        /// <returns>
//        /// The current server time as <see cref="DateTime"/>.
//        /// </returns>
//        public DateTime Echo(EchoMessage message)
//        {
//            switch (message.MessageType)
//            {
//                case "echo":
//                    logger.Trace("Hub event 'Echo MesaageType=echo'");

//                    var connectionId = GetConnectionId();
//                    var connection = _unit.ConnectionManager.SignalRConnectionRepository.Get(c => c.SignalRConnectionId == connectionId).FirstOrDefault();
//                    if (connection != null)
//                    {
//                        connection.LastChangedTime = DateTime.Now;
//                        _unit.ConnectionManager.SignalRConnectionRepository.Save();
//                        if (connection.ConnectionState != ConnectionState.Connected)
//                        {
//                            // We got a false OnDisconnect so undo all operations here!
//                            logger.Trace("Hub enter OnReConnect from Echo Service");
//                            OnReconnected();
//                        }
//                    }
//                    break;
//                default:
//                    break;
//            }

//            CheckConnectionOnlineStatus();

//            return DateTime.Now;
//        }

//        private void CheckConnectionOnlineStatus()
//        {
//            // we admit, that this is not thread safe, but it does not harm if this action is performed twice or more.
//            if (DateTime.Now - LastOnlineCheckTime > WebConfiguration.RequestTimeOut)
//            {
//                LastOnlineCheckTime = DateTime.Now;

//                var f = _unit.ConnectionManager.SignalRConnectionRepository
//                    .Get(filter: co => co.ConnectionState != ConnectionState.Closed)
//                    .GroupBy(s => s.ConnectionSignalRUser.IsConsultant ? s.ConnectionSignalRUser.UserId : s.ConnectionSignalRUser.ClientId)
//                    .Where(c => c.OrderByDescending(o => o.LastChangedTime).FirstOrDefault().ShouldNotifyOthersIfFirstTimeInactive())
//                    .Select(g => g.FirstOrDefault());

//                foreach (SignalRConnection signalRConnection in f)
//                {
//                    DisconnectResult disconnectResult = _unit.ConnectionManager.RevalidateOnDisconnect(signalRConnection.SignalRConnectionId);
//                    if (disconnectResult.DisconnectedUser != null)
//                    {
//                        if (disconnectResult.DisconnectedUser.IsConsultant)
//                        {
//                            HandlePossibleConsultantDisconnect(disconnectResult);
//                        }
//                        else
//                        {
//                            HandlePossibleCustomerDisconnect(disconnectResult);
//                        }
//                    }
//                }
//            }
//        }

//        #endregion








//        #region other stuff

//        /// <summary>
//        /// trigger an Update for Support Categories at all Consultants
//        /// </summary>
//        public void SupportCategoriesUpdated()
//        {
//            NotifyAllConsultants().SupportCategoriesUpdated();
//        }

//        /// <summary>   Handles a changed agent name. </summary>
//        ///
//        /// <param name="userid">       The userid. </param>
//        /// <param name="newUsername">  The new username. </param>
//        public void AgentNameChanged(string identityName, string newUsername)
//        {
//            //TODO Remove
//            logger.Info("Change Username for user with Domain/Email Account '{0}' to '{1}'", identityName, newUsername);
//            SignalRUser signalRUser = _unit.UserRepository.Get().Where(user => user.IdentityName == identityName).Single();
//            signalRUser.UserName = newUsername;
//            _unit.UserRepository.Update(signalRUser);
//            _unit.UserRepository.Save();
//        }

//        private string GetConsultantImagePath(SignalRUser consultant)
//        {
//            string consultantImagePath = string.Empty;
//            using (var userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(new ApplicationDbContext())))
//            {
//                ApplicationUser consultantUser = userManager.FindByName(consultant.IdentityName ?? "Anonymous");
//                if (consultantUser != null)
//                {
//                    consultantImagePath = consultantUser.GetProfileImagePath();
//                }
//                else
//                {
//                    logger.Debug("Could not get consultant image path. ApplicationUser for consultant could not be found. (SignalRUserId: {0}, SignalRUserName: {1}, Ip: {2})", consultant.ClientId, consultant.UserName, HttpContext.Current.Request.UserHostAddress);
//                }
//            }
//            return consultantImagePath;
//        }
//        #endregion
//    }
//}
