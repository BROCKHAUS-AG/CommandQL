using BAG.CommandQL.Entities;
using BAG.CommandQL.Infrastructure;
using BAG.CommandQL.WebUI.Controllers.Hub;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace BAG.CommandQL.WebUI.Controllers
{
    [RoutePrefix("api/CommandQL")]
    public class CommandQLController : ApiController
    {
        // GET api/<controller>
        public object Get()
        {
            return CommandQL.HandlerInfos;
            //return new Analyzer(new CommandQLHandler(System.Web.HttpContext.Current));
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<CommandQLResponse> Post(JObject obj)
        {
            CommandQLResponse response = null;
            try
            {
                var request = CommandQLRequest.FromJObject(obj);
                if (request != null)
                {
                    var exec = new CommandQLExecuter(HttpContext.Current, new CommandQLHandlerBase());
                    response = await exec.ExecuteAsync(request);
                }
                else
                {
                    throw new NullReferenceException("request:(" + request + ")");
                }
            }
            catch (Exception ex)
            {
                response = new CommandQLResponse();
                response.Errors.Add(ex.Message);
                response.Errors.Add(ex.ToString());
            }
            return response;
        }





    }

}




