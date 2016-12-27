# CommandQL-dotnet
A toolset for creating CommandQL WebAPI 2.0 servers in dotnet. Next step as GraphQL. ;-)

This is a Working Draft of the Specification for CommandQL, 
a query and execution language for APIs created by BROCKHAUS AG.

### demo

```csharp
[TestMethod]
public void TestExecuteCommands()
{
    var request = JsonConvert.DeserializeObject<RequestQL>(
    "{" +
    "  'commands': [                                               " +
    "    {                                                         " +
    "      'name': 'echo',                                         " +
    "      'parameters': [{'name':'first last','counter':3}]       " +
    "    },                                                        " +
    "    {                                                         " +
    "      'name': 'echoString',                                   " +
    "      'parameters': [{'name':'echo'}]                         " +
    "    },                                                        " +
    "    {                                                         " +
    "      'name': 'twoParameters',                                " +
    "      'parameters': [{'name':'firstname'},{'name':'lastname'}]" +
    "    }                                                         " +
    "  ]                                                           " +
    "}");

    Executer exec = new Executer(new Handler());
    var result = exec.Execute(request).Result;

    Assert.AreEqual(result.Commands.Count, 3);
    var cmd1 = result.Commands.FirstOrDefault((c) => c.Name == "echo");
    Assert.AreEqual(((Handler.EchoResponse)cmd1.Return).Counter, 3);
    Assert.AreEqual(((Handler.EchoResponse)cmd1.Return).Name, "first last");

    var cmd2 = result.Commands.FirstOrDefault((c) => c.Name == "echoString");
    Assert.AreEqual(cmd2.Return, "echo");

    var cmd3 = result.Commands.FirstOrDefault((c) => c.Name == "twoParameters");
    Assert.AreEqual(cmd3.Return, "firstname lastname");
}
```

Sample handler for demonstration

```csharp
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
    public string TwoParameters(EchoRequest req1, EchoRequest req2)
    {
        return req1.Name + " " + req2.Name;
    }
    public class EchoResponse : EchoRequest { }
    public class EchoRequest
    {
        public string Name { get; set; }
        public int Counter { get; set; }
    }
}
```

### WebAPI

```csharp
[HttpPost]
public async Task<ResponseQL> Post(JObject obj)
{
    var request = BAG.CommandQL.RequestQL.FromJObject(obj);
    ResponseQL response = null;
    if (request != null)
    {
        var exec = new Execute.Executer(new CommandQLHandler());
        response = await exec.Execute(request);
    }
    else
    {
        response = new ResponseQL();
        response.Errors.Add(new NullReferenceException().ToString());
    }
    return response;
}
```
