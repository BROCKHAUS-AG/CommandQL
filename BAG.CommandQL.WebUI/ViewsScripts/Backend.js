var BAG;
(function (BAG) {
    var BackendApp = (function () {
        function BackendApp(settings) {
            this.cmdQL = new BAG.CommandQL(settings);
        }
        BackendApp.prototype.run = function () {
            $("select[name=mandant]").change(function () {
                this.mandant = $("select[name=mandant]").val();
            });
            $("select[name=mandant]").change();
            $("");
        };
        return BackendApp;
    })();
    BAG.BackendApp = BackendApp;
})(BAG || (BAG = {}));
//# sourceMappingURL=Backend.js.map