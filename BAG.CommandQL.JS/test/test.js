"use strict";
beforeEach(function () {
    //Init vars here
});
"use strict";
describe("Main", function () {
    it("test", function () {
        expect(function () {
            throw new Error("test");
        }).toThrow();
        expect("1").toBe("1");
    });
});
