using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BAG.CommandQL.Execute;
using Newtonsoft.Json;

namespace BAG.CommandQL.Test.Execute
{
    [TestClass]
    public class ExecuterTest
    {


        [TestMethod]
        public void TestExecute()
        {

            var request = JsonConvert.DeserializeObject<Request>(
            "{" +
            "  'commands': [                                               " +
            "    {                                                         " +
            "      'name': 'Echo',                                         " +
            "      'parameters': [{'name':'name','counter':3}],            " +
            "      'return': null                                          " +
            "    },                                                        " +
            "    {                                                         " +
            "      'name': 'EchoString',                                   " +
            "      'parameters': [{'name':'name','counter':3}],            " +
            "      'return': null                                          " +
            "    }                                                         " +
            "  ]                                                           " +
            "}");
            Executer exec = new Executer(new Handler());
            var result = exec.Execute(request);

            Assert.AreEqual(result.Commands.Count, 2);
            var cmd1 = result.Commands.FirstOrDefault((c) => c.Name == "Echo");
            Assert.AreEqual(((Handler.EchoResponse)cmd1.Return).Counter, 3);
            Assert.AreEqual(((Handler.EchoResponse)cmd1.Return).Name, "name");

            var cmd2 = result.Commands.FirstOrDefault((c) => c.Name == "EchoString");
            Assert.AreEqual(cmd2.Return, "name");
        }



        public class Handler
        {

            public EchoResponse Echo(EchoRequest req)
            {
                var result = new EchoResponse()
                {
                    Name = req.Name,
                    Counter = req.Counter
                };
                return result;
            }

            public string EchoString(EchoRequest req)
            {
                return req.Name;
            }

            public class EchoResponse : EchoRequest { }
            public class EchoRequest
            {
                public string Name { get; set; }
                public int Counter { get; set; }
            }
        }
    }
}
