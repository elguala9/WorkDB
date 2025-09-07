import { createClientWorkDBWithNode } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.js';

const workDb = createClientWorkDBWithNode("./db_test");

testIWorkDB(workDb);