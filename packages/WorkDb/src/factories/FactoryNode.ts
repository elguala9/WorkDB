import { ClientWorkDB } from "../ClientWorkDB.js";
import { NodeWorkDB } from "../implementations/NodeWorkDB.js";

export function createClientWorkDBWithNode(pathDb: string): ClientWorkDB {
	const nodeWorkDb = new NodeWorkDB(pathDb);
	return ClientWorkDB.getInstance(nodeWorkDb);
}