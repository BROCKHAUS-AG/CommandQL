describe("Main", () => {
    it("test", () => {
        expect(() => {
            throw new Error("test");
        }).toThrow();

        expect("1").toBe("1");
    });
});