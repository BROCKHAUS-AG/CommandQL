using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.StaticFiles;
using Microsoft.Owin.FileSystems;
using System.IO;

[assembly: OwinStartup(typeof(BAG.CommandQL.WebUI.Startup))]

namespace BAG.CommandQL.WebUI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            // Maps wwwroot folder
            app.UseFileServer(new FileServerOptions()
            {
                EnableDefaultFiles = true,
                EnableDirectoryBrowsing = true,
                FileSystem = new PhysicalFileSystem(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot")),
                RequestPath = new PathString("/wwwroot")
            });

            // Maps files from JS folder to /commandQLScript
            app.UseFileServer(new FileServerOptions()
            {
                EnableDefaultFiles = true,
                EnableDirectoryBrowsing = true,
                FileSystem = new PhysicalFileSystem(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "../BAG.CommandQL.JS/dist")),
                RequestPath = new PathString("/commandQLScript")
            });
        }
    }
}
