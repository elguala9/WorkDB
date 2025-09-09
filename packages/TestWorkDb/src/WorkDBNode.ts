import { createClientWorkDBWithNode } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.ts';

const workDb = createClientWorkDBWithNode("./db_test_node");

testIWorkDB(workDb);