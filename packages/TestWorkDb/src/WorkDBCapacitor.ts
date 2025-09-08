import { createClientWorkDBWithCapacitor } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.js';
import { MockPreferencesPlugin } from "./MockPreferencesPlugin.js";

const workDb = createClientWorkDBWithCapacitor(new MockPreferencesPlugin());

testIWorkDB(workDb);