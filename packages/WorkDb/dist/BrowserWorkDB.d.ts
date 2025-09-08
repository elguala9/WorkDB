import { IWorkDbInternal, Item, ItemId, ItemOutput } from "iworkdb/IWorkDb";
export declare class BrowserWorkDB implements IWorkDbInternal {
    private _localStorage;
    constructor(localStorage?: Storage);
    private getKey;
    renameFile(oldInput: ItemId, newInput: ItemId): Promise<void>;
    exist(input: ItemId): Promise<boolean>;
    writeFile(input: Item & ItemId): Promise<void>;
    getFile(input: ItemId): Promise<ItemOutput>;
    deleteFile(input: ItemId): Promise<void>;
}
