using BAG.CommandQL.Analysis;
using BAG.CommandQL.Entities;
using BAG.CommandQL.RouteHandler;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Routing;

namespace BAG.CommandQL.Helper
{
    static class StringHelper
    {
        public static string AppendIfNotPresented(this string str, string append)
        {
            if(str.Length >= append.Length)
            {
                if(str.Substring(str.Length - append.Length, append.Length) != append)
                {
                    str += append;
                }
            }
            else
            {
                str += append;
            }

            return str;
        }
    }
}
