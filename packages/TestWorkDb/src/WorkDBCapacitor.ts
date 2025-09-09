import { createClientWorkDBWithCapacitor } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.ts';
import { MockCapacitorFS } from "./MockCapacitorFS.ts";

const workDb = createClientWorkDBWithCapacitor(new MockCapacitorFS());

testIWorkDB(workDb);