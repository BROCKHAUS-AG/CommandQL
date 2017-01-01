/// <reference path="jquery-1.10.2.js" />
/// <reference path="CommandQL.js" />
/// <reference path="jasmine.js" />

describe("CommandQLTests", function () {


    it("commands init", function () {

        var cmdQL = new BAG.CommandQL({});

        expect(cmdQL.commands).toEqual([]);
    });


    it("will subscribe and unsobscribe 123", function () {

        var cmdQL = new BAG.CommandQL({});

        cmdQL.subscribe("cmd", { "key": "123" });
        cmdQL.unsubscribe("cmd", { "key": "123" });

        expect(cmdQL.commands.length).toEqual(0);
    });

    it("will subscribe and unsobscribe 123 but 321 stay", function () {

        var cmdQL = new BAG.CommandQL({});

        cmdQL.subscribe("cmd", { "key": "321" });
        cmdQL.subscribe("cmd", { "key": "123" });
        cmdQL.unsubscribe("cmd", { "key": "123" });

        expect(cmdQL.commands.length).toEqual(1);
        expect(cmdQL.commands[0].parameters.key).toEqual("321");
    });

    it("will invoke function 3 stay", function () {
        var cmdQL = new BAG.CommandQL({});
        var index = 0;

        cmdQL.invoke("cmd",
        function () {
            return { "index": (++index) };
        });

        cmdQL.invoke("cmd",
        function () {
            return { "index": (++index) };
        });

        cmdQL.invoke("cmd",
        function () {
            return { "index": (++index) };
        });
        
        expect(index).toEqual(3);
    });

    it("_find command in commands", function () {
        var cmdQL = new BAG.CommandQL({});
        var index = 0;

        cmdQL.subscribe("cmd",null);
        var data=cmdQL["_find"](cmdQL.commands,"name","cmd");
        expect(data.name).toEqual("cmd");
    });

});