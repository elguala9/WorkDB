import { createClientWorkDBWithBrowser } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.ts';
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./db_test_browser');

const workDb = createClientWorkDBWithBrowser(localStorage);

testIWorkDB(workDb);