import { Preferences } from "@capacitor/preferences";
import { CapacitorWorkDB } from "src/implementations/CapacitorWorkDB.js";
import { ClientWorkDB } from "../ClientWorkDB.js";
export function createClientWorkDBWithCapacitor(preferences = Preferences) {
    const capacitorWorkDb = new CapacitorWorkDB(preferences);
    return ClientWorkDB.getInstance(capacitorWorkDb);
}
//# sourceMappingURL=FactoryCapacitor.js.map