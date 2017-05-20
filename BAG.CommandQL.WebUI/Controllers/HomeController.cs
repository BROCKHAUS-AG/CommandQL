using BAG.CommandQL.WebUI.DI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace BAG.CommandQL.WebUI.Controllers
{
    public class HomeController : Controller
    {
        public HomeController(IDIExample test)
        {

        }

        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Backend()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
