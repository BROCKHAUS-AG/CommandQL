namespace BROCKHAUSAG.Transport {

    export class HttpTransport implements ITransport {
        public name: string = "http";

        constructor(private settings: Entities.ICommandQLConfiguration) {

        }

        private makeRequest(sendData: Entities.SendDataObject): void {
            let http = new XMLHttpRequest();
            http.open("POST", this.settings.serverpath, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            if (this.settings.timeout) {
                http.timeout = this.settings.timeout;
            }

            if (this.settings.headers) {
                for (let key in Object.keys(this.settings.headers)) {
                    http.setRequestHeader(key, this.settings.headers[key]);
                }
            }

            http.onreadystatechange = function() {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        if (sendData.success) {

                            let response: any;

                            try {
                                response = JSON.parse(http.responseText);
                            } catch (ex) {
                                response = http.responseText;
                            }

                            sendData.success(response);
                        }
                    } else {
                        if (sendData.error) {
                            sendData.error("Http error: " + http.status);
                        }
                    }

                    if (sendData.complete) {
                        sendData.complete();
                    }
                }
            };

            http.send(JSON.stringify(sendData.data));
        }

        public getStatus(): TransportStatus {
            return TransportStatus.Ready;
        }

        public sendData(sendData: Entities.SendDataObject): void {
            this.makeRequest(sendData);
            return;
        }
    }
}