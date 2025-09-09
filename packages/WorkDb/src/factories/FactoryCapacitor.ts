import { Filesystem, FilesystemPlugin } from "@capacitor/filesystem";
import { CapacitorWorkDB } from "../implementations/CapacitorWorkDB.js";
import { ClientWorkDB } from "../ClientWorkDB.js";


export function createClientWorkDBWithCapacitor(filesystem: FilesystemPlugin = Filesystem): ClientWorkDB {
    const capacitorWorkDb = new CapacitorWorkDB(filesystem);
    return ClientWorkDB.getInstance(capacitorWorkDb);
}