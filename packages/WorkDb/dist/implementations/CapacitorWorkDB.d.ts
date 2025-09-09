import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
import { FilesystemPlugin } from "@capacitor/filesystem";
export declare class CapacitorWorkDB implements IWorkDbInternal {
    private _filesystem;
    constructor(filesystem?: FilesystemPlugin);
    private getFilePath;
    renameFile(oldInput: ItemId, newInput: ItemId): Promise<void>;
    exist(input: ItemId): Promise<boolean>;
    writeFile(input: Item & ItemId): Promise<void>;
    getFile(input: ItemId): Promise<ItemOutput>;
    deleteFile(input: ItemId): Promise<void>;
}
