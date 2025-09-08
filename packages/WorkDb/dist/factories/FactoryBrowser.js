import { ClientWorkDB } from "../ClientWorkDB.js";
import { BrowserWorkDB } from "../BrowserWorkDB.js";
export function createClientWorkDBWithBrowser(localStorage = window.localStorage) {
    const browserWorkDb = new BrowserWorkDB(localStorage);
    return ClientWorkDB.getInstance(browserWorkDb);
}
//# sourceMappingURL=FactoryBrowser.js.map