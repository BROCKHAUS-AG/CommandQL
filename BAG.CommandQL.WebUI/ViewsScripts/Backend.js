var BROCKHAUSAG;
(function (BROCKHAUSAG) {
    var BackendApp = (function () {
        function BackendApp(settings) {
            this.cmdQL = new BROCKHAUSAG.CommandQL(settings);
            this.cmdQL.connect();
        }
        BackendApp.prototype.run = function () {
            $("select[name=mandant]").change(function () {
                this.mandant = $("select[name=mandant]").val();
            });
            $("select[name=mandant]").change();
            $("");
        };
        BackendApp.prototype.changeState = function () {
        };
        return BackendApp;
    }());
    BROCKHAUSAG.BackendApp = BackendApp;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
//# sourceMappingURL=Backend.js.map