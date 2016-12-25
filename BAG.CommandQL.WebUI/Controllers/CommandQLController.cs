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



        

    }

}




