import { ClientWorkDB } from "../ClientWorkDB.js";
import { BrowserWorkDB } from "../implementations/BrowserWorkDB.js";

export function createClientWorkDBWithBrowser(localStorage: Storage = window.localStorage): ClientWorkDB {
	const browserWorkDb = new BrowserWorkDB(localStorage);
	return ClientWorkDB.getInstance(browserWorkDb);
}