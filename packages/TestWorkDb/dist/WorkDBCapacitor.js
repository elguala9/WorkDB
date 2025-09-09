import { createClientWorkDBWithCapacitor } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.js';
import { MockCapacitorFS } from "./MockCapacitorFS.js";
const workDb = createClientWorkDBWithCapacitor(new MockCapacitorFS());
testIWorkDB(workDb);
//# sourceMappingURL=WorkDBCapacitor.js.map