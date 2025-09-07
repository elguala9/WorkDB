import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
export declare class NodeWorkDB implements IWorkDbInternal {
    private _pathDB;
    constructor(pathDb: string);
    renameFile(oldInput: ItemId, newInput: ItemId): Promise<void>;
    exist(input: ItemId): Promise<boolean>;
    writeFile(input: Item & ItemId): Promise<void>;
    getFile(input: ItemId): Promise<ItemOutput>;
    deleteFile(input: ItemId): Promise<void>;
}
