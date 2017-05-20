using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAG.CommandQL.WebUI.DI
{
    public class DIExample1 : IDIExample
    {
        public DIExample1()
        {
            Value = "DI1";
        }

        public string Value { get; set; }
    }

    public class DIExample2 : IDIExample
    {
        public DIExample2()
        {
            Value = "DI2";
        }

        public string Value { get; set; }
    }
}