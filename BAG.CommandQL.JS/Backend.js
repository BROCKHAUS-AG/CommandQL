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
<<<<<<< HEAD
    }());
    BROCKHAUSAG.BackendApp = BackendApp;
})(BROCKHAUSAG || (BROCKHAUSAG = {}));
=======
    })();
    BAG.BackendApp = BackendApp;
})(BAG || (BAG = {}));
>>>>>>> 1c919fe0ba967bc61a647dde3d3085db9d675968
//# sourceMappingURL=Backend.js.map