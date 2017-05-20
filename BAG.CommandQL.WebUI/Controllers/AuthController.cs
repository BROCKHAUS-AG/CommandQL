using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace BAG.CommandQL.WebUI.Controllers
{
    public class AuthController : Controller
    {
        // GET: Auth
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login(string roles = "")
        {
            IOwinContext owin = Request.GetOwinContext();
            owin.Authentication.SignOut("custom");

            List<Claim> claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, "User"),
                    };

            foreach(string str in roles.Split(','))
            {
                claims.Add(new Claim(ClaimTypes.Role, str));
            }

            ClaimsIdentity id = new ClaimsIdentity(claims, "custom");

            owin.Authentication.SignIn(id);

            return RedirectToAction("Index", "Home");
        }
    }
}