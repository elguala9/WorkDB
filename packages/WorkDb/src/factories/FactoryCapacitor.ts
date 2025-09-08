import { Preferences, PreferencesPlugin } from "@capacitor/preferences";
import { CapacitorWorkDB } from "src/implementations/CapacitorWorkDB.js";
import { ClientWorkDB } from "../ClientWorkDB.js";

export function createClientWorkDBWithCapacitor(preferences: PreferencesPlugin = Preferences): ClientWorkDB {
	const capacitorWorkDb = new CapacitorWorkDB(preferences);
	return ClientWorkDB.getInstance(capacitorWorkDb);
}