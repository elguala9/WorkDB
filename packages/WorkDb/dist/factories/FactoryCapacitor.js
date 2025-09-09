import { Filesystem } from "@capacitor/filesystem";
import { CapacitorWorkDB } from "../implementations/CapacitorWorkDB.js";
import { ClientWorkDB } from "../ClientWorkDB.js";
export function createClientWorkDBWithCapacitor(filesystem = Filesystem) {
    const capacitorWorkDb = new CapacitorWorkDB(filesystem);
    return ClientWorkDB.getInstance(capacitorWorkDb);
}
//# sourceMappingURL=FactoryCapacitor.js.map