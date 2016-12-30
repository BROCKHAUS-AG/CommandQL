module BAG {

    export class BackendApp {
        public cmdQL: CommandQL;
        public mandant: string;
        constructor(settings: IConfigurationQL) {
            this.cmdQL = new CommandQL(settings);
        }

        run() {
            $("select[name=mandant]").change(function () {
                this.mandant = $("select[name=mandant]").val();
            });
            $("select[name=mandant]").change();
            $("")
        }
    }
}