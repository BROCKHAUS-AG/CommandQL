/// <reference path="jquery-1.10.2.js" />
/// <reference path="CommandQL.js" />
/// <reference path="jasmine.js" />

describe("CommandQLTests", function () {


    it("commands init", function () {

        var cmdQL = new BROCKHAUSAG.CommandQL({});

        expect(cmdQL.commands).toEqual([]);
    });


    it("will subscribe and unsobscribe 123", function () {

        var cmdQL = new BROCKHAUSAG.CommandQL({});

        cmdQL.subscribe("cmd", { "key": "123" });
        cmdQL.unsubscribe("cmd", { "key": "123" });

        expect(cmdQL.commands.length).toEqual(0);
    });

    it("will subscribe and unsobscribe 123 but 321 stay", function () {

        var cmdQL = new BROCKHAUSAG.CommandQL({});

        cmdQL.subscribe("cmd", { "key": "321" });
        cmdQL.subscribe("cmd", { "key": "123" });
        cmdQL.unsubscribe("cmd", { "key": "123" });

        expect(cmdQL.commands.length).toEqual(1);
        expect(cmdQL.commands[0].parameters.key).toEqual("321");
    });

    it("will invoke function 3 stay", function () {
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        cmdQL.connect();

        var index = 0;
        cmdQL.invoke("cmd",
        function () {
            return [{ "index": (++index) }];
        });

        cmdQL.invoke("cmd",
        function () {
            return [{ "index": (++index) }];
        });

        cmdQL.invoke("cmd",
        function () {
            return [{ "index": (++index) }];
        });

        expect(index).toEqual(3);
    });

    it("_find command in commands", function () {
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        var index = 0;

        cmdQL.subscribe("cmd", []);
        var data = cmdQL["_find"](cmdQL.commands, "name", "cmd");
        expect(data.name).toEqual("cmd");
    });

    it("will subscribe with counter 2 and unsobscribe", function () {

        var cmdQL = new BROCKHAUSAG.CommandQL({});
        cmdQL.connect();
        cmdQL.subscribe("cmd", [{ "key": "123", counter: 2 }]);
        cmdQL.poll(null, null, true);
        expect(cmdQL.commands.length).toEqual(1);
        cmdQL.status = 1; //reset to connected, 
        cmdQL.poll(null, null, true);
        expect(cmdQL.commands.length).toEqual(0);
    });

    it("will subscribe with each 3 and call 3 time", function () {

        var index = 0;
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        cmdQL.subscribe("cmd", 
            function () {
                index++;
                return [{ "each": 3 }];
            });
        cmdQL.connect();
        cmdQL.poll(null, null, true);
        expect(index).toEqual(1);
        cmdQL.status = 1; //reset to connect
        cmdQL.poll(null, null, true);
        expect(index).toEqual(2);
        cmdQL.status = 1; //reset to connect
        cmdQL.poll(null, null, true);
        expect(index).toEqual(3);
    });

    it("will subscribe with each 3 and call one time", function () {
        var index = 0;
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        cmdQL.subscribe("cmd", [{ "each": 3 }], function (data) {
            index++;
        });
        cmdQL.connect();
        cmdQL.poll(null, null, true);
        expect(index).toEqual(0);
        cmdQL.status = 1; //reset to connect
        cmdQL.poll(null, null, true);
        expect(index).toEqual(0);
        cmdQL.status = 1; //reset to connect
        cmdQL.poll(null, null, true);
        expect(index).toEqual(1);
    });

    it("will invoke poll before connect", function () {
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        var result = cmdQL.poll();
        expect(cmdQL.status).toEqual(0);
        expect(result).toEqual(400);
    });

    it("will invoke poll many times", function () {
        var cmdQL = new BROCKHAUSAG.CommandQL({});
        cmdQL.connect();
        var result1 = cmdQL.poll();
        expect(result1).toEqual(200); // ok
        var result2 = cmdQL.poll(); //secend time       
        expect(result2).toEqual(500); // to many times
    });
});