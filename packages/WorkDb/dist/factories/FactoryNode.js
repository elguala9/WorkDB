import { ClientWorkDB } from "src/ClientWorkDB.js";
import { NodeWorkDB } from "src/NodeWorkDB.js";
export function createClientWorkDBWithNode(pathDb) {
    const nodeWorkDb = new NodeWorkDB(pathDb);
    return ClientWorkDB.getInstance(nodeWorkDb);
}
//# sourceMappingURL=FactoryNode.js.map