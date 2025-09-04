import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb";
export declare class NodeWorkDB implements IWorkDbInternal {
    private _pathDB;
    constructor(pathDb: string);
    exist(input: ItemId): Promise<boolean>;
    writeFile(input: Item & ItemId): Promise<void>;
    getFile(input: ItemId): Promise<ItemOutput>;
    deleteFile(input: ItemId): Promise<void>;
}
