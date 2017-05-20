using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using BAG.CommandQL.Infrastructure;
using System.ComponentModel;

namespace BAG.CommandQL.WebUI.Handlers
{
    [DisplayName("TestHandler")]
    [Description("Dieser Handler ist ein Test")]
    public class TestHandler : CommandQLHandlerBase
    {
        [DisplayName("Test")]
        [Description("Diese Methode ist nur für Admins und Superuser")]
        [CommandQLBasicAuthorize("admin", "superuser")]
        public string Test()
        {
            return "das ist ein test";
        }

        public string Test1()
        {
            return "das ist ein test 1";
        }

        public string StringInput(string test1, string test2)
        {
            return "test";
        }
    }
}