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
        public async Task<ResponseQL> Post(JObject obj)
        {
            ResponseQL response = null;
            try
            {
                var request = RequestQL.FromJObject(obj);
                if (request != null)
                {
                    var exec = new Execute.Executer(new CommandQLHandler());
                    response = await exec.Execute(request);
                }
                else
                {
                    throw new NullReferenceException("request:(" + request + ")");
                }
            }
            catch (Exception ex)
            {
                response = new ResponseQL();
                response.Errors.Add(ex.Message);
                response.Errors.Add(ex.ToString());
            }
            return response;
        }





    }

}




