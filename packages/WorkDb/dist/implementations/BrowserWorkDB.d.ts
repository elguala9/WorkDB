import { IWorkFileSystem, Item, ItemOutput } from "iworkdb/IWorkDb";
export declare class BrowserWorkDB implements IWorkFileSystem {
    private _localStorage;
    constructor(localStorage?: Storage);
    writeFile(path: string, input: Item): Promise<void>;
    getFile(path: string): Promise<ItemOutput>;
    deleteFile(path: string): Promise<void>;
    deleteFolder(folderPath: string): Promise<void>;
    exist(path: string): Promise<boolean>;
    renameFile(oldPath: string, newPath: string): Promise<void>;
}
