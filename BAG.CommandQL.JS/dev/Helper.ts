namespace BROCKHAUSAG {

    export class Helper {

        public static GenerateGuid(): string {
            let result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0;
                let v = c === "x" ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            return result;
        }

        public static Find(array: any[], property: string, value: any, remove?: boolean) {
            for (let i = 0; i < array.length; i++) {
                let obj = array[i];

                if (obj[property] === value) {
                    if (remove === true) {
                        array.splice(i, 1);
                    }

                    return obj;
                }
            }

            return null;
        }
    }

}