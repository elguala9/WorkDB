import { createClientWorkDBWithBrowser } from "workdb/index";
import { testIWorkDB } from './WorkDB.spec.js';
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

const workDb = createClientWorkDBWithBrowser(localStorage);

testIWorkDB(workDb);